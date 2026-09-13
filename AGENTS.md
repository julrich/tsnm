# AGENTS.md

Canonical instruction file for AI agents working in this repository. Copilot, Claude Code, Cursor, and other AGENTS.md-aware tools read this file; `.github/copilot-instructions.md` and `CLAUDE.md` are thin pointers here.

Deeper, package-local rules live in nested `AGENTS.md` files (nearest file wins):

| Area | File |
| --- | --- |
| Next.js site | [packages/website/AGENTS.md](packages/website/AGENTS.md) |
| Design system | [packages/design-system/AGENTS.md](packages/design-system/AGENTS.md) |
| Shared Storyblok library | [packages/storyblok-services/AGENTS.md](packages/storyblok-services/AGENTS.md) |
| Storyblok MCP server | [packages/storyblok-mcp/AGENTS.md](packages/storyblok-mcp/AGENTS.md) |
| Design tokens MCP | [packages/design-tokens-mcp/AGENTS.md](packages/design-tokens-mcp/AGENTS.md) |
| Token editor | [packages/design-tokens-editor/AGENTS.md](packages/design-tokens-editor/AGENTS.md) |
| Schema layer editor | [packages/schema-layer-editor/AGENTS.md](packages/schema-layer-editor/AGENTS.md) |
| n8n community node | [packages/storyblok-n8n/AGENTS.md](packages/storyblok-n8n/AGENTS.md) |
| Component builder MCP | [packages/component-builder-mcp/AGENTS.md](packages/component-builder-mcp/AGENTS.md) |
| JWT auth library | [packages/shared-auth/AGENTS.md](packages/shared-auth/AGENTS.md) |
| Token graph library | [packages/token-graph/AGENTS.md](packages/token-graph/AGENTS.md) |
| Storyblok field plugins | [theme-select](packages/storyblok-theme-select-field-plugin/AGENTS.md) · [icon-sprite](packages/storyblok-icon-sprite-picker-field-plugin/AGENTS.md) · [sharepoint-folder](packages/storyblok-sharepoint-folder-picker-field-plugin/AGENTS.md) |

## What this repository is

A **website accelerator**: a pnpm-workspaces monorepo that turns a kickstartDS design system plus a Storyblok space into an AI-generatable website. It is meant to be forked/copied per customer site — see [Adopting this starter for a new site](#adopting-this-starter-for-a-new-site).

Layers:

```
Storyblok CMS ──► storyblok-services (schema, transform, validate, generate)
      ▲                    ▲            ▲              ▲
      │                    │            │              │
  website (Next.js)   storyblok-mcp  storyblok-n8n   prompter API routes
      │                    │
      └── design-system ◄──┘   (74+ components, 76 JSON Schemas, tokens, Storybook)
                 ▲
   design-tokens-mcp · design-tokens-editor · schema-layer-editor · token-graph
                 ▲
            shared-auth (JWT, HS256) ── 3 MCP servers + design-tokens-editor
```

## Packages

| Directory | Package name | Published | Purpose |
| --- | --- | --- | --- |
| `packages/website` | `@kickstartds/ruhmesmeile-storyblok-starter` | changeset-ignored | Next.js 13.5.6 site (pages router, React 19), ISR, Visual Editor, Prompter |
| `packages/design-system` | `@kickstartds/design-system` | yes | 72 component dirs + 6 CMS page components, tokens, Storybook 10, Playroom |
| `packages/storyblok-services` | `@kickstartds/storyblok-services` | yes | Schema prep, transforms, validation, patterns, guidance, plan/generate, assets, themes |
| `packages/storyblok-mcp` | `@kickstartds/storyblok-mcp-server` | yes | MCP server: 32 tools + 7 app-only tools, 4+ dynamic resources, 7 prompts |
| `packages/design-tokens-mcp` | `@kickstartds/design-tokens-mcp` | yes | MCP server: 28 token tools, 4 resources, 3 prompts, 13 intent rules |
| `packages/component-builder-mcp` | `@kickstartds/component-builder-mcp` | yes | Read-only MCP server: 10 scaffolding/instruction tools, 3 resources |
| `packages/storyblok-n8n` | `n8n-nodes-storyblok-kickstartds` | yes (npm) | n8n community node: 28 operations across 4 resources, 10 workflow templates |
| `packages/design-tokens-editor` | `@kickstartds/design-tokens-editor` | private | Vite SPA + Express: visual token/theme editor, Storyblok Management API |
| `packages/schema-layer-editor` | `@kickstartds/schema-layer-editor` | private | Vite SPA + Express: edits CMS schema layers (`visibility`, `language`) |
| `packages/token-graph` | `@kickstartds/token-graph` | private | Sigma/graphology token-graph visualization, built into design-system |
| `packages/shared-auth` | `@kickstartds/shared-auth` | private | HS256 verification, revocation, OAuth 2.1 layer for MCP clients |
| `packages/storyblok-*-field-plugin` | `@kickstartds/storyblok-*-field-plugin` | private | 3 Storyblok field plugins (theme select, icon sprite picker, SharePoint folder picker) |
| `packages/umami-analytics` | — | n/a | **Not a workspace package** (no `package.json`): Dockerfile over the upstream Umami image |

## Setup

Requirements: **Node 24** (`.nvmrc`; every package that declares `engines` requires `>= 24.0.0` — the website, `token-graph`, and the field plugins declare none) and **pnpm 10.30.3** (`corepack enable && corepack prepare pnpm@10.30.3 --activate`). `mkcert` is required for local SSL (Storyblok Visual Editor iframes `https://localhost:3010`).

```bash
pnpm install
pnpm -r run build      # topological; required before first dev run
```

Website environment: copy `packages/website/.env.local.sample` → `.env.local`. Required: `NEXT_STORYBLOK_API_TOKEN`, `NEXT_STORYBLOK_OAUTH_TOKEN`, `NEXT_STORYBLOK_SPACE_ID`. AI features need `NEXT_OPENAI_API_KEY`; Markdown endpoints need `NEXT_PUBLIC_SITE_URL`. Committed `packages/website/.env` holds `NEXT_PUBLIC_*` domains, Docker image names, and `HOSTING_SERVER_IP`. Scripts wrapped in `dotenvx run -f .env.local` fail without it.

Storyblok CLI requires a one-time `pnpm --filter @kickstartds/ruhmesmeile-storyblok-starter storyblok-login`.

## Commands

**pnpm filter selectors must be full package names or paths.** Bare directory names do **not** resolve (`pnpm --filter website …` → "No projects matched the filters"); some root aliases in `package.json` are still broken this way (`dev:web`, `dev:mcp`, `layer-editor`). Working forms:

```bash
# Dev servers
pnpm --filter @kickstartds/ruhmesmeile-storyblok-starter dev   # Next :3000 + SSL proxy :3010
pnpm --filter ./packages/website dev                           # equivalent
pnpm --filter @kickstartds/design-system storybook             # Storybook :6006
pnpm --filter @kickstartds/design-system playroom              # Playroom :9000
pnpm --filter @kickstartds/storyblok-mcp-server start          # MCP over stdio (dev = tsc --watch only)
pnpm --filter @kickstartds/design-tokens-mcp dev
pnpm --filter @kickstartds/design-tokens-editor dev            # SPA :5173 + API :4200
pnpm --filter @kickstartds/schema-layer-editor dev             # SPA :4200 + API :4201
pnpm --filter @kickstartds/schema-layer-editor dev -- --schemas packages/website/node_modules/@kickstartds/design-system/dist/components --schemas-extra packages/website/components --namespace visibility --layer packages/website/cms/visibility
# (`pnpm layer-editor visibility` is the intended root alias for the above, but is currently broken)

# Quality (see "Testing reality" before trusting these)
pnpm -r run typecheck
pnpm -r run test
pnpm -r run lint

# Publishing
pnpm changeset && pnpm version-packages && pnpm publish-packages
```

Full per-package command sets: `packages/*/package.json` and [packages/website/AGENTS.md](packages/website/AGENTS.md).

## Architecture invariants

These hold across packages; violating them produces invalid CMS content or broken builds.

1. **`component` is the only CMS discriminator.** `type` is reserved for user-facing variants (e.g. CTA style). `processForStoryblok()` moves `type` → `component` and strips leftovers.
2. **Schema-derived, never hardcoded.** Component names, nesting rules, content types, and validation rules are derived from dereferenced JSON Schemas (`storyblok-services/src/registry.ts`, `validate.ts`). Root content types: `page`, `blog-post`, `blog-overview`, `event-detail`, `event-list`. Do not add hardcoded component lists.
3. **Storyblok props are flat.** Always `unflatten()` before rendering; `flatten()` to go back. `image_src` → `image.src`.
4. **All shared content logic lives in `@kickstartds/storyblok-services`.** Website API routes, the MCP server, and the n8n node import the same functions — identical validation and transforms everywhere. New shared behavior goes there, not into a consumer.
5. **Components are pure and Context-overridable.** No React state; client behavior is vanilla JS in `*.client.ts`/`*.client.js`. SCSS is imported globally (`index.scss`), never from components.
6. **Token layers are fixed:** branding `--ks-brand-*` → semantic `--ks-*` → component `--dsa-*`. Stay inside existing tokens; never invent values.
7. **Validation + compositional warnings run on every write tool**; `skipValidation: true` is the only escape hatch.
8. **Auth is opt-in and shared.** `MCP_JWT_SECRET` unset ⇒ auth disabled (local dev). One secret, one revocation list (`MCP_REVOKED_TOKENS`). Never add a per-service auth mechanism.
9. **Never push unmerged generated CMS config.** Always regenerate → merge → push (see [docs/adr/adr-storyblok-config-merge.md](docs/adr/adr-storyblok-config-merge.md)).

## Generated files — never hand-edit

| Artifact | Regenerate with |
| --- | --- |
| `packages/website/cms/{components,presets}.generated.json`, `cms/merged/`, `cms/merge-report.json` | `pnpm --filter @kickstartds/ruhmesmeile-storyblok-starter create-storyblok-config` / `… update-storyblok-config` |
| `packages/website/types/components.*.json` | `… pull-content-schema` |
| `packages/website/types/components-schema.d.ts` | `… generate-content-types` |
| `packages/website/token/{tokens.css,tokens.js,components.js,calculated.js,InlineIcon.tsx,storybook/}` | `… build-tokens` / `… extract-tokens` |
| `packages/design-system/dist/`, `src/types`, `src/token/token-graph.json`, `snippets.json`, `static/pagefind` | `pnpm --filter @kickstartds/design-system build` |
| `packages/design-system/__snapshots__/`, `static/img/screenshots/` | `build-storybook` → `create-component-previews` (Git LFS tracked) |
| `packages/storyblok-mcp/schemas/*.dereffed.json`, `src/ui/*.generated.ts` | `… sync-schemas` / `extract-tokens` / `bundle-render` |
| `packages/design-tokens-mcp/tokens/` | `pnpm --filter @kickstartds/design-tokens-mcp sync-tokens` |

## Destructive commands — confirm before running

- `pnpm --filter @kickstartds/ruhmesmeile-storyblok-starter init` → `packages/website/scripts/prepareProject.js`: **deletes stories, components, and asset folders in the live Storyblok space**, uploads presets. Fresh spaces only (it exits if a default "Home" story exists).
- `update-storyblok-config`, `push-components`, `push-component` → write the live CMS schema.
- `generate-content-types` → pulls live schema, overwrites `types/`.
- `sync-default-theme` → writes the default `token-theme` story.
- `pnpm --filter @kickstartds/design-system create-component-previews` → `test` **wipes `__snapshots__/`** before re-capturing; requires a prior `build-storybook` (and `pnpm exec playwright install`).
- `bash scripts/purge-history.sh` → `git-filter-repo` rewrite + force-push.

## Testing reality

Not every package has meaningful tests. Current state (verify before relying on it):

| Package | `test` | Notes |
| --- | --- | --- |
| `storyblok-services`, `storyblok-mcp` | Jest | `NODE_OPTIONS=--experimental-vm-modules`. `packages/storyblok-mcp/test/prompts.test.ts:20` asserts **6** prompts while `packages/storyblok-mcp/src/prompts.ts` defines **7** (`theme-management`) — this test fails today. |
| `storyblok-n8n` | Jest | `lint` script calls `eslint` but the package has no eslint dependency or config → lint fails. |
| `design-system` | image snapshots | `rimraf __snapshots__ && run-p -r test:*`; needs a built `storybook-static/`. CI's `build` does not produce it. |
| `schema-layer-editor` | Vitest | 2 test files (schema tree, content-type classification). |
| `component-builder-mcp`, `design-tokens-mcp` | none | `test` is `echo "Error: no test specified" && exit 1` — so `pnpm -r run test` can never pass. |
| `website`, editors, field plugins, `shared-auth`, `token-graph` | none | Use `typecheck` plus a runtime smoke test. |

CI (`.github/workflows/ci.yml`) runs `install --frozen-lockfile` → `-r build` → `-r typecheck` → `-r test` → `-r lint` on **Node 20**, while `.nvmrc` and the declared engines require Node 24; `-r test`/`-r lint` are currently red for the reasons above. CircleCI (`.circleci/config.yml`) runs a bare `kamal deploy` but no `config/deploy.yml` exists (only `config/deploy-<service>.yml`) — it is stale.

## Deployment

Kamal, one config per service (`config/deploy-*.yml`), shared secrets in `.kamal/secrets`. There is no default `config/deploy.yml`.

| Command | Service | Domain env var | Port | Dockerfile |
| --- | --- | --- | --- | --- |
| `kamal deploy -d website` | `server` | `NEXT_PUBLIC_PRIMARY_PUBLIC_SITE_DOMAIN` | 3030 | `packages/website/Dockerfile` |
| `kamal deploy -d storyblok-mcp` | MCP | `MCP_PUBLIC_DOMAIN` | 8080 | `packages/storyblok-mcp/Dockerfile` |
| `kamal deploy -d design-tokens-mcp` | MCP | `DESIGN_TOKENS_MCP_PUBLIC_DOMAIN` | 8080 | `packages/design-tokens-mcp/Dockerfile` |
| `kamal deploy -d component-builder-mcp` | MCP | `COMPONENT_BUILDER_MCP_PUBLIC_DOMAIN` | 8080 | `packages/component-builder-mcp/Dockerfile` |
| `kamal deploy -d design-tokens-editor` | editor | `DESIGN_TOKENS_EDITOR_PUBLIC_DOMAIN` | 8080 | `packages/design-tokens-editor/Dockerfile` |
| `kamal deploy -d schema-layer-editor` | editor | `SCHEMA_LAYER_EDITOR_PUBLIC_DOMAIN` | 8080 | `packages/schema-layer-editor/Dockerfile` |
| `kamal deploy -d design-system` | Storybook | `STORYBOOK_PUBLIC_DOMAIN` | 8080 | `packages/design-system/Dockerfile` |
| `kamal deploy -d umami-analytics` | `analytics` | `NEXT_PUBLIC_ANALYTICS_DOMAIN` | 3000 | `packages/umami-analytics/Dockerfile` |

Dockerfiles build workspace dependencies (shared-auth, storyblok-services, design-system) first and then re-run `pnpm install` to re-inject `dist` — `injectWorkspacePackages` snapshots workspace output at install time.

### Local ports

`3000` Next dev · `3010` website SSL proxy · `3030` website container · `5173` token editor SPA (proxies `/api` → `4200`) · `4200` token editor API **or** schema-layer-editor SPA (**collision — do not run both**) · `4201` schema-layer-editor API · `5432` Umami Postgres · `6006` Storybook (+ `/mcp`) · `8080` all hosted MCP/editor containers, field-plugin dev · `9000` Playroom.

## Documentation map

- [GETTINGSTARTED.md](GETTINGSTARTED.md) — Storyblok space setup, init flow, screenshots, deployment.
- [docs/README.md](docs/README.md) — index of guides, skills, ADRs, internal docs.
- `docs/adr/` — **12 architecture decision records; read the relevant one before changing tokens, auth, CMS config merging, or the MCP module layout.** Load-bearing: `adr-jwt-auth`, `adr-unified-theming`, `adr-storyblok-config-merge`, `adr-monorepo-integration`, `adr-mcp-apps-decisions`, `adr-cosmos-token-graph`, `adr-component-token-editor`, `adr-optoma-upstreaming`.
- `docs/guides/authentication.md` — JWT/OAuth setup, client config, revocation.
- `docs/guides/content-operations-workflows.md` — 14 n8n + MCP automation workflows (English intro, German workflow titles) plus an MCP tool reference.
- `docs/skills/*.md` — 6 German editor-facing workflows mapping to MCP prompts.
- `docs/internal/` — PRDs, plans, checklists, research. **Status headers are unreliable** (several say "Draft" for shipped work); treat code as ground truth, and note `specs-component-contracts-prd.md` describes an evaluation that was never implemented.

## Known defects (documented, not fixed)

1. Root aliases `dev:web`, `dev:mcp`, `layer-editor` use bare pnpm filters and fail; `dev:design-system`, `dev:tokens-editor`, `dev:component-mcp`, `dev:tokens-mcp` are correct.
2. `packages/storyblok-mcp/test/prompts.test.ts` expects 6 prompts; source defines 7.
3. `pnpm -r run test` / `pnpm -r run lint` cannot pass (placeholder scripts, missing eslint setup, snapshot build prerequisite).
4. CI pins Node 20 while `.nvmrc` and package `engines` require Node 24.
5. CircleCI job references a non-existent default Kamal config.
6. `packages/design-tokens-mcp/docker-compose.yml` sets `PORT=3000` while the server reads `MCP_PORT` (8080); its healthcheck targets the wrong port.
7. `.vscode/mcp.json` points two MCP servers at absolute paths in other checkouts; update before relying on it.
8. `packages/design-tokens-editor/README.md` claims Netlify Functions/Blobs deployment; the real deployment is Express + Kamal.
9. `packages/schema-layer-editor/src/cli.ts` ignores `SCHEMA_LAYER_NAMESPACE`/`SCHEMA_LAYER_PORT`; the Dockerfile hardcodes them.

## Adopting this starter for a new site

1. **Storyblok**: create an empty space, note the Preview API token, personal access token, and space ID; run `storyblok-login` (region `eu` by default, `STORYBLOK_REGION`).
2. **Branding**: edit `packages/website/token/dictionary/*` (semantic tokens) and `packages/website/token/branding-token.json` (branding layer); the design-system also ships 8 branding presets (`src/token/branding-tokens-{blizzard,burgundy,coffee,ember,granit,mint,neon,water}.json`). Rebuild tokens and `sync-default-theme`.
3. **Domains/infra**: `packages/website/.env` (`NEXT_PUBLIC_PRIMARY/SECONDARY_PUBLIC_SITE_DOMAIN`, `NEXT_PUBLIC_ANALYTICS_*`, `DOCKER_SITE_IMAGE_NAME`, `HOSTING_SERVER_IP`) and the domain/image env vars in each `config/deploy-*.yml`.
4. **Package names**: rename `@kickstartds/ruhmesmeile-storyblok-starter` (and Storyblok MCP/image names) if you publish or deploy under your own scope; update root aliases and `.changeset/config.json` `ignore` list together.
5. **Components**: add site-specific components under `packages/website/components/<name>/`, register them in `components/index.tsx`, extend `components/section/section.schema.json`, add the schema to the `create-storyblok-config` list in `packages/website/package.json`, then run `update-storyblok-config` + `generate-content-types`.
6. **Seed content**: `pnpm --filter @kickstartds/ruhmesmeile-storyblok-starter init` (fresh spaces only).
7. **Cleanup for your fork**: `docs/internal/marketing`, `docs/internal/data` (Hannover Messe / Falkenberg demo assets), and `packages/website/components/{book-a-demo,info-table}` are demo-specific.
