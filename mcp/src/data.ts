import { createRequire } from "module";
import { ComponentsJsonSchema, type ComponentsJson, type Component } from "./schema.js";

let _cache: ComponentsJson | null = null;

export function loadComponents(): ComponentsJson {
  if (_cache) return _cache;

  // Bundled at publish time — resolves from package root
  const require = createRequire(import.meta.url);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = require("../generated/components.json") as any;

  _cache = ComponentsJsonSchema.parse(raw);
  return _cache;
}

export function getComponent(name: string): Component | undefined {
  const { components } = loadComponents();
  return components.find(
    (c) => c.name.toLowerCase() === name.toLowerCase() || c.slug === name.toLowerCase()
  );
}

export function searchComponents(query: string, limit = 5): Component[] {
  const { components } = loadComponents();
  // Score each token independently so multi-word queries work
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);

  const scored = components.map((c) => {
    let score = 0;
    for (const q of tokens) {
      if (c.name.toLowerCase() === q) score += 100;
      if (c.name.toLowerCase().includes(q)) score += 50;
      if (c.slug.includes(q)) score += 40;
      if (c.description.toLowerCase().includes(q)) score += 20;
      if (c.category.toLowerCase().includes(q)) score += 15;
      if (c.props.some((p) => p.name.toLowerCase().includes(q))) score += 10;
      if (c.a11y.guarantees.some((g) => g.toLowerCase().includes(q))) score += 5;
    }
    return { c, score };
  });
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.c);
}
