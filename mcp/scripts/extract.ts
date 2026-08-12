#!/usr/bin/env tsx
/**
 * Extracts component metadata from src/ and stories, writes mcp/generated/components.json.
 * Run via: npm run extract (from mcp/ dir) or npm run mcp:extract (from repo root).
 */

import { Project, Node, SyntaxKind, type SourceFile } from "ts-morph";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, join, dirname } from "path";
import { fileURLToPath } from "url";
import {
  ComponentsJsonSchema,
  type Component,
  type Prop,
  type Variant,
  type Example,
} from "../src/schema.js";
import { OVERRIDES } from "./overrides.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "../..");
const MCP_ROOT = resolve(__dirname, "..");
const SRC_COMPONENTS = join(REPO_ROOT, "src", "components");

const COMPONENTS = [
  // form
  "Button", "Input", "Textarea", "Checkbox", "Select",
  // layout
  "Box", "Stack", "Grid", "Container", "PageHeader",
  // navigation
  "Breadcrumb", "Tabs", "Sidebar",
  // overlay
  "Dialog", "ConfirmDialog",
  // feedback
  "Alert", "Toast", "Progress", "EmptyState",
  // display
  "Card", "Badge", "Avatar", "StatCard",
  // data
  "Table",
  // charts
  "DonutChart", "AreaChart",
] as const;

// React built-in type names to stop recursion at (don't expand HTML attrs)
const REACT_STOP_TYPES = new Set([
  "HTMLAttributes",
  "ButtonHTMLAttributes",
  "InputHTMLAttributes",
  "TextareaHTMLAttributes",
  "AnchorHTMLAttributes",
  "DivHTMLAttributes",
  "FormHTMLAttributes",
  "ImgHTMLAttributes",
  "LiHTMLAttributes",
  "SelectHTMLAttributes",
  "TableHTMLAttributes",
  "ThHTMLAttributes",
  "TdHTMLAttributes",
  "AriaAttributes",
  "DOMAttributes",
  "RefAttributes",
  "PropsWithoutRef",
  "PropsWithRef",
  "PropsWithChildren",
]);

function toSlug(name: string): string {
  return name
    .replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`)
    .replace(/^-/, "");
}

/** Storybook story ID algorithm: title path slug + '--' + story key slug */
function storyId(titlePath: string, storyKey: string): string {
  const slugPath = titlePath
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/\//g, "-");
  const slugKey = storyKey
    .replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`)
    .replace(/^-/, "")
    .toLowerCase();
  return `${slugPath}--${slugKey}`;
}

/** Pretty-print args object node from story source */
function argsNodeToJsx(
  componentName: string,
  storyKey: string,
  argsText: string
): string {
  // Parse simple key: value pairs for concise JSX rendering
  const clean = argsText.replace(/^\{/, "").replace(/\}$/, "").trim();
  if (!clean) return `<${componentName} />`;

  const props = clean
    .split(/,\s*(?=[a-zA-Z_$"])/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((pair) => {
      const colonIdx = pair.indexOf(":");
      if (colonIdx === -1) return pair;
      const key = pair.slice(0, colonIdx).trim().replace(/^["']|["']$/g, "");
      const val = pair.slice(colonIdx + 1).trim();
      // string values → attribute="val", others → attribute={val}
      if (val.startsWith('"') || val.startsWith("'")) {
        const inner = val.replace(/^["']|["']$/g, "");
        if (key === "children") return null; // handle below
        return `${key}=${val.startsWith('"') ? val : `"${inner}"`}`;
      }
      if (key === "children") return null;
      return `${key}={${val}}`;
    })
    .filter(Boolean);

  // Extract children separately
  const childrenMatch = clean.match(/children\s*:\s*["']([^"']+)["']/);
  const children = childrenMatch ? childrenMatch[1] : null;

  const propsStr = props.length ? ` ${props.join(" ")}` : "";
  if (children) {
    return `<${componentName}${propsStr}>${children}</${componentName}>`;
  }
  return `<${componentName}${propsStr} />`;
}

// ─── Prop extraction ──────────────────────────────────────────────────────────

function extractPropsFromInterface(
  file: SourceFile,
  interfaceName: string,
  project: Project,
  visited = new Set<string>()
): Prop[] {
  if (visited.has(interfaceName)) return [];
  visited.add(interfaceName);

  const iface = file.getInterface(interfaceName);
  if (!iface) return [];

  const props: Prop[] = [];

  // Own properties
  for (const member of iface.getProperties()) {
    const name = member.getName();
    if (name.startsWith("_") || name === "ref") continue; // ref handled separately

    const typeNode = member.getTypeNode();
    const typeTxt = typeNode?.getText() ?? member.getType().getText(member);
    const jsDoc = member
      .getJsDocs()
      .map((d) => d.getDescription().trim())
      .filter(Boolean)
      .join(" ");
    const deprecated = member
      .getJsDocs()
      .flatMap((d) => d.getTags())
      .find((t) => t.getTagName() === "deprecated")
      ?.getCommentText()
      ?.trim();

    props.push({
      name,
      type: simplifyType(typeTxt),
      required: !member.hasQuestionToken(),
      ...(member.getInitializer()
        ? { default: member.getInitializer()!.getText() }
        : {}),
      ...(jsDoc ? { description: jsDoc } : {}),
      ...(deprecated ? { deprecated } : {}),
    });
  }

  // Extends clauses
  for (const ext of iface.getExtends()) {
    const exprText = ext.getExpression().getText();
    const typeArgs = ext.getTypeArguments();

    // Skip React built-in types
    const baseName = exprText.replace(/^React\./, "");
    if (REACT_STOP_TYPES.has(baseName)) {
      // Add a summary prop so Claude knows HTML attrs are passed through
      const element = typeArgs[0]?.getText().replace(/HTML(\w+)Element/, "$1") ?? "";
      props.push({
        name: `...HTML${element}Attributes`,
        type: "spreads",
        required: false,
        description: `All standard HTML ${element.toLowerCase()} element attributes are accepted.`,
      });
      continue;
    }

    // Omit<T, K> — expand T then filter K
    if (exprText === "Omit" || exprText.startsWith("Omit<")) {
      const tArg = typeArgs[0]?.getText();
      const kArg = typeArgs[1]?.getText();
      if (tArg) {
        const omitKeys = kArg
          ? kArg
              .replace(/['"]/g, "")
              .split("|")
              .map((s) => s.trim())
          : [];
        const baseProps = resolveTypeReference(tArg, file, project, visited);
        props.push(...baseProps.filter((p) => !omitKeys.includes(p.name)));
      }
      continue;
    }

    // VariantProps<typeof X> — skip; we get variants from stories
    if (exprText.includes("VariantProps")) continue;

    // Local interface resolution
    const baseProps = resolveTypeReference(exprText, file, project, visited);
    props.push(...baseProps);
  }

  return dedupProps(props);
}

function resolveTypeReference(
  typeName: string,
  currentFile: SourceFile,
  project: Project,
  visited: Set<string>
): Prop[] {
  // Try local file first
  const localIface = currentFile.getInterface(typeName);
  if (localIface) {
    return extractPropsFromInterface(
      currentFile,
      typeName,
      project,
      new Set(visited)
    );
  }

  // Try imported file
  for (const importDecl of currentFile.getImportDeclarations()) {
    for (const named of importDecl.getNamedImports()) {
      if (named.getName() === typeName) {
        const moduleSpec = importDecl.getModuleSpecifierValue();
        const resolved = importDecl.getModuleSpecifierSourceFile();
        if (resolved) {
          return extractPropsFromInterface(resolved, typeName, project, new Set(visited));
        }
        // Alias paths like @/components/ui/button
        if (moduleSpec.startsWith("@/")) {
          const aliasPath = join(REPO_ROOT, "src", moduleSpec.slice(2));
          const candidates = [aliasPath + ".tsx", aliasPath + ".ts", aliasPath + "/index.ts"];
          for (const c of candidates) {
            const sf = project.addSourceFileAtPathIfExists(c);
            if (sf) {
              return extractPropsFromInterface(sf, typeName, project, new Set(visited));
            }
          }
        }
        break;
      }
    }
  }

  return [];
}

function simplifyType(raw: string): string {
  return raw
    .replace(/React\.ReactNode/g, "ReactNode")
    .replace(/React\.ReactElement<[^>]+>/g, "ReactElement")
    .replace(/React\.Ref<[^>]+>/g, "Ref<HTMLElement>")
    .replace(/React\.CSSProperties/g, "CSSProperties")
    .replace(/\s+/g, " ")
    .trim();
}

function dedupProps(props: Prop[]): Prop[] {
  const seen = new Set<string>();
  return props.filter((p) => {
    if (seen.has(p.name)) return false;
    seen.add(p.name);
    return true;
  });
}

// ─── Story extraction ─────────────────────────────────────────────────────────

function extractFromStories(
  storyFile: SourceFile,
  componentName: string
): { variants: Variant[]; examples: Example[]; titlePath: string } {
  const variants: Variant[] = [];
  const examples: Example[] = [];
  let titlePath = `Components/${componentName}`;

  // Find default export (meta)
  const defaultExport = storyFile.getDefaultExportSymbol();
  const metaDecl = storyFile
    .getVariableDeclarations()
    .find(
      (v) =>
        v.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression) &&
        storyFile
          .getExportedDeclarations()
          .get("default")
          ?.some((d) => d === v.getNameNode() || d === v.getParent()?.getParent()?.getParent())
    );

  // Get title from meta
  const metaObj = storyFile
    .getStatements()
    .find(
      (s): s is ReturnType<typeof s.asKind> =>
        Node.isVariableStatement(s) &&
        s.getDeclarations().some((d) => d.getName() === "meta")
    );

  if (Node.isVariableStatement(metaObj)) {
    const meta = metaObj.getDeclarations()[0]?.getInitializerIfKind(
      SyntaxKind.ObjectLiteralExpression
    );
    if (meta) {
      const titleProp = meta.getProperty("title");
      if (Node.isPropertyAssignment(titleProp)) {
        titlePath = titleProp
          .getInitializer()
          ?.getText()
          .replace(/^["']|["']$/g, "") ?? titlePath;
      }

      // Extract argTypes → variants
      const argTypesProp = meta.getProperty("argTypes");
      if (Node.isPropertyAssignment(argTypesProp)) {
        const argTypesObj = argTypesProp.getInitializerIfKind(
          SyntaxKind.ObjectLiteralExpression
        );
        if (argTypesObj) {
          for (const prop of argTypesObj.getProperties()) {
            if (!Node.isPropertyAssignment(prop)) continue;
            const propName = prop.getName();
            const propConfig = prop.getInitializerIfKind(
              SyntaxKind.ObjectLiteralExpression
            );
            if (!propConfig) continue;

            const controlProp = propConfig.getProperty("control");
            const optionsProp = propConfig.getProperty("options");

            // Look for options array
            let optionsArray: string[] = [];
            if (Node.isPropertyAssignment(optionsProp)) {
              const arrLit = optionsProp.getInitializerIfKind(
                SyntaxKind.ArrayLiteralExpression
              );
              if (arrLit) {
                optionsArray = arrLit
                  .getElements()
                  .map((el) => el.getText().replace(/^["']|["']$/g, ""));
              }
            }

            if (optionsArray.length > 0) {
              variants.push({ prop: propName, values: optionsArray });
            }
          }
        }
      }

      // Add default variants from defaultVariants if present
      const defaultArgsProp = meta.getProperty("args");
      if (Node.isPropertyAssignment(defaultArgsProp)) {
        const defaultArgs = defaultArgsProp.getInitializerIfKind(
          SyntaxKind.ObjectLiteralExpression
        );
        if (defaultArgs) {
          for (const v of variants) {
            const defaultProp = defaultArgs.getProperty(v.prop);
            if (Node.isPropertyAssignment(defaultProp)) {
              v.default = defaultProp
                .getInitializer()
                ?.getText()
                .replace(/^["']|["']$/g, "");
            }
          }
        }
      }
    }
  }

  // Collect named story exports
  for (const [exportName, decls] of storyFile.getExportedDeclarations()) {
    if (exportName === "default") continue;

    for (const decl of decls) {
      if (!Node.isVariableDeclaration(decl)) continue;
      const init = decl.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
      if (!init) continue;

      const id = storyId(titlePath, exportName);
      let jsx = "";
      const propsJson: Record<string, unknown> = {};

      const argsProp = init.getProperty("args");
      const renderProp = init.getProperty("render");

      if (Node.isPropertyAssignment(argsProp)) {
        const argsText = argsProp.getInitializer()?.getText() ?? "{}";
        jsx = argsNodeToJsx(componentName, exportName, argsText);

        // Attempt simple props JSON extraction
        const argsObj = argsProp.getInitializerIfKind(
          SyntaxKind.ObjectLiteralExpression
        );
        if (argsObj) {
          for (const p of argsObj.getProperties()) {
            if (!Node.isPropertyAssignment(p)) continue;
            const key = p.getName();
            const val = p.getInitializer();
            if (!val) continue;
            const text = val.getText().replace(/^["']|["']$/g, "");
            // Only primitives in propsJson; skip JSX elements
            if (
              val.getKind() === SyntaxKind.StringLiteral ||
              val.getKind() === SyntaxKind.NumericLiteral ||
              val.getKind() === SyntaxKind.TrueKeyword ||
              val.getKind() === SyntaxKind.FalseKeyword
            ) {
              propsJson[key] = text;
            }
          }
        }
      } else if (Node.isPropertyAssignment(renderProp)) {
        // render: () => (<JSX />) — capture the return expression text
        const renderFn = renderProp.getInitializer();
        if (renderFn) {
          const bodyText = renderFn.getText();
          // Strip arrow + parens to get the JSX body
          jsx = bodyText
            .replace(/^\s*\([^)]*\)\s*=>\s*/, "")
            .replace(/^\s*\(\s*([\s\S]*)\s*\)\s*$/, "$1")
            .trim();
          // Trim to first 800 chars for large render examples
          if (jsx.length > 800) jsx = jsx.slice(0, 800) + "\n  {/* ... */}";
        }
      }

      if (jsx) {
        examples.push({
          name: exportName,
          storyId: id,
          ...(Object.keys(propsJson).length > 0 ? { propsJson } : {}),
          jsx,
        });
      }
    }
  }

  return { variants, examples, titlePath };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const project = new Project({
    tsConfigFilePath: join(REPO_ROOT, "tsconfig.json"),
    skipAddingFilesFromTsConfig: false,
    skipFileDependencyResolution: false,
  });

  const libPkg = JSON.parse(
    readFileSync(join(REPO_ROOT, "package.json"), "utf8")
  ) as { version: string; name: string };

  const components: Component[] = [];

  for (const name of COMPONENTS) {
    console.log(`Extracting ${name}...`);
    const override = OVERRIDES[name];
    if (!override) throw new Error(`Missing override entry for ${name}`);

    const compDir = join(SRC_COMPONENTS, name);
    const typesPath = join(compDir, `${name}.types.ts`);
    const storyPath = join(compDir, `${name}.stories.tsx`);

    // Props from types file
    const typesFile = project.addSourceFileAtPathIfExists(typesPath);
    let props: Prop[] = [];
    if (typesFile) {
      // Find the primary interface (e.g. ButtonProps)
      const primaryInterface = `${name}Props`;
      props = extractPropsFromInterface(typesFile, primaryInterface, project);
    }

    // Add ref prop for components that accept one (React 19 — plain prop, no forwardRef)
    const refElementMap: Partial<Record<string, string>> = {
      Button: "HTMLButtonElement",
      Input: "HTMLInputElement",
      Textarea: "HTMLTextAreaElement",
      Checkbox: "HTMLButtonElement",
      Select: "HTMLButtonElement",
      Dialog: "HTMLDivElement",
      ConfirmDialog: "HTMLDivElement",
      Card: "HTMLDivElement",
      Box: "HTMLElement",
      Container: "HTMLDivElement",
      Alert: "HTMLDivElement",
      Progress: "HTMLDivElement",
    };
    const refEl = refElementMap[name];
    if (refEl) {
      props.unshift({
        name: "ref",
        type: `Ref<${refEl}>`,
        required: false,
        description: "React 19 ref — pass directly, no forwardRef needed.",
      });
    }

    // Variants + examples from stories
    let variants: Variant[] = [];
    let examples: Example[] = [];
    let titlePath = `Components/${name}`;

    const storyFile = project.addSourceFileAtPathIfExists(storyPath);
    if (storyFile) {
      const result = extractFromStories(storyFile, name);
      variants = result.variants;
      examples = result.examples;
      titlePath = result.titlePath;
    }

    components.push({
      name,
      slug: toSlug(name),
      description: override.description,
      category: override.category,
      props,
      variants,
      examples,
      a11y: override.a11y,
      peerRequirements: override.peerRequirements ?? [],
      source: {
        path: `src/components/${name}/${name}.tsx`,
      },
      storybook: {
        titlePath,
        stories: examples.map((e) => ({ key: e.name, id: e.storyId })),
      },
      ...(override.subcomponents ? { subcomponents: override.subcomponents } : {}),
    });
  }

  const output = {
    schemaVersion: "1" as const,
    library: {
      name: libPkg.name,
      version: libPkg.version,
      publishedAt: new Date().toISOString(),
    },
    components,
  };

  // Validate against zod schema before writing
  ComponentsJsonSchema.parse(output);

  const outDir = join(MCP_ROOT, "generated");
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "components.json");
  writeFileSync(outPath, JSON.stringify(output, null, 2) + "\n");

  console.log(`\nWrote ${outPath}`);
  console.log(`  Components: ${components.length}`);
  for (const c of components) {
    console.log(
      `  ${c.name}: ${c.props.length} props, ${c.variants.length} variants, ${c.examples.length} examples`
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
