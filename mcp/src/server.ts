import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { loadComponents, getComponent } from "./data.js";
import { listComponents, listComponentsInputSchema } from "./tools/list_components.js";
import { getComponentData, getComponentInputSchema } from "./tools/get_component.js";
import { getExample, getExampleInputSchema } from "./tools/get_example.js";
import { renderComponentMarkdown, renderPreviewHtml } from "./resources/component.js";

export function createServer(): McpServer {
  const { library } = loadComponents();

  const server = new McpServer({
    name: "@practics/ui-mcp",
    version: library.version,
  });

  // ── Tools ──────────────────────────────────────────────────────────────────

  server.tool(
    "list_components",
    "List all available @practics/ui components with one-line descriptions and category. " +
      "Use this first to discover what's available before calling get_component. " +
      "Optionally filter by category ('form', 'overlay', 'layout', 'feedback', 'data').",
    listComponentsInputSchema.shape,
    async (args) => {
      const result = listComponents(args as Parameters<typeof listComponents>[0]);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    "get_component",
    "Get full metadata for a single @practics/ui component: props (with types), " +
      "variants (all values), accessibility notes, and usage examples. " +
      "Call list_components first if you don't know the component name. " +
      "Prefer requesting only the fields you need to keep responses compact.",
    getComponentInputSchema.shape,
    async (args) => {
      const result = getComponentData(args as Parameters<typeof getComponentData>[0]);
      const error = typeof result.error === "string" ? result.error : null;
      if (error) {
        return { content: [{ type: "text" as const, text: error }], isError: true };
      }
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    "get_example",
    "Get a runnable JSX example and live Storybook preview URL for a component. " +
      "Pass variant to target a specific story (e.g. 'Destructive', 'WithError', 'Loading'). " +
      "The returned previewUrl opens the story directly in the hosted Storybook.",
    getExampleInputSchema.shape,
    async (args) => {
      const result = getExample(args as Parameters<typeof getExample>[0]);
      const error = typeof result.error === "string" ? result.error : null;
      if (error) {
        return { content: [{ type: "text" as const, text: error }], isError: true };
      }
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // ── Resources ─────────────────────────────────────────────────────────────
  // SDK v1.x: static URIs are exact-match; use ResourceTemplate for parameterized URIs.

  // Component markdown docs — practics-ui://component/{slug}
  server.resource(
    "component-docs",
    new ResourceTemplate("practics-ui://component/{slug}", {
      list: async () => {
        const { components } = loadComponents();
        return {
          resources: components.map((c) => ({
            uri: `practics-ui://component/${c.slug}`,
            name: `${c.name} docs`,
            description: `Props, variants, a11y, and examples for ${c.name}.`,
            mimeType: "text/markdown",
          })),
        };
      },
    }),
    async (uri, { slug }) => {
      const md = renderComponentMarkdown(slug as string);
      if (!md) {
        return {
          contents: [
            {
              uri: uri.href,
              text: `Component '${slug}' not found.`,
              mimeType: "text/plain",
            },
          ],
        };
      }
      return { contents: [{ uri: uri.href, text: md, mimeType: "text/markdown" }] };
    }
  );

  // Component Storybook preview — practics-ui://component/{slug}/preview/{storyId}
  server.resource(
    "component-preview",
    new ResourceTemplate("practics-ui://component/{slug}/preview/{storyId}", {
      list: async () => {
        const { components } = loadComponents();
        const resources = components.flatMap((c) =>
          c.storybook.stories.map((s) => ({
            uri: `practics-ui://component/${c.slug}/preview/${s.id}`,
            name: `${c.name} — ${s.key} preview`,
            description: `Live Storybook iframe for ${c.name} ${s.key} story.`,
            mimeType: "text/html",
          }))
        );
        return { resources };
      },
    }),
    async (uri, { slug, storyId }) => {
      const comp = getComponent(slug as string);
      const html = renderPreviewHtml(storyId as string, comp?.name ?? (slug as string));
      return { contents: [{ uri: uri.href, text: html, mimeType: "text/html" }] };
    }
  );

  // Full index — static URI
  server.resource(
    "component-index",
    "practics-ui://index",
    {
      description: "Full components.json — all metadata in one payload.",
      mimeType: "application/json",
    },
    async (uri) => {
      const data = loadComponents();
      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify(data, null, 2),
            mimeType: "application/json",
          },
        ],
      };
    }
  );

  return server;
}
