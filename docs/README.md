# Documentation

Agent and operator documentation for the ruhmesmeile Storyblok Starter.

**Start with [`/AGENTS.md`](../AGENTS.md)** — the canonical agent instruction file (package map, verified commands, invariants, generated files, destructive commands, testing reality, deployment, known defects). Package-local `AGENTS.md` files live next to the code they describe.

## Guides

Operator-facing documentation for setup, deployment, and day-to-day use.

- [Authentication](guides/authentication.md) — JWT/OAuth setup for all hosted services: issuing tokens, client config, revocation, troubleshooting
- [Content Operations Workflows](guides/content-operations-workflows.md) — 14 automation workflows using MCP tools and n8n, plus an MCP tool reference
- [Design Tokens MCP Quickstart](guides/design-tokens-mcp-quickstart.md) — Getting started with the Design Tokens MCP server
- [Design Tokens MCP Deployment](guides/design-tokens-mcp-deployment.md) — Cloud deployment guide for the Design Tokens MCP server

## Skills

Editor-facing workflows (written in German) that map to the MCP server's prompts. They are referenced by the MCP prompts and by the `storyblok-mcp` instructions.

| Skill | MCP prompt |
| --- | --- |
| [Plan Page Structure](skills/plan-page-structure.md) | `create-blog-post` + hybrid root-field flow |
| [Create Page from Scratch](skills/create-page-from-scratch.md) | `create-page` |
| [Migrate from URL](skills/migrate-from-url.md) | `migrate-from-url` |
| [Extend Existing Page](skills/extend-existing-page.md) | `extend-page` |
| [Content Audit](skills/content-audit.md) | `content-audit` |
| [Translate Page](skills/translate-page.md) | `translate-page` |

## Architecture Decision Records

12 accepted ADRs in [adr/](adr/). Read the relevant one **before** changing tokens, auth, CMS config merging, or the MCP module layout — each constrains future code.

| ADR | Constraint it imposes |
| --- | --- |
| [JWT Auth](adr/adr-jwt-auth.md) | One shared HS256 secret, revocation via `MCP_REVOKED_TOKENS`; unset secret disables auth |
| [Unified Theming](adr/adr-unified-theming.md) | Design system is the single token source; `tokensToCss()` is canonical; theme CRUD lives in `storyblok-services` |
| [Storyblok Config Merge](adr/adr-storyblok-config-merge.md) | Regenerate → merge → push; never push raw generated config; whitelist entries are never auto-removed |
| [Monorepo Integration](adr/adr-monorepo-integration.md) | `workspace:*` consumption, patches at the root, design-system `typecheck` expected to be noisy |
| [MCP Apps Decisions](adr/adr-mcp-apps-decisions.md) | Prompts/outputSchema/elicitation/progress stay separate modules; elicitation degrades silently |
| [Cosmos Token Graph](adr/adr-cosmos-token-graph.md) | Graph built at DS build time, shipped as JSON; graphology only |
| [Component Token Editor](adr/adr-component-token-editor.md) | Sparse component overrides, separate `componentTokens`/`componentCss`, catalog view |
| [Optoma Upstreaming](adr/adr-optoma-upstreaming.md) | Curated category batches; never merge the upstream fork; never copy generated catalogs/screenshots |
| [Design Tokens Editor Migration](adr/adr-design-tokens-editor-migration.md) | Themes are `token-theme` stories under `settings/themes/`; no Netlify path (partly superseded by unified theming) |
| [Schema Layer Editor](adr/adr-schema-layer-editor.md) | One layer file per component name; allowlist of content types; Vite dev proxy + Express in prod |
| [Editor Branding](adr/adr-editor-branding.md) | Editors use light theme, system fonts, no web-font links |
| [SharePoint Folder Picker](adr/adr-sharepoint-folder-picker.md) | Server-side Entra token proxy; store drive + folder ids; requires Azure app registration |

## Internal

Development-only documents — PRDs (19), plans (11), checklists (22), research (3), marketing drafts (3), and demo data assets (2). See [internal/](internal/) for the full tree.

**Status headers under `internal/` are unreliable**: several PRDs still say "Draft" for work that shipped, and some plans reference the pre-monorepo path `shared/storyblok-services/`. Treat the source code as ground truth; checklists are usually the best status evidence.

Reference docs kept at the internal root:

- [README-design-token-mcp](internal/README-design-token-mcp.md) — Design Tokens MCP reference
- [README-component-builder-mcp](internal/README-component-builder-mcp.md) — Component Builder MCP reference

Notable stale documents to distrust: `internal/plans/optoma-upstreaming-inventory.md` (claims nothing was ported; batches A–L are done), `internal/prd/cosmos-token-graph-prd.md` and `internal/prd/monorepo-migration-prd.md` (marked Draft, shipped), `internal/prd/specs-component-contracts-prd.md` (evaluation only — nothing implemented), `internal/plans/demo-industry-microsite-plan.md` (fictional demo microsite, no status).
