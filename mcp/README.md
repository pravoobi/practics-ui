# @practics/ui-mcp

An [MCP (Model Context Protocol)](https://modelcontextprotocol.io) server that exposes every component in [`@practics/ui`](https://www.npmjs.com/package/@practics/ui) as structured tools and resources. AI coding agents (Claude Code, Cursor, Windsurf, etc.) query it instead of hallucinating props.

[![npm](https://img.shields.io/npm/v/@practics/ui-mcp)](https://www.npmjs.com/package/@practics/ui-mcp)

```
Claude: "What props does StatCard accept?"
→ get_component("StatCard")
→ label: string (required), value: string (required), trend: "up"|"down"|"neutral" ...
```

---

## Install & configure

### Claude Code

Add to `.mcp.json` in your project root (or `~/.claude/settings.json` globally):

```json
{
  "mcpServers": {
    "practics-ui": {
      "command": "npx",
      "args": ["-y", "@practics/ui-mcp"]
    }
  }
}
```

### Cursor / Windsurf

```json
{
  "mcpServers": {
    "practics-ui": {
      "command": "npx",
      "args": ["-y", "@practics/ui-mcp"]
    }
  }
}
```

### Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "practics-ui": {
      "command": "npx",
      "args": ["-y", "@practics/ui-mcp"]
    }
  }
}
```

### Pin a version

Replace `@practics/ui-mcp` with `@practics/ui-mcp@0.2.0`. The MCP package always ships the same version as the UI library.

### Inspect interactively

```bash
npx @modelcontextprotocol/inspector npx @practics/ui-mcp
```

---

## Tools

| Tool | What it returns | p50 | p95 | ~tokens | $/1k calls |
|---|---|---|---|---|---|
| `list_components` | All 26 components with descriptions | 0.89ms | 1.87ms | 1 845 | $5.54 |
| `list_components` + filter | Category-filtered subset | 0.56ms | 1.07ms | 364 | $1.09 |
| `get_component` | Full props, variants, examples, a11y | 0.72ms | 1.10ms | ~900 | $2.70 |
| `search_components` | Ranked keyword / NL search | 0.87ms | 3.84ms | 323 | $0.97 |
| `check_props` | Validation before writing JSX | 0.52ms | 2.92ms | 90 | $0.27 |
| `get_a11y_requirements` | WCAG guarantees + live axe results | 0.55ms | 1.50ms | 156 | $0.47 |
| `get_example` | Runnable JSX + Storybook URL | 0.69ms | 2.89ms | 456 | $1.37 |
| `preview_component` | Storybook iframe HTML | 0.69ms | 2.89ms | 456 | $1.37 |

Latency measured via `InMemoryTransport` (50 iterations, no I/O). Cost is output-token cost at Claude Sonnet 4.6 rates ($3.00/MTok) — what the tool response adds to your context window. Every response is a synchronous read from the in-process `components.json` bundle.

A typical coding session calls 3–4 tools: **$0.000015 per session** at current rates.

### Example calls

```ts
// Discover what's available
list_components({ category: "form" })

// Get full component metadata
get_component({ name: "Button" })
get_component({ name: "Dialog", include: ["props", "a11y"] })

// Validate props before writing code
check_props({ name: "StatCard", props: { value: "42" } })
// → { valid: false, errors: [{ prop: "label", message: "Required prop 'label' is missing." }] }

// Accessibility
get_a11y_requirements({ name: "Button" })
// → { requirements: ["Pass aria-label on icon-only buttons"], axeReport: { passed: 3, failed: 0 } }

// Search by concept
search_components({ query: "notification with dismiss" })
```

---

## Resources

| URI pattern | MIME | Content |
|---|---|---|
| `practics-ui://component/{slug}` | `text/markdown` | Props table, variants, a11y, examples |
| `practics-ui://component/{slug}/preview/{storyId}` | `text/html` | Storybook iframe |
| `practics-ui://index` | `application/json` | Full `components.json` in one payload |

---

## Prompts

Three scaffold prompts for common UI patterns:

| Prompt | Arguments | Generates |
|---|---|---|
| `scaffold-form` | `fields`, `formName?`, `submitLabel?` | react-hook-form + Zod + accessible @practics/ui inputs |
| `scaffold-data-table` | `columns`, `rowType?`, `features?` | TanStack Table v8 + `<Table>` with optional sorting / filtering / pagination |
| `scaffold-dashboard` | `title?`, `stats?`, `chartType?` | Sidebar layout with StatCards, chart, and data table |

```ts
getPrompt("scaffold-form", {
  fields: "name:text, email:email, message:textarea",
  formName: "ContactForm",
  submitLabel: "Send message",
})
```

---

## Eval results

13 eval cases covering search relevance, prop validation, slug resolution, and a11y data integrity — run against the real `components.json` via `InMemoryTransport`.

```
search 'modal dialog' → Dialog in top 3          ✓
search 'form input field' → Input in top 3        ✓
search 'chart graph' → DonutChart or AreaChart    ✓
search 'notification toast alert' → Alert/Toast   ✓
search 'table data rows' → Table in top 3         ✓
check_props catches invalid Button variant         ✓
check_props catches missing required StatCard.label ✓
check_props accepts valid Button props             ✓
get_component slug 'button' resolves to Button    ✓
get_component Button has variant + size variants  ✓
get_component Dialog has @radix-ui/react-dialog   ✓
get_a11y_requirements Button axeReport.passed > 0 ✓
get_a11y_requirements Button has requirements[]   ✓

13/13  (100%)   worst-case p95: 3.84ms
```

Run them yourself:

```bash
npx tsx mcp/scripts/benchmark.ts   # latency + evals
npm run mcp:test                   # 50 integration tests
```

Raw results: [`mcp/generated/benchmark-results.json`](generated/benchmark-results.json)

---

## What failed and why

A working demo tells you nothing. Here are the bugs that were wrong first.

### 1. Zod v3/v4 workspace split — silent type error

`@modelcontextprotocol/sdk` v1.30 internally requires Zod v4 (it uses the `~standard` / `~validate` Standard Schema markers that were added in v4). The repo already had Zod v3.23.8 satisfying other packages, and npm deduplicated to v3. The SDK accepted it at runtime but TypeScript threw `Property '~standard' is missing in type 'ZodObject<...>'` — not "wrong Zod version". The SDK's published types don't document the version constraint.

**Fix:** `"overrides": { "zod": "^4.0.0" }` in the root `package.json` forces a single Zod v4 copy across the workspace. Also required updating `z.record(z.unknown())` → `z.record(z.string(), z.unknown())` (Zod v4 made the key-type argument required).

**Lesson:** When a new SDK lands in a monorepo, check whether its transitive Zod dependency is v3 or v4. They are not type-compatible.

---

### 2. ResourceTemplate vs string literal — resources silently registered as exact-match

The first version passed a plain string to `server.resource()`:

```ts
server.resource("component-docs", "practics-ui://component/{slug}", handler)
```

The SDK treated `{slug}` as a literal character — no template expansion. Calling `readResource({ uri: "practics-ui://component/button" })` returned "not found". The type signature accepts a `string` for both static URIs and (incorrectly) for template URIs, so there's no compile-time error.

**Fix:** `new ResourceTemplate("practics-ui://component/{slug}", { list: async () => ({...}) })`. The `list` callback is required in SDK v1.x even if you don't need enumeration — omitting it throws at connection time rather than at call time.

---

### 3. Vitest JSON reporter field: `name` not `testFilePath`

The a11y audit script parsed `testResults[].testFilePath` to map axe outcomes to components. After running, `a11y-results.json` always showed `totalAxeTests: 0`. Vitest's JSON reporter writes `name` (absolute file path), not `testFilePath`. The Jest-compatible schema uses `testFilePath`; Vitest diverged. There's no error — the field is simply absent and every `componentFromPath("")` call returns `null`.

**Fix:** Read from `suite.name`. Also added `/audit/i` to the pattern list — the actual test titles in this repo are `"passes axe audit"`, not `"has no axe violations"`.

---

### 4. Multi-word search returned 0 results

`search_components({ query: "form input" })` returned nothing. The scorer searched for the entire string `"form input"` as a substring. No component name or description contains that exact phrase.

**Fix:** Tokenise the query (`split(/\s+/)`) and score each token independently. Multi-word queries now do OR-with-scoring across tokens rather than exact phrase matching.

---

### 5. `src/components/ui/` axe tests mapped to a fake `"ui"` component

The repo has two test locations: `src/components/Button/Button.test.tsx` (component-per-directory) and `src/components/ui/button.test.tsx` (shadcn-style flat directory). The `componentFromPath` regex captured the first path segment after `components/`, which is `ui` for the flat directory. Axe results merged into a fake `"ui"` entry instead of `"Button"`.

**Fix:** When the captured directory is `"ui"`, capitalise the filename instead: `file.charAt(0).toUpperCase() + file.slice(1)`.

---

## Architecture

```
components.json           bundled at build time, ~120 KB
      │
      ├── src/data.ts       load + in-process search index
      ├── src/tools/        one file per tool
      ├── src/resources/    markdown renderer, iframe HTML
      ├── src/prompts.ts    scaffold-* prompts
      └── src/server.ts     McpServer wiring

scripts/
      ├── extract.ts        ts-morph AST walker → components.json
      ├── overrides.ts      curated a11y + category metadata
      ├── audit-axe.ts      vitest JSON → a11y-results.json
      └── benchmark.ts      latency + eval runner
```

No network calls at runtime. No database. Every tool response is a synchronous JSON read from the in-memory parsed `components.json`.

---

## Versioning

`@practics/ui-mcp` ships the same version as `@practics/ui`. The CI publish workflow reads both `package.json` files and aborts if they differ. Renaming a story export is a breaking change (it invalidates Storybook preview URIs) and triggers a major version bump.

## Security

- Runs locally as a stdio process. No outbound network calls.
- All data from the bundled `components.json` — no filesystem access, no eval.
- Preview HTML embeds a GitHub Pages iframe. Rendering happens in the MCP client's sandbox.
- Published with npm provenance — attestation verifiable via `npm audit signatures`.

## License

ISC
