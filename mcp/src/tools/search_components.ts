import { z } from "zod";
import { searchComponents } from "../data.js";

export const searchComponentsInputSchema = z.object({
  query: z
    .string()
    .describe(
      "Natural language or keyword query — e.g. 'form field with error state', 'overlay', 'chart', 'navigation menu'."
    ),
  limit: z
    .number()
    .int()
    .min(1)
    .max(20)
    .optional()
    .describe("Max results to return. Defaults to 5."),
});

export type SearchComponentsInput = z.infer<typeof searchComponentsInputSchema>;

export function searchComponentsTool({ query, limit = 5 }: SearchComponentsInput) {
  const results = searchComponents(query, limit);

  if (results.length === 0) {
    return {
      query,
      found: 0,
      results: [],
      hint: "Try broader terms like 'form', 'layout', 'overlay', 'data', or 'feedback'.",
    };
  }

  return {
    query,
    found: results.length,
    results: results.map((c) => ({
      name: c.name,
      slug: c.slug,
      category: c.category,
      description: c.description,
      variantProps: c.variants.map((v) => v.prop),
    })),
  };
}
