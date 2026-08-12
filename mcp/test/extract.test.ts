/**
 * Unit tests for extractor helpers.
 * These run without ts-morph (no TS project needed) to stay fast.
 */

import { describe, it, expect } from "vitest";

// ── Story ID generation ───────────────────────────────────────────────────────

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

describe("storyId", () => {
  it("converts simple title + key", () => {
    expect(storyId("Components/Button", "Default")).toBe("components-button--default");
  });

  it("kebab-cases PascalCase story keys", () => {
    expect(storyId("Components/Button", "WithIconLeft")).toBe(
      "components-button--with-icon-left"
    );
  });

  it("handles multi-segment titles", () => {
    expect(storyId("Components/Dialog", "Confirmation")).toBe(
      "components-dialog--confirmation"
    );
  });

  it("handles single-word story key", () => {
    expect(storyId("Components/Input", "Password")).toBe("components-input--password");
  });
});

// ── JSX builder ───────────────────────────────────────────────────────────────

function argsNodeToJsx(componentName: string, argsText: string): string {
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
      if (val.startsWith('"') || val.startsWith("'")) {
        const inner = val.replace(/^["']|["']$/g, "");
        if (key === "children") return null;
        return `${key}="${inner}"`;
      }
      if (key === "children") return null;
      return `${key}={${val}}`;
    })
    .filter(Boolean);

  const childrenMatch = clean.match(/children\s*:\s*["']([^"']+)["']/);
  const children = childrenMatch ? childrenMatch[1] : null;
  const propsStr = props.length ? ` ${props.join(" ")}` : "";
  if (children) return `<${componentName}${propsStr}>${children}</${componentName}>`;
  return `<${componentName}${propsStr} />`;
}

describe("argsNodeToJsx", () => {
  it("renders a button with string children", () => {
    expect(argsNodeToJsx("Button", `{ children: "Click me" }`)).toBe(
      "<Button>Click me</Button>"
    );
  });

  it("renders boolean props as JSX expressions", () => {
    expect(argsNodeToJsx("Button", `{ children: "Go", loading: true }`)).toBe(
      "<Button loading={true}>Go</Button>"
    );
  });

  it("renders string variant prop", () => {
    expect(argsNodeToJsx("Button", `{ children: "Delete", variant: "destructive" }`)).toBe(
      `<Button variant="destructive">Delete</Button>`
    );
  });

  it("returns self-closing tag for no args", () => {
    expect(argsNodeToJsx("Input", "{}")).toBe("<Input />");
  });
});

// ── Schema validation ─────────────────────────────────────────────────────────

import { ComponentsJsonSchema } from "../src/schema.js";

describe("ComponentsJsonSchema", () => {
  it("accepts a valid minimal components.json", () => {
    const valid = {
      schemaVersion: "1" as const,
      library: { name: "@practics/ui", version: "0.2.0", publishedAt: new Date().toISOString() },
      components: [
        {
          name: "Button",
          slug: "button",
          description: "A button.",
          category: "form",
          props: [
            { name: "variant", type: "string", required: false },
          ],
          variants: [{ prop: "variant", values: ["default", "destructive"] }],
          examples: [
            { name: "Default", storyId: "components-button--default", jsx: "<Button>Click</Button>" },
          ],
          a11y: {
            radixPrimitives: [],
            guarantees: ["Uses native <button>."],
            requirements: ["Needs accessible label."],
          },
          peerRequirements: [],
          source: { path: "src/components/Button/Button.tsx" },
          storybook: {
            titlePath: "Components/Button",
            stories: [{ key: "Default", id: "components-button--default" }],
          },
        },
      ],
    };
    expect(() => ComponentsJsonSchema.parse(valid)).not.toThrow();
  });

  it("rejects wrong schemaVersion", () => {
    const invalid = { schemaVersion: "2", library: {}, components: [] };
    expect(() => ComponentsJsonSchema.parse(invalid)).toThrow();
  });

  it("rejects missing required component fields", () => {
    const invalid = {
      schemaVersion: "1",
      library: { name: "x", version: "1.0.0", publishedAt: new Date().toISOString() },
      components: [{ name: "Btn" }],
    };
    expect(() => ComponentsJsonSchema.parse(invalid)).toThrow();
  });
});
