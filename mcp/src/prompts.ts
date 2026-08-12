/**
 * MCP Prompts — scaffold templates for common UI patterns.
 * Each prompt returns a user-role message that instructs the LLM to generate
 * idiomatic @practics/ui code.
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

function userMessage(text: string) {
  return { messages: [{ role: "user" as const, content: { type: "text" as const, text } }] };
}

export function registerPrompts(server: McpServer): void {
  // ── scaffold-form ────────────────────────────────────────────────────────────

  server.prompt(
    "scaffold-form",
    "Generate a complete, accessible form using @practics/ui components. " +
      "Produces a TypeScript React component with react-hook-form, Zod validation, " +
      "accessible labels, error states, and a submit button.",
    {
      fields: z
        .string()
        .describe(
          "Comma-separated list of field names and types, e.g. 'name:text, email:email, message:textarea, subscribe:checkbox'"
        ),
      formName: z
        .string()
        .optional()
        .describe("Name for the generated component, e.g. 'ContactForm'"),
      submitLabel: z
        .string()
        .optional()
        .describe("Label for the submit button. Defaults to 'Submit'"),
    },
    ({ fields, formName = "MyForm", submitLabel = "Submit" }) => {
      const fieldList = fields
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean)
        .map((f) => {
          const [name, type = "text"] = f.split(":").map((s) => s.trim());
          return `  - ${name} (${type})`;
        })
        .join("\n");

      return userMessage(`Generate a complete, accessible React form component using @practics/ui.

**Component name:** ${formName}
**Fields:**
${fieldList}
**Submit button label:** ${submitLabel}

Requirements:
- Import from \`@practics/ui\`: \`Button\`, \`Input\`, \`Textarea\` (for textarea fields), \`Checkbox\` (for checkbox fields), \`Select\` (for select fields).
- Use react-hook-form with a Zod schema for validation.
- Every \`<Input>\` and \`<Textarea>\` must have a matching \`<label htmlFor=...\` or \`aria-label\`.
- Show inline error messages using the \`error\` prop on \`Input\`/\`Textarea\`/\`Checkbox\`.
- The submit \`<Button>\` should set \`disabled={isSubmitting}\` and show a loading state.
- Use TypeScript. Export the component as default.
- Do not add extra dependencies beyond react-hook-form and zod.
- Format with 2-space indentation.`);
    }
  );

  // ── scaffold-data-table ──────────────────────────────────────────────────────

  server.prompt(
    "scaffold-data-table",
    "Generate a typed data table using @practics/ui Table with TanStack Table v8. " +
      "Produces column definitions, a data type, and a ready-to-use table component.",
    {
      columns: z
        .string()
        .describe(
          "Comma-separated column definitions, e.g. 'name:string, email:string, role:string, createdAt:Date'"
        ),
      rowType: z
        .string()
        .optional()
        .describe("TypeScript type name for a row, e.g. 'User'. Defaults to 'Row'"),
      features: z
        .string()
        .optional()
        .describe(
          "Optional comma-separated features to include: 'sorting', 'filtering', 'pagination'"
        ),
    },
    ({ columns, rowType = "Row", features = "" }) => {
      const colList = columns
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean)
        .map((c) => {
          const [col, type = "string"] = c.split(":").map((s) => s.trim());
          return `  - ${col}: ${type}`;
        })
        .join("\n");

      const featureList = features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean);

      return userMessage(`Generate a typed data table component using @practics/ui and TanStack Table v8.

**Row type name:** ${rowType}
**Columns:**
${colList}
${featureList.length > 0 ? `**Features:** ${featureList.join(", ")}` : ""}

Requirements:
- Import \`Table\` from \`@practics/ui\`.
- Define a \`${rowType}\` TypeScript interface with the columns listed above.
- Create column definitions using \`createColumnHelper<${rowType}>()\` from \`@tanstack/react-table\`.
- Wire up \`useReactTable\` with \`getCoreRowModel()\`${featureList.includes("sorting") ? ", `getSortedRowModel()`" : ""}${featureList.includes("filtering") ? ", `getFilteredRowModel()`" : ""}${featureList.includes("pagination") ? ", `getPaginationRowModel()`" : ""}.
- Render using the \`<Table>\` component from @practics/ui — pass the \`table\` instance via the \`table\` prop.
- Accept a \`data: ${rowType}[]\` prop.
${featureList.includes("sorting") ? "- Add clickable column headers that toggle sort direction (aria-sort attribute).\n" : ""
}${featureList.includes("filtering") ? "- Add a search \`<Input>\` above the table for global filter.\n" : ""
}${featureList.includes("pagination") ? "- Add Previous/Next \`<Button>\` controls below the table.\n" : ""
}- Export the component as default. Use TypeScript with 2-space indentation.`);
    }
  );

  // ── scaffold-dashboard ───────────────────────────────────────────────────────

  server.prompt(
    "scaffold-dashboard",
    "Generate a responsive dashboard layout using @practics/ui components. " +
      "Includes a sidebar, stat cards, a chart, and a data table arranged in a grid.",
    {
      title: z
        .string()
        .optional()
        .describe("Page title shown in the header. Defaults to 'Dashboard'"),
      stats: z
        .string()
        .optional()
        .describe(
          "Comma-separated stat labels to show as StatCard, e.g. 'Total Revenue, Active Users, Conversion Rate'"
        ),
      chartType: z
        .enum(["donut", "area", "none"])
        .optional()
        .describe("Type of chart to include. Defaults to 'area'"),
    },
    ({ title = "Dashboard", stats = "Total Revenue, Active Users, New Signups", chartType = "area" }) => {
      const statList = stats
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => `  - ${s}`)
        .join("\n");

      const chartComponent = chartType === "donut" ? "DonutChart" : chartType === "area" ? "AreaChart" : null;

      return userMessage(`Generate a complete responsive dashboard page using @practics/ui.

**Page title:** ${title}
**Stat cards:**
${statList}
${chartComponent ? `**Chart:** ${chartComponent}` : "**Chart:** none (skip chart section)"}

Requirements:
- Import from \`@practics/ui\`: \`Sidebar\`, \`PageHeader\`, \`Grid\`, \`Stack\`, \`StatCard\`, \`Card\`${chartComponent ? `, \`${chartComponent}\`` : ""}, \`Table\`, \`Badge\`.
- Layout: full-height flex container with \`<Sidebar>\` on the left (collapsible on mobile) and main content on the right.
- Main content: \`<PageHeader title="${title}" />\`, then a \`<Grid cols={${Math.min(4, stats.split(",").length)}}\>\` of \`<StatCard>\` components, ${chartComponent ? `then a \`<Card>\` containing a \`<${chartComponent}>\` with sample data,` : ""} then a \`<Card>\` containing a \`<Table>\` with 3–5 sample columns.
- Each \`<StatCard>\` should have a plausible \`label\`, \`value\`, and \`trend\` prop.
- Use \`<Badge>\` to indicate status in the table.
- Wrap in a named export \`${title.replace(/\s+/g, "")}Page\` and a default export.
- Provide realistic placeholder data (no real API calls).
- Use TypeScript with 2-space indentation.`);
    }
  );
}
