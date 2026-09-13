# AGENTS.md — packages/design-tokens-mcp

`@kickstartds/design-tokens-mcp` v4.0.0 (published, `bin.design-tokens-mcp`). MCP server for querying, analyzing, and governing design tokens, plus W3C DTCG theme tooling.

## What is in here

- `src/tools.ts` — **28 tools**, all defined in one `getToolDefinitions()` array:
  - Query: `get_token`, `list_tokens`, `list_files`, `get_token_stats`, `search_tokens`, `get_tokens_by_type`, `list_components`, `get_component_tokens`, `search_component_tokens`
  - Categories: `get_color_palette`, `get_typography_tokens`, `get_spacing_tokens`, `get_factor_tokens`, `get_breakpoint_tokens`, `get_duration_tokens`
  - Themes (W3C DTCG): `get_branding_tokens`, `get_theme_schema`, `validate_theme`, `list_theme_values`, `generate_theme_from_image`, `extract_theme_from_css`, `update_token`
  - Governance: `get_design_rules`, `get_token_hierarchy`, `validate_token_usage`, `get_token_for_context`, `validate_component_tokens`, `audit_all_components`
- `src/resources.ts` — `tokens://overview`, `tokens://files`, `tokens://branding`, `tokens://components`.
- `src/prompts.ts` — `audit-tokens`, `update-branding`, `explore-component-tokens`.
- `rules/` — 13 design-intent rule JSON files consumed by `governance.ts`.
- `sync-tokens.mjs` — copies 16 named global token files from `../design-system/src/token/` and every `*-tokens.scss` from `../design-system/src/components/*/` into `tokens/` (leading `_` stripped). `tokens/` is **gitignored and regenerated**.
- `src/constants.ts` — `TOKEN_FILES` (13 global), `COMPONENT_TOKEN_FILES` (50), 9 categories.

## Commands

```bash
pnpm --filter @kickstartds/design-tokens-mcp build        # sync-tokens → tsc
pnpm --filter @kickstartds/design-tokens-mcp dev          # sync-tokens → tsc --watch
pnpm --filter @kickstartds/design-tokens-mcp start        # stdio
pnpm --filter @kickstartds/design-tokens-mcp start:http   # MCP_TRANSPORT=http MCP_PORT=8080
pnpm --filter @kickstartds/design-tokens-mcp sync-tokens
pnpm --filter @kickstartds/design-tokens-mcp typecheck
```

No tests (`test` exits 1 by design). Auth via `@kickstartds/shared-auth` (`MCP_JWT_SECRET`, optional; disabled when unset), plus the OAuth 2.1 layer for claude.ai. HTTP mode exposes `/mcp` and `/health`.

## Conventions

- Tokens are **copied, never authored here** — the design system is the source. If a token is missing, fix it in `packages/design-system`, then re-run `sync-tokens`.
- Tool results should stay flat and textual (name, value, file, category) — this server is queried by token-hungry agents.
- The recommended theme workflow is `get_theme_schema` → build W3C DTCG object → `validate_theme` → `create_theme`/`update_theme` in the **Storyblok MCP server** (theme storage lives there, see `docs/adr/adr-unified-theming.md`).

## Gotchas

- The three prompt bodies still reference tool names that no longer exist (`audit_tokens`, `get_branding_color_palette`); real names are `audit_all_components`/`validate_component_tokens` and `get_color_palette`. Fix prompt text when touching `src/prompts.ts`.
- `docker-compose.yml` sets `PORT=3000` and healthchecks that port, but the server reads `MCP_PORT` (8080) — the compose healthcheck is wrong.
- `tokens/` in the working tree may be stale (fewer files than the design system has components); `build`/`dev` refresh it, a bare `start` does not.
- `packages/design-tokens-mcp/tokens/` and `dist/` are generated.
