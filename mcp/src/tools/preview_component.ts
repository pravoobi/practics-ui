import { z } from "zod";
import { getComponent } from "../data.js";
import { renderPreviewHtml } from "../resources/component.js";

export const previewComponentInputSchema = z.object({
  name: z.string().describe("Component name or slug"),
  variant: z
    .string()
    .optional()
    .describe("Story name to preview (e.g. 'Destructive', 'WithError'). Defaults to the first story."),
  height: z
    .number()
    .int()
    .min(100)
    .max(900)
    .optional()
    .describe("Iframe height in pixels. Defaults to 420."),
});

export type PreviewComponentInput = z.infer<typeof previewComponentInputSchema>;

const GH_PAGES_BASE = "https://pravoobi.github.io/practics-ui/iframe.html";

export function previewComponent({ name, variant, height = 420 }: PreviewComponentInput) {
  const comp = getComponent(name);
  if (!comp) {
    return {
      error: `Component '${name}' not found. Use list_components to see available components.`,
    };
  }

  if (comp.storybook.stories.length === 0) {
    return { error: `No stories found for '${name}'.` };
  }

  // Pick best matching story
  let story = comp.storybook.stories[0]!;
  if (variant) {
    const v = variant.toLowerCase();
    const match = comp.storybook.stories.find(
      (s) => s.key.toLowerCase() === v || s.key.toLowerCase().includes(v)
    );
    if (match) story = match;
  }

  const previewUrl = `${GH_PAGES_BASE}?id=${encodeURIComponent(story.id)}&viewMode=story`;
  const storybookUrl = `https://pravoobi.github.io/practics-ui/?path=/story/${story.id}`;

  return {
    component: comp.name,
    story: story.key,
    storyId: story.id,
    previewUrl,
    storybookUrl,
    resourceUri: `practics-ui://component/${comp.slug}/preview/${story.id}`,
    availableStories: comp.storybook.stories.map((s) => s.key),
    // HTML for clients that can render tool response content
    html: renderPreviewHtml(story.id, comp.name, height),
  };
}
