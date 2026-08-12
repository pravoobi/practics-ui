import { z } from "zod";

export const SCHEMA_VERSION = "1" as const;

export const PropSchema = z.object({
  name: z.string(),
  type: z.string(),
  required: z.boolean(),
  default: z.string().optional(),
  description: z.string().optional(),
  deprecated: z.string().optional(),
});
export type Prop = z.infer<typeof PropSchema>;

export const VariantSchema = z.object({
  prop: z.string(),
  values: z.array(z.string()),
  default: z.string().optional(),
});
export type Variant = z.infer<typeof VariantSchema>;

export const ExampleSchema = z.object({
  name: z.string(),
  storyId: z.string(),
  propsJson: z.record(z.string(), z.unknown()).optional(),
  jsx: z.string(),
});
export type Example = z.infer<typeof ExampleSchema>;

export const AxeReportSchema = z.object({
  tested: z.boolean(),
  passed: z.number(),
  failed: z.number(),
  violations: z.array(z.string()),
  runAt: z.string(),
}).optional();
export type AxeReport = z.infer<typeof AxeReportSchema>;

export const A11yInfoSchema = z.object({
  radixPrimitives: z.array(z.string()),
  guarantees: z.array(z.string()),
  requirements: z.array(z.string()),
  axeReport: AxeReportSchema,
});
export type A11yInfo = z.infer<typeof A11yInfoSchema>;

export const StoryRefSchema = z.object({
  key: z.string(),
  id: z.string(),
});

export const ComponentSchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  category: z.string(),
  props: z.array(PropSchema),
  variants: z.array(VariantSchema),
  examples: z.array(ExampleSchema),
  a11y: A11yInfoSchema,
  peerRequirements: z.array(z.string()),
  source: z.object({ path: z.string() }),
  storybook: z.object({
    titlePath: z.string(),
    stories: z.array(StoryRefSchema),
  }),
  subcomponents: z.array(z.string()).optional(),
});
export type Component = z.infer<typeof ComponentSchema>;

export const ComponentsJsonSchema = z.object({
  schemaVersion: z.literal(SCHEMA_VERSION),
  library: z.object({
    name: z.string(),
    version: z.string(),
    publishedAt: z.string(),
  }),
  components: z.array(ComponentSchema),
});
export type ComponentsJson = z.infer<typeof ComponentsJsonSchema>;
