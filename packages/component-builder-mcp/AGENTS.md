# AGENTS.md — packages/component-builder-mcp

`@kickstartds/component-builder-mcp` (published). **Read-only** MCP server: it returns component-building instructions and templates. No writes, no Storyblok access.

## Tools (10, `src/tools.ts`) and resources (3, `src/resources.ts`)

Tools: `get-ui-building-instructions` (call this first), `get-component-structure`, `get-json-schema-template`, `get-react-component-template`, `get-client-behavior-template`, `get-scss-template`, `get-storybook-template`, `get-defaults-template`, `get-token-architecture`, `list-existing-components`.

Resources: `design-system://instructions`, `design-system://token-architecture`, `design-system://components`.

Templates are rendered from `src/handlers.ts` (the substantive content); `src/tools.ts` only holds MCP-facing schemas/descriptions.

## Commands

```bash
pnpm --filter @kickstartds/component-builder-mcp build        # tsc
pnpm --filter @kickstartds/component-builder-mcp start        # node dist/index.js (stdio)
pnpm --filter @kickstartds/component-builder-mcp start:http   # MCP_TRANSPORT=http
pnpm --filter @kickstartds/component-builder-mcp dev          # tsc --watch
pnpm --filter @kickstartds/component-builder-mcp typecheck
```

No tests (`test` exits 1 by design). Auth via `@kickstartds/shared-auth`, disabled when `MCP_JWT_SECRET` is unset.

## Conventions

- Keep the server read-only. If a workflow needs to modify files, that belongs in the calling agent, not here.
- Template content must match the design-system conventions (pure components, no React state, `*.client.ts` behavior, token-only SCSS, JSON Schema as prop contract). When design-system conventions change, update `handlers.ts` — this server is the guidance surface other agents trust.
- Tool names are kebab-case; adding a tool means updating `src/tools.ts`, the handler, and `README.md`.
