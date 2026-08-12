import { getComponent, loadComponents } from "../data.js";
import type { Component } from "../schema.js";

const GH_PAGES_BASE = "https://pravoobi.github.io/practics-ui/iframe.html";

/** Returns a list of all resource URIs this server exposes */
export function listResourceUris(): Array<{
  uri: string;
  name: string;
  description: string;
  mimeType: string;
}> {
  const { components } = loadComponents();
  const uris = [];

  for (const c of components) {
    uris.push({
      uri: `practics-ui://component/${c.slug}`,
      name: `${c.name} docs`,
      description: `Full documentation for ${c.name} — props, variants, a11y, examples.`,
      mimeType: "text/markdown",
    });
    for (const story of c.storybook.stories) {
      uris.push({
        uri: `practics-ui://component/${c.slug}/preview/${story.id}`,
        name: `${c.name} — ${story.key} preview`,
        description: `Live Storybook preview of ${c.name} ${story.key} story.`,
        mimeType: "text/html",
      });
    }
  }

  uris.push({
    uri: "practics-ui://index",
    name: "Component index",
    description: "Full components.json index for bulk access.",
    mimeType: "application/json",
  });

  return uris;
}

/** Render component docs as markdown */
export function renderComponentMarkdown(slug: string): string | null {
  const comp = getComponent(slug);
  if (!comp) return null;
  return buildMarkdown(comp);
}

/** Render an iframe-based component preview */
export function renderPreviewHtml(storyId: string, componentName: string): string {
  const url = `${GH_PAGES_BASE}?id=${encodeURIComponent(storyId)}&viewMode=story`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${componentName} preview</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #fafafa; font-family: sans-serif; }
    iframe { display: block; width: 100%; height: 420px; border: none; }
    .toolbar {
      display: flex; align-items: center; gap: 8px;
      padding: 6px 12px; background: #fff;
      border-bottom: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;
    }
    a { color: #6366f1; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="toolbar">
    <strong>${componentName}</strong>
    <a href="${url}" target="_blank" rel="noopener">Open in Storybook ↗</a>
  </div>
  <iframe
    src="${url}"
    sandbox="allow-scripts allow-same-origin"
    title="${componentName} preview"
    loading="lazy"
  ></iframe>
</body>
</html>`;
}

function buildMarkdown(c: Component): string {
  const lines: string[] = [];

  lines.push(`# ${c.name}`);
  lines.push("");
  lines.push(c.description);
  lines.push("");
  lines.push(`**Category:** ${c.category}`);
  if (c.peerRequirements.length > 0) {
    lines.push(`**Peer requirements:** ${c.peerRequirements.join(", ")}`);
  }
  if (c.subcomponents && c.subcomponents.length > 0) {
    lines.push(`**Sub-components:** ${c.subcomponents.join(", ")}`);
  }
  lines.push("");

  // Import
  lines.push("## Import");
  lines.push("");
  lines.push("```tsx");
  if (c.subcomponents && c.subcomponents.length > 0) {
    lines.push(
      `import { ${c.name}, ${c.subcomponents.join(", ")} } from "@practics/ui";`
    );
  } else {
    lines.push(`import { ${c.name} } from "@practics/ui";`);
  }
  lines.push("```");
  lines.push("");

  // Props
  if (c.props.length > 0) {
    lines.push("## Props");
    lines.push("");
    lines.push("| Prop | Type | Required | Default | Description |");
    lines.push("|------|------|----------|---------|-------------|");
    for (const p of c.props) {
      const desc = [p.description ?? "", p.deprecated ? `**Deprecated:** ${p.deprecated}` : ""]
        .filter(Boolean)
        .join(" ");
      const req = p.required ? "✓" : "–";
      const def = p.default ?? "–";
      const type = `\`${p.type}\``;
      lines.push(`| \`${p.name}\` | ${type} | ${req} | ${def} | ${desc} |`);
    }
    lines.push("");
  }

  // Variants
  if (c.variants.length > 0) {
    lines.push("## Variants");
    lines.push("");
    for (const v of c.variants) {
      const vals = v.values.map((val) => `\`${val}\``).join(", ");
      const def = v.default ? ` (default: \`${v.default}\`)` : "";
      lines.push(`- **${v.prop}**${def}: ${vals}`);
    }
    lines.push("");
  }

  // Examples
  if (c.examples.length > 0) {
    lines.push("## Examples");
    lines.push("");
    for (const ex of c.examples) {
      lines.push(`### ${ex.name}`);
      lines.push("");
      lines.push("```tsx");
      lines.push(ex.jsx);
      lines.push("```");
      lines.push("");
    }
  }

  // A11y
  lines.push("## Accessibility");
  lines.push("");
  if (c.a11y.radixPrimitives.length > 0) {
    lines.push(`**Radix primitives used:** ${c.a11y.radixPrimitives.join(", ")}`);
    lines.push("");
  }
  if (c.a11y.guarantees.length > 0) {
    lines.push("**Built-in guarantees:**");
    for (const g of c.a11y.guarantees) lines.push(`- ${g}`);
    lines.push("");
  }
  if (c.a11y.requirements.length > 0) {
    lines.push("**Your responsibilities:**");
    for (const r of c.a11y.requirements) lines.push(`- ${r}`);
    lines.push("");
  }

  // Storybook link
  lines.push("## Storybook");
  lines.push("");
  const firstId = c.storybook.stories[0]?.id ?? `${c.slug}--default`;
  lines.push(
    `[View in Storybook](https://pravoobi.github.io/practics-ui/?path=/docs/${firstId})`
  );
  lines.push("");

  return lines.join("\n");
}
