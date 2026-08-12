import { z } from "zod";
import { getComponent } from "../data.js";

export const getExampleInputSchema = z.object({
  name: z.string().describe("Component name or slug"),
  variant: z
    .string()
    .optional()
    .describe(
      "Story name or variant value to look for (e.g. 'Destructive', 'loading'). Returns the best match."
    ),
});

export type GetExampleInput = z.infer<typeof getExampleInputSchema>;

const GH_PAGES_BASE =
  "https://pravoobi.github.io/practics-ui/iframe.html";

export function getExample({ name, variant }: GetExampleInput) {
  const comp = getComponent(name);
  if (!comp) {
    return {
      error: `Component '${name}' not found. Use list_components to see available components.`,
    };
  }

  if (comp.examples.length === 0) {
    return { error: `No examples found for '${name}'.` };
  }

  // Find best matching example
  let example = comp.examples[0]!;
  if (variant) {
    const v = variant.toLowerCase();
    const match = comp.examples.find(
      (e) =>
        e.name.toLowerCase() === v ||
        e.name.toLowerCase().includes(v) ||
        Object.values(e.propsJson ?? {}).some(
          (val) => String(val).toLowerCase() === v
        )
    );
    if (match) example = match;
  }

  const previewUrl = `${GH_PAGES_BASE}?id=${encodeURIComponent(example.storyId)}&viewMode=story`;

  return {
    component: comp.name,
    example: {
      name: example.name,
      storyId: example.storyId,
      jsx: example.jsx,
      ...(example.propsJson ? { props: example.propsJson } : {}),
    },
    previewUrl,
    previewResourceUri: `practics-ui://component/${comp.slug}/preview/${example.storyId}`,
    allExamples: comp.examples.map((e) => e.name),
  };
}
