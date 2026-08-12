import { z } from "zod";
import { loadComponents } from "../data.js";

export const listComponentsInputSchema = z.object({
  category: z
    .string()
    .optional()
    .describe("Filter by category e.g. 'form', 'overlay', 'layout'"),
});

export type ListComponentsInput = z.infer<typeof listComponentsInputSchema>;

export function listComponents({ category }: ListComponentsInput) {
  const { components, library } = loadComponents();

  const filtered = category
    ? components.filter((c) => c.category === category)
    : components;

  const items = filtered.map((c) => ({
    name: c.name,
    slug: c.slug,
    category: c.category,
    description: c.description,
    variantProps: c.variants.map((v) => v.prop),
    exampleCount: c.examples.length,
  }));

  return {
    library: `${library.name}@${library.version}`,
    totalComponents: components.length,
    shown: items.length,
    components: items,
  };
}
