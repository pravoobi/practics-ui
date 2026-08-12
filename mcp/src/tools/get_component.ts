import { z } from "zod";
import { getComponent } from "../data.js";

const IncludeField = z.enum(["props", "variants", "examples", "a11y", "source"]);

export const getComponentInputSchema = z.object({
  name: z.string().describe("Component name (e.g. 'Button') or slug (e.g. 'button')"),
  include: z
    .array(IncludeField)
    .optional()
    .describe(
      "Fields to include. Omit for all fields except source. 'source' adds the file path."
    ),
});

export type GetComponentInput = z.infer<typeof getComponentInputSchema>;

export function getComponentData({ name, include }: GetComponentInput) {
  const comp = getComponent(name);
  if (!comp) {
    return {
      error: `Component '${name}' not found. Use list_components to see available components.`,
    };
  }

  const fields = include ?? (["props", "variants", "examples", "a11y"] as const);
  const result: Record<string, unknown> = {
    name: comp.name,
    slug: comp.slug,
    description: comp.description,
    category: comp.category,
    peerRequirements: comp.peerRequirements,
    storybook: {
      url: storycBookUrl(comp.storybook.titlePath, comp.storybook.stories[0]?.id),
    },
  };

  if (comp.subcomponents) result.subcomponents = comp.subcomponents;
  if (fields.includes("props")) result.props = comp.props;
  if (fields.includes("variants")) result.variants = comp.variants;
  if (fields.includes("examples")) result.examples = comp.examples;
  if (fields.includes("a11y")) result.a11y = comp.a11y;
  if (fields.includes("source")) result.source = comp.source;

  return result;
}

function storycBookUrl(titlePath: string, firstStoryId?: string): string {
  const slug = titlePath.toLowerCase().replace(/\s+/g, "-").replace(/\//g, "-");
  const id = firstStoryId ?? `${slug}--default`;
  return `https://pravoobi.github.io/practics-ui/?path=/docs/${id}`;
}
