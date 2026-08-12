/**
 * Integration test: in-process MCP client ↔ server round-trips.
 * Reads the real generated/components.json — run `npm run extract` first.
 */

import { describe, it, expect, beforeAll } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createServer } from "../src/server.js";

let client: Client;

beforeAll(async () => {
  const server = createServer();
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

  client = new Client({ name: "test-client", version: "1.0.0" });
  await Promise.all([
    client.connect(clientTransport),
    server.connect(serverTransport),
  ]);
});

// ── Tool: list_components ─────────────────────────────────────────────────────

describe("list_components tool", () => {
  it("returns all 7 tools in the tools list", async () => {
    const { tools } = await client.listTools();
    const names = tools.map((t) => t.name);
    expect(names).toContain("list_components");
    expect(names).toContain("get_component");
    expect(names).toContain("get_example");
    expect(names).toContain("search_components");
    expect(names).toContain("check_props");
    expect(names).toContain("preview_component");
    expect(names).toContain("get_a11y_requirements");
  });

  it("lists all 26 components", async () => {
    const res = await client.callTool({ name: "list_components", arguments: {} });
    const content = res.content[0];
    expect(content.type).toBe("text");
    const data = JSON.parse((content as { type: "text"; text: string }).text);
    const names: string[] = data.components.map((c: { name: string }) => c.name);
    expect(names).toContain("Button");
    expect(names).toContain("Input");
    expect(names).toContain("Dialog");
    expect(names).toContain("Select");
    expect(names).toContain("DonutChart");
    expect(data.totalComponents).toBeGreaterThanOrEqual(25);
  });

  it("filters by category", async () => {
    const res = await client.callTool({
      name: "list_components",
      arguments: { category: "form" },
    });
    const content = res.content[0] as { type: "text"; text: string };
    const data = JSON.parse(content.text);
    expect(data.components.every((c: { category: string }) => c.category === "form")).toBe(true);
  });
});

// ── Tool: get_component ───────────────────────────────────────────────────────

describe("get_component tool", () => {
  it("returns Button props and variants", async () => {
    const res = await client.callTool({
      name: "get_component",
      arguments: { name: "Button" },
    });
    const content = res.content[0] as { type: "text"; text: string };
    const data = JSON.parse(content.text);
    expect(data.name).toBe("Button");
    expect(Array.isArray(data.props)).toBe(true);
    expect(Array.isArray(data.variants)).toBe(true);
    // Button should have variant + size from argTypes
    const variantProps = data.variants.map((v: { prop: string }) => v.prop);
    expect(variantProps).toContain("variant");
    expect(variantProps).toContain("size");
  });

  it("returns a11y info for Dialog", async () => {
    const res = await client.callTool({
      name: "get_component",
      arguments: { name: "Dialog", include: ["a11y"] },
    });
    const content = res.content[0] as { type: "text"; text: string };
    const data = JSON.parse(content.text);
    expect(data.a11y.radixPrimitives).toContain("@radix-ui/react-dialog");
    expect(data.a11y.guarantees.length).toBeGreaterThan(0);
  });

  it("returns isError for unknown component", async () => {
    const res = await client.callTool({
      name: "get_component",
      arguments: { name: "NonExistentWidget" },
    });
    expect(res.isError).toBe(true);
  });

  it("accepts slug input", async () => {
    const res = await client.callTool({
      name: "get_component",
      arguments: { name: "button" },
    });
    const content = res.content[0] as { type: "text"; text: string };
    const data = JSON.parse(content.text);
    expect(data.name).toBe("Button");
  });
});

// ── Tool: get_example ─────────────────────────────────────────────────────────

describe("get_example tool", () => {
  it("returns a JSX example for Button", async () => {
    const res = await client.callTool({
      name: "get_example",
      arguments: { name: "Button" },
    });
    const content = res.content[0] as { type: "text"; text: string };
    const data = JSON.parse(content.text);
    expect(data.example.jsx).toBeTruthy();
    expect(data.previewUrl).toContain("iframe.html");
  });

  it("matches variant by name", async () => {
    const res = await client.callTool({
      name: "get_example",
      arguments: { name: "Button", variant: "Destructive" },
    });
    const content = res.content[0] as { type: "text"; text: string };
    const data = JSON.parse(content.text);
    expect(data.example.name).toBe("Destructive");
  });

  it("returns all example names", async () => {
    const res = await client.callTool({
      name: "get_example",
      arguments: { name: "Input" },
    });
    const content = res.content[0] as { type: "text"; text: string };
    const data = JSON.parse(content.text);
    expect(data.allExamples.length).toBeGreaterThan(3);
  });
});

// ── Tool: search_components ───────────────────────────────────────────────────

describe("search_components tool", () => {
  it("finds form components by keyword", async () => {
    const res = await client.callTool({
      name: "search_components",
      arguments: { query: "form input" },
    });
    const data = JSON.parse((res.content[0] as { text: string }).text);
    expect(data.found).toBeGreaterThan(0);
    const names = data.results.map((r: { name: string }) => r.name);
    expect(names.some((n: string) => ["Input", "Textarea", "Checkbox"].includes(n))).toBe(true);
  });

  it("finds overlay components", async () => {
    const res = await client.callTool({
      name: "search_components",
      arguments: { query: "modal dialog" },
    });
    const data = JSON.parse((res.content[0] as { text: string }).text);
    expect(data.results.some((r: { name: string }) => r.name === "Dialog")).toBe(true);
  });

  it("returns hint on no results", async () => {
    const res = await client.callTool({
      name: "search_components",
      arguments: { query: "zzznomatch999" },
    });
    const data = JSON.parse((res.content[0] as { text: string }).text);
    expect(data.found).toBe(0);
    expect(data.hint).toBeTruthy();
  });

  it("respects limit", async () => {
    const res = await client.callTool({
      name: "search_components",
      arguments: { query: "component", limit: 2 },
    });
    const data = JSON.parse((res.content[0] as { text: string }).text);
    expect(data.results.length).toBeLessThanOrEqual(2);
  });
});

// ── Tool: check_props ─────────────────────────────────────────────────────────

describe("check_props tool", () => {
  it("validates valid Button props", async () => {
    const res = await client.callTool({
      name: "check_props",
      arguments: {
        name: "Button",
        props: { variant: "destructive", size: "sm", children: "Delete" },
      },
    });
    const data = JSON.parse((res.content[0] as { text: string }).text);
    expect(data.valid).toBe(true);
    expect(data.errors).toHaveLength(0);
  });

  it("catches invalid variant value", async () => {
    const res = await client.callTool({
      name: "check_props",
      arguments: {
        name: "Button",
        props: { variant: "purple" },
      },
    });
    const data = JSON.parse((res.content[0] as { text: string }).text);
    expect(data.valid).toBe(false);
    expect(data.errors[0].prop).toBe("variant");
  });

  it("catches missing required prop on StatCard", async () => {
    const res = await client.callTool({
      name: "check_props",
      arguments: { name: "StatCard", props: { value: "42" } },
    });
    const data = JSON.parse((res.content[0] as { text: string }).text);
    expect(data.valid).toBe(false);
    const errorProps = data.errors.map((e: { prop: string }) => e.prop);
    expect(errorProps).toContain("label");
  });

  it("returns isError for unknown component", async () => {
    const res = await client.callTool({
      name: "check_props",
      arguments: { name: "FakeWidget", props: {} },
    });
    expect(res.isError).toBe(true);
  });
});

// ── Tool: preview_component ───────────────────────────────────────────────────

describe("preview_component tool", () => {
  it("returns preview URL and HTML for Button", async () => {
    const res = await client.callTool({
      name: "preview_component",
      arguments: { name: "Button" },
    });
    const data = JSON.parse((res.content[0] as { text: string }).text);
    expect(data.previewUrl).toContain("iframe.html");
    expect(data.html).toContain("<iframe");
    expect(data.resourceUri).toContain("practics-ui://component/button/preview/");
  });

  it("matches story by variant name", async () => {
    const res = await client.callTool({
      name: "preview_component",
      arguments: { name: "Button", variant: "Loading" },
    });
    const data = JSON.parse((res.content[0] as { text: string }).text);
    expect(data.story).toBe("Loading");
  });

  it("respects custom height", async () => {
    const res = await client.callTool({
      name: "preview_component",
      arguments: { name: "Dialog", height: 600 },
    });
    const data = JSON.parse((res.content[0] as { text: string }).text);
    expect(data.html).toContain("height: 600px");
  });

  it("lists all available stories", async () => {
    const res = await client.callTool({
      name: "preview_component",
      arguments: { name: "Alert" },
    });
    const data = JSON.parse((res.content[0] as { text: string }).text);
    expect(data.availableStories.length).toBeGreaterThan(2);
  });
});

// ── Tool: get_a11y_requirements ───────────────────────────────────────────────

describe("get_a11y_requirements tool", () => {
  it("returns a11y info for Button", async () => {
    const res = await client.callTool({
      name: "get_a11y_requirements",
      arguments: { name: "Button" },
    });
    const data = JSON.parse((res.content[0] as { text: string }).text);
    expect(data.component).toBe("Button");
    expect(Array.isArray(data.guarantees)).toBe(true);
    expect(Array.isArray(data.requirements)).toBe(true);
    expect(data.requirements.length).toBeGreaterThan(0);
  });

  it("includes axeReport for Button (has axe tests)", async () => {
    const res = await client.callTool({
      name: "get_a11y_requirements",
      arguments: { name: "Button" },
    });
    const data = JSON.parse((res.content[0] as { text: string }).text);
    expect(data.axeReport).not.toBeNull();
    expect(data.axeReport.tested).toBe(true);
    expect(data.axeReport.passed).toBeGreaterThan(0);
    expect(data.axeReport.summary).toContain("passing");
  });

  it("returns radixPrimitives for Dialog", async () => {
    const res = await client.callTool({
      name: "get_a11y_requirements",
      arguments: { name: "Dialog" },
    });
    const data = JSON.parse((res.content[0] as { text: string }).text);
    expect(data.radixPrimitives).toContain("@radix-ui/react-dialog");
  });

  it("returns null axeReport for components without axe tests", async () => {
    const res = await client.callTool({
      name: "get_a11y_requirements",
      arguments: { name: "Dialog" },
    });
    const data = JSON.parse((res.content[0] as { text: string }).text);
    // Dialog has no axe tests yet — axeReport should be null
    expect(data.axeReport).toBeNull();
  });

  it("returns isError for unknown component", async () => {
    const res = await client.callTool({
      name: "get_a11y_requirements",
      arguments: { name: "NonExistentWidget" },
    });
    expect(res.isError).toBe(true);
  });

  it("accepts slug input", async () => {
    const res = await client.callTool({
      name: "get_a11y_requirements",
      arguments: { name: "button" },
    });
    const data = JSON.parse((res.content[0] as { text: string }).text);
    expect(data.component).toBe("Button");
  });
});

// ── Prompts ───────────────────────────────────────────────────────────────────

describe("prompts", () => {
  it("lists 3 prompts", async () => {
    const { prompts } = await client.listPrompts();
    const names = prompts.map((p) => p.name);
    expect(names).toContain("scaffold-form");
    expect(names).toContain("scaffold-data-table");
    expect(names).toContain("scaffold-dashboard");
  });

  it("scaffold-form returns a user message with field instructions", async () => {
    const res = await client.getPrompt({
      name: "scaffold-form",
      arguments: { fields: "name:text, email:email, message:textarea" },
    });
    expect(res.messages).toHaveLength(1);
    expect(res.messages[0].role).toBe("user");
    const text = (res.messages[0].content as { text: string }).text;
    expect(text).toContain("name (text)");
    expect(text).toContain("email (email)");
    expect(text).toContain("message (textarea)");
    expect(text).toContain("@practics/ui");
  });

  it("scaffold-form uses custom formName and submitLabel", async () => {
    const res = await client.getPrompt({
      name: "scaffold-form",
      arguments: {
        fields: "username:text",
        formName: "LoginForm",
        submitLabel: "Sign In",
      },
    });
    const text = (res.messages[0].content as { text: string }).text;
    expect(text).toContain("LoginForm");
    expect(text).toContain("Sign In");
  });

  it("scaffold-data-table returns column definitions instructions", async () => {
    const res = await client.getPrompt({
      name: "scaffold-data-table",
      arguments: { columns: "name:string, email:string, role:string", rowType: "User" },
    });
    const text = (res.messages[0].content as { text: string }).text;
    expect(text).toContain("User");
    expect(text).toContain("name: string");
    expect(text).toContain("TanStack Table");
  });

  it("scaffold-data-table includes sorting instructions when requested", async () => {
    const res = await client.getPrompt({
      name: "scaffold-data-table",
      arguments: {
        columns: "title:string, views:number",
        features: "sorting,pagination",
      },
    });
    const text = (res.messages[0].content as { text: string }).text;
    expect(text).toContain("getSortedRowModel");
    expect(text).toContain("getPaginationRowModel");
  });

  it("scaffold-dashboard returns layout instructions with chart", async () => {
    const res = await client.getPrompt({
      name: "scaffold-dashboard",
      arguments: { title: "Analytics", chartType: "area" },
    });
    const text = (res.messages[0].content as { text: string }).text;
    expect(text).toContain("Analytics");
    expect(text).toContain("AreaChart");
    expect(text).toContain("Sidebar");
    expect(text).toContain("StatCard");
  });

  it("scaffold-dashboard with donut chart", async () => {
    const res = await client.getPrompt({
      name: "scaffold-dashboard",
      arguments: { chartType: "donut" },
    });
    const text = (res.messages[0].content as { text: string }).text;
    expect(text).toContain("DonutChart");
  });
});

// ── Resources ─────────────────────────────────────────────────────────────────

describe("resources", () => {
  it("lists resource URIs", async () => {
    const { resources } = await client.listResources();
    const uris = resources.map((r) => r.uri);
    // Should include component doc resources
    expect(uris.some((u) => u.includes("practics-ui://component/"))).toBe(true);
  });

  it("reads markdown doc for Button", async () => {
    const res = await client.readResource({
      uri: "practics-ui://component/button",
    });
    const content = res.contents[0];
    expect(content.mimeType).toBe("text/markdown");
    expect((content as { text: string }).text).toContain("# Button");
    expect((content as { text: string }).text).toContain("## Props");
    expect((content as { text: string }).text).toContain("## Accessibility");
  });

  it("reads HTML preview resource", async () => {
    // Get a real story ID from the component data
    const res = await client.callTool({
      name: "get_example",
      arguments: { name: "Button" },
    });
    const data = JSON.parse(
      (res.content[0] as { text: string }).text
    );
    const uri = data.previewResourceUri as string;

    const preview = await client.readResource({ uri });
    const content = preview.contents[0];
    expect(content.mimeType).toBe("text/html");
    expect((content as { text: string }).text).toContain("<iframe");
    expect((content as { text: string }).text).toContain("iframe.html");
  });

  it("reads full index resource", async () => {
    const res = await client.readResource({ uri: "practics-ui://index" });
    const content = res.contents[0] as { mimeType: string; text: string };
    expect(content.mimeType).toBe("application/json");
    const data = JSON.parse(content.text);
    expect(data.schemaVersion).toBe("1");
    expect(Array.isArray(data.components)).toBe(true);
  });
});
