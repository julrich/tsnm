# AGENTS.md — packages/design-tokens-editor

`@kickstartds/design-tokens-editor` (**private**). Vite SPA + Express server for visually editing branding/component tokens and Storyblok `token-theme` stories, with live preview of real design-system components.

Stack: React 19, Vite 7, MUI v7, JSON Forms, tinycolor2, Express 4. Node ≥ 24.

## Layout

- `src/App.tsx` — editor shell; view modes: token editor, component editor, preview, **graph** (`src/graph/GraphView.tsx` renders `@kickstartds/token-graph` from a prebuilt `token-graph.json`).
- `src/main.tsx` — bootstraps, calls `/api/auth/me`, renders `LoginPage.tsx` when unauthenticated.
- `src/server/` — `index.ts` (Express), `routes.ts` (`/api/tokens/*` CRUD), `auth.ts` (`POST /api/auth/login|logout`, `GET /api/auth/me`, `requireAuth`), `storyblok.ts` (Management API client), `cli.ts` (env bootstrap entry point).
- `index.html` (editor) + `preview.html` (preview-only) — dual Vite entries.
- `Dockerfile` — two-stage: builds `shared-auth` and the whole design-system first, then re-runs `pnpm install` to re-inject workspace `dist`s; serves on 8080.

## Commands

```bash
pnpm --filter @kickstartds/design-tokens-editor dev        # concurrently: Vite :5173 + Express API :4200 (dotenvx, tsx watch)
pnpm --filter @kickstartds/design-tokens-editor build      # rm -rf dist && vite build && tsc -p tsconfig.server.json
pnpm --filter @kickstartds/design-tokens-editor start      # dotenvx run -f .env -- tsx src/server/cli.ts
pnpm --filter @kickstartds/design-tokens-editor typecheck
pnpm --filter @kickstartds/design-tokens-editor format     # oxfmt (only formatter configured in the repo)
```

Vite proxies `/api` → `127.0.0.1:4200`. Health endpoint: `/api/health`.

## Environment

`STORYBLOK_OAUTH_TOKEN`, `STORYBLOK_SPACE_ID`, `STORYBLOK_API_BASE` (regional Management API), `PORT` (API, default 4200), `MCP_JWT_SECRET` + `MCP_REVOKED_TOKENS` (optional — enables JWT login). Requires `.env` for the `dotenvx` wrapper.

## Conventions

- Theme storage is Storyblok content type `token-theme` under the `settings/themes/` path (folders auto-created). Slugs are the identity; the default theme is protected by the `system` field — never bypass that guard (see `docs/adr/adr-unified-theming.md`).
- Login is token-paste: the user pastes a pre-issued JWT, the server verifies it and sets an httpOnly `auth_token` cookie. `requireAuth` guards `/api/tokens/*` and accepts cookie **or** `Authorization: Bearer`.
- Theme CSS is computed with the shared compiler in `storyblok-services` (`tokensToCss`) — do not reimplement CSS generation in the editor.
- Light theme, system fonts, no web-font links (see `docs/adr/adr-editor-branding.md`).

## Gotchas

- `README.md` in this package still describes the removed Netlify Functions/Blobs deployment. Reality: Express + Storyblok Management API + Kamal (`config/deploy-design-tokens-editor.yml`, port 8080). Fix the README rather than trusting it.
- Local dev needs a `.env` and a built design-system `dist/` (the SPA imports components from it).
- Port 4200 collides with `schema-layer-editor`'s Vite server (also 4200) — do not run both dev servers simultaneously.
- `dist/app` (SPA) + `dist/server` are generated; never hand-edit.
