/**
 * Benchmark + eval suite for @practics/ui-mcp.
 * Measures real p50/p95/p99 latency per tool and approximate token cost.
 * Also runs correctness assertions (evals) and reports pass/fail.
 *
 * Run: tsx scripts/benchmark.ts
 * Outputs: generated/benchmark-results.json + console report
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createServer } from "../src/server.js";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "../generated");
mkdirSync(OUT_DIR, { recursive: true });

// ── Pricing (Claude Sonnet 4.6, per 1M tokens) ───────────────────────────────
// MCP tool responses add tokens to the assistant's context window.
// Output tokens: $3.00/MTok  (tokens the model sees as tool results)
const OUTPUT_TOKEN_PRICE_PER_M = 3.0;
function approxTokens(text: string): number {
  return Math.ceil(text.length / 4);
}
function costUsd(tokens: number): number {
  return (tokens / 1_000_000) * OUTPUT_TOKEN_PRICE_PER_M;
}

// ── Percentile helper ────────────────────────────────────────────────────────
function percentile(sorted: number[], p: number): number {
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)]!;
}

// ── Setup ────────────────────────────────────────────────────────────────────
async function makeClient(): Promise<Client> {
  const server = createServer();
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: "benchmark-client", version: "1.0.0" });
  await Promise.all([client.connect(clientTransport), server.connect(serverTransport)]);
  return client;
}

// ── Latency measurement ──────────────────────────────────────────────────────
interface ToolStats {
  tool: string;
  args: Record<string, unknown>;
  iterations: number;
  p50ms: number;
  p95ms: number;
  p99ms: number;
  minMs: number;
  maxMs: number;
  avgTokens: number;
  avgCostUsd: number;
  costPer1000Usd: number;
}

async function measureTool(
  client: Client,
  tool: string,
  args: Record<string, unknown>,
  iterations = 50
): Promise<ToolStats> {
  const times: number[] = [];
  const tokenCounts: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    const res = await client.callTool({ name: tool, arguments: args });
    const elapsed = performance.now() - start;
    times.push(elapsed);
    const text = (res.content[0] as { text: string }).text ?? "";
    tokenCounts.push(approxTokens(text));
  }

  times.sort((a, b) => a - b);
  const avgTokens = tokenCounts.reduce((s, t) => s + t, 0) / tokenCounts.length;
  const avgCostUsd = costUsd(avgTokens);

  return {
    tool,
    args,
    iterations,
    p50ms: Math.round(percentile(times, 50) * 100) / 100,
    p95ms: Math.round(percentile(times, 95) * 100) / 100,
    p99ms: Math.round(percentile(times, 99) * 100) / 100,
    minMs: Math.round(times[0]! * 100) / 100,
    maxMs: Math.round(times[times.length - 1]! * 100) / 100,
    avgTokens: Math.round(avgTokens),
    avgCostUsd: Math.round(avgCostUsd * 1_000_000) / 1_000_000,
    costPer1000Usd: Math.round(avgCostUsd * 1000 * 1000) / 1000,
  };
}

// ── Eval definitions ─────────────────────────────────────────────────────────
interface EvalCase {
  name: string;
  tool: string;
  args: Record<string, unknown>;
  assert: (data: unknown) => { passed: boolean; detail: string };
}

const EVALS: EvalCase[] = [
  // search relevance
  {
    name: "search 'modal dialog' → Dialog in top 3",
    tool: "search_components",
    args: { query: "modal dialog", limit: 5 },
    assert: (d) => {
      const data = d as { results: { name: string }[] };
      const top3 = data.results.slice(0, 3).map((r) => r.name);
      const passed = top3.includes("Dialog");
      return { passed, detail: `top 3: [${top3.join(", ")}]` };
    },
  },
  {
    name: "search 'form input field' → Input in top 3",
    tool: "search_components",
    args: { query: "form input field", limit: 5 },
    assert: (d) => {
      const data = d as { results: { name: string }[] };
      const top3 = data.results.slice(0, 3).map((r) => r.name);
      const passed = top3.includes("Input");
      return { passed, detail: `top 3: [${top3.join(", ")}]` };
    },
  },
  {
    name: "search 'chart graph' → DonutChart or AreaChart in top 3",
    tool: "search_components",
    args: { query: "chart graph", limit: 5 },
    assert: (d) => {
      const data = d as { results: { name: string }[] };
      const top3 = data.results.slice(0, 3).map((r) => r.name);
      const passed = top3.some((n) => n === "DonutChart" || n === "AreaChart");
      return { passed, detail: `top 3: [${top3.join(", ")}]` };
    },
  },
  {
    name: "search 'notification toast alert' → Alert or Toast in top 3",
    tool: "search_components",
    args: { query: "notification toast alert", limit: 5 },
    assert: (d) => {
      const data = d as { results: { name: string }[] };
      const top3 = data.results.slice(0, 3).map((r) => r.name);
      const passed = top3.some((n) => n === "Alert" || n === "Toast");
      return { passed, detail: `top 3: [${top3.join(", ")}]` };
    },
  },
  {
    name: "search 'table data rows' → Table in top 3",
    tool: "search_components",
    args: { query: "table data rows", limit: 5 },
    assert: (d) => {
      const data = d as { results: { name: string }[] };
      const top3 = data.results.slice(0, 3).map((r) => r.name);
      const passed = top3.includes("Table");
      return { passed, detail: `top 3: [${top3.join(", ")}]` };
    },
  },
  // prop validation
  {
    name: "check_props catches invalid Button variant",
    tool: "check_props",
    args: { name: "Button", props: { variant: "purple" } },
    assert: (d) => {
      const data = d as { valid: boolean; errors: { prop: string }[] };
      const passed = data.valid === false && data.errors.some((e) => e.prop === "variant");
      return { passed, detail: `valid=${data.valid}, errors=[${data.errors.map((e) => e.prop).join(",")}]` };
    },
  },
  {
    name: "check_props catches missing required StatCard.label",
    tool: "check_props",
    args: { name: "StatCard", props: { value: "99" } },
    assert: (d) => {
      const data = d as { valid: boolean; errors: { prop: string }[] };
      const passed = data.valid === false && data.errors.some((e) => e.prop === "label");
      return { passed, detail: `valid=${data.valid}, errors=[${data.errors.map((e) => e.prop).join(",")}]` };
    },
  },
  {
    name: "check_props accepts valid Button props",
    tool: "check_props",
    args: { name: "Button", props: { variant: "destructive", size: "sm" } },
    assert: (d) => {
      const data = d as { valid: boolean };
      return { passed: data.valid === true, detail: `valid=${data.valid}` };
    },
  },
  // get_component correctness
  {
    name: "get_component slug 'button' resolves to Button",
    tool: "get_component",
    args: { name: "button" },
    assert: (d) => {
      const data = d as { name: string };
      return { passed: data.name === "Button", detail: `name=${data.name}` };
    },
  },
  {
    name: "get_component Button has 'variant' and 'size' variants",
    tool: "get_component",
    args: { name: "Button" },
    assert: (d) => {
      const data = d as { variants: { prop: string }[] };
      const props = data.variants.map((v) => v.prop);
      const passed = props.includes("variant") && props.includes("size");
      return { passed, detail: `variant props: [${props.join(", ")}]` };
    },
  },
  {
    name: "get_component Dialog has @radix-ui/react-dialog in a11y",
    tool: "get_component",
    args: { name: "Dialog", include: ["a11y"] },
    assert: (d) => {
      const data = d as { a11y: { radixPrimitives: string[] } };
      const passed = data.a11y.radixPrimitives.includes("@radix-ui/react-dialog");
      return { passed, detail: `radixPrimitives: [${data.a11y.radixPrimitives.join(", ")}]` };
    },
  },
  // a11y tool
  {
    name: "get_a11y_requirements Button returns axeReport with passed > 0",
    tool: "get_a11y_requirements",
    args: { name: "Button" },
    assert: (d) => {
      const data = d as { axeReport: { passed: number } | null };
      const passed = data.axeReport !== null && data.axeReport.passed > 0;
      return { passed, detail: `axeReport.passed=${data.axeReport?.passed ?? "null"}` };
    },
  },
  {
    name: "get_a11y_requirements Button has requirements array",
    tool: "get_a11y_requirements",
    args: { name: "Button" },
    assert: (d) => {
      const data = d as { requirements: string[] };
      const passed = Array.isArray(data.requirements) && data.requirements.length > 0;
      return { passed, detail: `requirements.length=${data.requirements?.length ?? 0}` };
    },
  },
];

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("@practics/ui-mcp benchmark + eval\n");

  const client = await makeClient();

  // ── Latency benchmarks ───────────────────────────────────────────────────
  console.log("Running latency benchmarks (50 iterations each)...\n");

  const benchmarkCases: Array<{ tool: string; args: Record<string, unknown>; label: string }> = [
    { tool: "list_components", args: {}, label: "list_components (all)" },
    { tool: "list_components", args: { category: "form" }, label: "list_components (filtered)" },
    { tool: "get_component", args: { name: "Button" }, label: "get_component (small)" },
    { tool: "get_component", args: { name: "Table" }, label: "get_component (large)" },
    { tool: "search_components", args: { query: "form input" }, label: "search_components" },
    { tool: "check_props", args: { name: "Button", props: { variant: "destructive" } }, label: "check_props" },
    { tool: "get_a11y_requirements", args: { name: "Button" }, label: "get_a11y_requirements" },
    { tool: "preview_component", args: { name: "Button" }, label: "preview_component" },
  ];

  const stats: ToolStats[] = [];
  for (const { tool, args, label } of benchmarkCases) {
    const s = await measureTool(client, tool, args, 50);
    s.tool = label;
    stats.push(s);
    console.log(
      `  ${label.padEnd(38)} p50=${s.p50ms}ms  p95=${s.p95ms}ms  ~${s.avgTokens} tok  $${s.costPer1000Usd}/1k calls`
    );
  }

  // ── Evals ────────────────────────────────────────────────────────────────
  console.log("\nRunning correctness evals...\n");

  interface EvalResult {
    name: string;
    passed: boolean;
    detail: string;
  }

  const evalResults: EvalResult[] = [];
  for (const ev of EVALS) {
    const res = await client.callTool({ name: ev.tool, arguments: ev.args });
    const text = (res.content[0] as { text: string }).text ?? "{}";
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      data = {};
    }
    const { passed, detail } = ev.assert(data);
    evalResults.push({ name: ev.name, passed, detail });
    console.log(`  ${passed ? "✓" : "✗"} ${ev.name}`);
    if (!passed) console.log(`      → ${detail}`);
  }

  const passCount = evalResults.filter((e) => e.passed).length;
  console.log(`\n  ${passCount}/${evalResults.length} evals passed`);

  // ── Summary ──────────────────────────────────────────────────────────────
  const allP95 = stats.map((s) => s.p95ms);
  const overallP95 = Math.max(...allP95);
  const totalCostPer1k = stats.reduce((s, t) => s + t.costPer1000Usd, 0);

  console.log("\n── Summary ─────────────────────────────────────────────────");
  console.log(`  Worst-case p95 latency: ${overallP95}ms`);
  console.log(`  Cost if all 8 tools called per session: $${(totalCostPer1k / 1000).toFixed(6)}/session`);
  console.log(`  Eval pass rate: ${Math.round((passCount / evalResults.length) * 100)}%`);

  // ── Write results ────────────────────────────────────────────────────────
  const output = {
    runAt: new Date().toISOString(),
    environment: { node: process.version, platform: process.platform },
    latency: stats,
    evals: evalResults,
    summary: {
      worstCaseP95Ms: overallP95,
      costAllToolsPerSessionUsd: Math.round((totalCostPer1k / 1000) * 1_000_000) / 1_000_000,
      evalPassRate: `${passCount}/${evalResults.length}`,
    },
  };

  const outPath = join(OUT_DIR, "benchmark-results.json");
  writeFileSync(outPath, JSON.stringify(output, null, 2) + "\n");
  console.log(`\n  Wrote ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
