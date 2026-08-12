import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { loadComponents, getComponent } from "./data.js";
import { listComponents, listComponentsInputSchema } from "./tools/list_components.js";
import { getComponentData, getComponentInputSchema } from "./tools/get_component.js";
import { getExample, getExampleInputSchema } from "./tools/get_example.js";
import { searchComponentsTool, searchComponentsInputSchema } from "./tools/search_components.js";
import { checkProps, checkPropsInputSchema } from "./tools/check_props.js";
import { previewComponent, previewComponentInputSchema } from "./tools/preview_component.js";
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

  server.tool(
    "search_components",
    "Search @practics/ui components by keyword or natural language. " +
      "Use when you know the kind of thing you need but not the exact component name. " +
      "Examples: 'form field with error state', 'data visualisation', 'navigation menu', 'modal'.",
    searchComponentsInputSchema.shape,
    async (args) => {
      const result = searchComponentsTool(args as Parameters<typeof searchComponentsTool>[0]);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    "check_props",
    "Validate a set of props against a component's declared API before writing code. " +
      "Catches missing required props, invalid enum values, and unknown prop names. " +
      "Always run this when you are unsure whether a prop value is valid.",
    checkPropsInputSchema.shape,
    async (args) => {
      const result = checkProps(args as Parameters<typeof checkProps>[0]);
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
    "preview_component",
    "Get a live Storybook preview URL and embedded HTML for a component story. " +
      "Returns a previewUrl you can open in a browser and an HTML snippet with an iframe for clients that render HTML content. " +
      "Use get_example for JSX code snippets; use this tool when you need the visual preview link.",
    previewComponentInputSchema.shape,
    async (args) => {
      const result = previewComponent(args as Parameters<typeof previewComponent>[0]);
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
