# AGENTS.md — packages/storyblok-n8n

`n8n-nodes-storyblok-kickstartds` v0.1.0, **published to npm** (MIT, `files: ["dist"]`). n8n community node for Storyblok content pipelines without an LLM intermediary.

## Layout

- `nodes/StoryblokKickstartDs/StoryblokKickstartDs.node.ts` — the single node; `execute()` dispatches **28 operations across 4 resources**:
  - `aiContent` (7): `generate`, `import`, `generateSection`, `planPage`, `analyzePatterns`, `generateRootField`, `generateSeo`
  - `story` (8): `list`, `get`, `createPage`, `update`, `delete`, `replaceSection`, `updateSeo`, `search`
  - `space` (7): `scrapeUrl`, `listComponents`, `getComponent`, `listAssets`, `listRecipes`, `listIcons`, `ensurePath`
  - `theme` (6): `list`, `get`, `apply`, `remove`, `create`, `update`
- `nodes/StoryblokKickstartDs/descriptions/*.ts` — parameter definitions per resource.
- `nodes/StoryblokKickstartDs/GenericFunctions.ts` — re-exports `@kickstartds/storyblok-services` plus n8n-facing validation wrappers; builds the schema registry from `nodes/…/schemas/`.
- `credentials/{StoryblokApi,OpenAiApi}.credentials.ts` — the two credential types (`spaceId`/`apiToken`/`oauthToken`; `apiKey`).
- `workflows/` — 10 `template-*.json` workflows + `website-content-operations.json` + 3 content-audit report helpers (`content-audit-report.js`, `content-audit-rules.js`, `content-audit-report-slack.js`).
- `scripts/sync-schemas.js` — copies dereferenced schemas into the node package at build time.

## Commands

```bash
pnpm --filter n8n-nodes-storyblok-kickstartds build          # sync-schemas → tsc → gulp build:icons
pnpm --filter n8n-nodes-storyblok-kickstartds dev            # tsc --watch
pnpm --filter n8n-nodes-storyblok-kickstartds test           # jest
pnpm --filter n8n-nodes-storyblok-kickstartds typecheck
pnpm --filter n8n-nodes-storyblok-kickstartds lint           # BROKEN: no eslint dep/config in this package
```

`prepublishOnly` runs `build`, so `sync-schemas` must resolve the design system (build it first).

## Conventions

- All Storyblok/OpenAI behavior comes from `@kickstartds/storyblok-services`. Never duplicate validation, transformation, or generation logic here — MCP and n8n must stay semantically identical.
- Content types and nesting rules come from the schema registry (`createRegistryFromSchemaDir`), not hardcoded switch statements.
- Adding an operation requires: description file entry, `execute()` branch, `GenericFunctions` wiring, `package.json`/README operation table, and a test.
- `dist/` is generated and published; `.n8n` icons are produced by `gulp build:icons`.

## Gotchas

- `lint` cannot pass (no ESLint config, no `eslint` dependency) — use `typecheck` instead.
- `README.md` under-reports the operation set (26 ops / 3 resources, Theme 4) versus the 28/4 implemented in source — source wins.
- Version/changeset: this package is publishable but has no changeset entries yet; publishing is `pnpm publish-packages` after `pnpm changeset`.
