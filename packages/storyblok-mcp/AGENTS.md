# AGENTS.md — packages/storyblok-mcp

`@kickstartds/storyblok-mcp-server` (published). MCP server exposing Storyblok CMS operations to AI assistants. Wraps `@kickstartds/storyblok-services`.

## Registry (derived from source, not from READMEs)

- **32 LLM tools** — registered in `src/register-tools.ts` via `registerSingleTool(server, "<name>", …)`; input schemas are Zod definitions in `src/config.ts`, descriptions in `TOOL_DESCRIPTIONS`:
  `generate_content`, `import_content`, `import_content_at_position`, `create_page_with_content`, `get_ideas`, `list_stories`, `get_story`, `create_story`, `update_story`, `delete_story`, `replace_section`, `update_seo`, `list_components`, `get_component`, `list_assets`, `search_content`, `scrape_url`, `list_icons`, `analyze_content_patterns`, `list_recipes`, `plan_page`, `generate_section`, `generate_root_field`, `generate_seo`, `content_audit`, `ensure_path`, `list_themes`, `get_theme`, `apply_theme`, `remove_theme`, `create_theme`, `update_theme`.
- **7 app-only tools** (`src/ui/app-tools.ts`, `visibility: ["app"]`): `approve_section`, `reject_section`, `modify_section`, `approve_plan`, `remove_section`, `move_section`, `save_page`.
- **Resources** (`src/register-resources.ts`): `storyblok://components`, `storyblok://stories`, `recipes://section-recipes`, dynamic `skill://<id>`, plus extension UIs `ui://kds/{section-preview,page-builder,plan-review,audit-report}` (`src/ui/resources.ts`).
- **7 prompts** (`src/prompts.ts`): `create-page`, `migrate-from-url`, `create-blog-post`, `content-audit`, `extend-page`, `translate-page`, `theme-management`.
- **17 output schemas** (`src/output-schemas.ts`) and **7 elicitation builders** (`src/elicitation.ts`).
- `ProgressReporter` (`src/progress.ts`) is used by `create_page_with_content`, `generate_section`, and `content_audit`.

When you add a tool, update: `config.ts` (Zod schema), `register-tools.ts` (handler + description), `output-schemas.ts` if it writes, tests in `test/`, and `packages/storyblok-mcp/README.md`.

## Commands

```bash
pnpm --filter @kickstartds/storyblok-mcp-server build     # sync-schemas → extract-tokens → bundle-render → tsc → bundle-render
pnpm --filter @kickstartds/storyblok-mcp-server start     # node dist/index.js (stdio)
pnpm --filter @kickstartds/storyblok-mcp-server dev       # tsc --watch ONLY — does not run the server
pnpm --filter @kickstartds/storyblok-mcp-server test      # jest, NODE_OPTIONS=--experimental-vm-modules
pnpm --filter @kickstartds/storyblok-mcp-server exec jest test/elicitation.test.ts   # single file
pnpm --filter @kickstartds/storyblok-mcp-server sync-schemas
```

HTTP transport: `MCP_TRANSPORT=http` → `/mcp` (stateless: a fresh `McpServer` + transport per request) and `/health`, port from `MCP_PORT` (default 8080).

## Environment

Required at startup (`loadConfig()` exits 1 without them): `STORYBLOK_API_TOKEN`, `STORYBLOK_OAUTH_TOKEN`, `STORYBLOK_SPACE_ID`. Optional: `STORYBLOK_API_BASE_URL`, `MCP_TRANSPORT`, `MCP_PORT`, `MCP_JWT_SECRET`, `MCP_REVOKED_TOKENS`. `OPENAI_API_KEY` is optional at startup but required by `generate_content`, `plan_page`, `generate_section`, `generate_root_field`, `generate_seo`.

Auth comes from `@kickstartds/shared-auth` (see [../shared-auth/AGENTS.md](../shared-auth/AGENTS.md)), checked after CORS/OPTIONS handling and before body parsing; disabled when `MCP_JWT_SECRET` is unset.

## Gotchas

- `pnpm dev` does not start a server. Use `start` (after `build`) for stdio clients, or `MCP_TRANSPORT=http node dist/index.js` for HTTP.
- Generated, gitignored, never hand-edit: `schemas/*.dereffed.json` and `src/ui/{tokens,components-css}.generated.ts`. Regenerate with `sync-schemas` / `extract-tokens` / `bundle-render`.
- `test/prompts.test.ts` asserts 6 prompts while `src/prompts.ts` defines 7 (`theme-management` was added) — the test suite is currently red on that assertion.
- Build order matters: `shared-auth` and `storyblok-services` must be built first, and `sync-schemas.js` resolves schemas from the website components or the design-system dist.
- Elicitation must degrade gracefully (`tryElicit()`); clients without elicitation support must still complete the flow with defaults.
- Keep `prompts.ts`, `output-schemas.ts`, `elicitation.ts`, and `progress.ts` as separate modules (see `docs/adr/adr-mcp-apps-decisions.md`).
