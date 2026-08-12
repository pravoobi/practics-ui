# @practics/ui-mcp

MCP server for [@practics/ui](https://www.npmjs.com/package/@practics/ui) — exposes component props, variants, accessibility constraints, and live Storybook previews as MCP tools and resources for AI coding agents.

[![npm](https://img.shields.io/npm/v/@practics/ui-mcp)](https://www.npmjs.com/package/@practics/ui-mcp)

## What it gives your AI agent

| Tool / Resource | What Claude gets |
|---|---|
| `list_components` | Names, categories, one-line descriptions |
| `get_component` | Full props with types, all variants, a11y notes |
| `get_example` | Runnable JSX + live Storybook preview URL |
| `practics-ui://component/{slug}` | Full markdown docs |
| `practics-ui://component/{slug}/preview/{id}` | Inline rendered component (HTML) |
| `practics-ui://index` | Full metadata in one payload |

No hallucinated prop names. No invented variants. Accurate a11y requirements from the actual source.

---

## Installation

### Claude Code (recommended)

Add to your project's `.mcp.json`:

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

Or to your global `~/.claude.json`:

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

### Cursor

In `.cursor/mcp.json`:

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

### VS Code (MCP extension)

In `.vscode/mcp.json`:

```json
{
  "servers": {
    "practics-ui": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@practics/ui-mcp"]
    }
  }
}
```

### Pin a specific version

Replace `-y @practics/ui-mcp` with `-y @practics/ui-mcp@0.1.2` (always matches the library version).

---

## Tools reference

### `list_components`

```
list_components({ category?: string })
```

Returns all components with name, slug, category, and one-line description. Start here to discover what's available. Optionally filter by category: `form`, `overlay`, `layout`, `feedback`, `data`.

### `get_component`

```
get_component({ name: string, include?: Array<"props"|"variants"|"examples"|"a11y"|"source"> })
```

Returns full metadata for one component. `include` defaults to `["props","variants","examples","a11y"]`. Add `"source"` to get the file path. Accepts component name (`"Button"`) or slug (`"button"`).

### `get_example`

```
get_example({ name: string, variant?: string })
```

Returns a runnable JSX snippet, Storybook preview URL, and resource URI for inline rendering. `variant` matches against story names (e.g. `"Destructive"`, `"WithError"`, `"Loading"`).

---

## Resources reference

All URIs follow the `practics-ui://` scheme.

| URI | MIME | Content |
|---|---|---|
| `practics-ui://component/{slug}` | `text/markdown` | Full docs page |
| `practics-ui://component/{slug}/preview/{storyId}` | `text/html` | Storybook iframe |
| `practics-ui://index` | `application/json` | Full `components.json` |

---

## Versioning

`@practics/ui-mcp` uses the **same version as `@practics/ui`** — `0.1.2` of the library always corresponds to `0.1.2` of this MCP server. The metadata bundled inside matches what that library version exports. Pin them together.

Preview URLs point to the hosted Storybook at:
`https://pravoobi.github.io/practics-ui/`

Renaming a story export is treated as a breaking change (it invalidates the preview URI) and triggers a major version bump.

---

## Compatibility

| Client | Tested | Notes |
|---|---|---|
| Claude Code | ✓ | Stdio transport, all tools work |
| MCP Inspector | ✓ | Use `npm run inspect` from `mcp/` |
| Claude Desktop | — | HTML preview resources render inline |
| Cursor | — | Tools work; HTML resources client-dependent |

---

## Development

```bash
# From the repo root
npm run mcp:extract    # regenerate components.json from source
npm run mcp:build      # compile TypeScript
npm run mcp:test       # run tests

# Inspect the server interactively
cd mcp && npm run inspect
```

### Adding a new component

1. Add the component name to `PHASE_1_COMPONENTS` (or the Phase 2 list) in `mcp/scripts/extract.ts`.
2. Add an entry to `mcp/scripts/overrides.ts` with description, category, and a11y notes.
3. Run `npm run mcp:extract` — the extractor reads props from `*.types.ts` and examples from `*.stories.tsx` automatically.
4. Commit `mcp/generated/components.json`.
5. Bump both `package.json` and `mcp/package.json` to the same new version.

---

## Security

- The server runs **locally** as a stdio process. No network calls at runtime.
- All data is read from the bundled `components.json` — no filesystem access, no evaluation.
- Preview HTML embeds a Storybook iframe URL (GH Pages). Rendering happens in the MCP client's sandbox, not the server.
- Published with **npm provenance** — attestation verifiable via `npm audit signatures`.
