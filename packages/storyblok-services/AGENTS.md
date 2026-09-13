# AGENTS.md — packages/storyblok-services

`@kickstartds/storyblok-services` (v1.0.0, published). Framework-agnostic core shared by the website API routes, `storyblok-mcp`, and `storyblok-n8n`.

**Rule: shared content logic belongs here, not in consumers.** If the MCP server and n8n node would both need it, it goes in this package.

## Module map (`src/`)

| Module | Responsibility |
| --- | --- |
| `index.ts` | Public barrel — **the only exported surface** (`package.json` `exports` → `dist/esm`/`dist/cjs`). Add new public API here. |
| `types.ts` | Shared types + 5 error classes |
| `storyblok.ts` | Client creation, import/replace section, SEO updates |
| `stories.ts` | Story CRUD, search, `ensurePath`, boilerplate stripping |
| `components.ts`, `assets.ts` | Component introspection; asset download/upload/wrap/normalize |
| `openai.ts`, `schema.ts` | OpenAI client; `prepareForOpenAi` (15-pass schema transformation), presets, `SUPPORTED_COMPONENTS` |
| `transform.ts` | `processForStoryblok`, `processOpenAiResponse`, `flatten`, `unflatten`, `ensureSubItemComponents` |
| `validate.ts` | `buildValidationRules`, `validate`, `format`, `checkCompositionalQuality` |
| `registry.ts` | `SchemaRegistry`, `ROOT_CONTENT_TYPES`, `createRegistryFromSchemaDir` |
| `patterns.ts`, `guidance.ts` | Content pattern analysis; field-level compositional guidance |
| `plan.ts`, `generate-section.ts`, `pipeline.ts` | `planPageContent`, `generateSectionContent`, `generateAndPrepareContent` / `generateRootFieldContent` / `generateSeoContent` |
| `scrape.ts`, `audit.ts`, `themes.ts` | URL scraping, content audit, theme CRUD |

## Commands

```bash
pnpm --filter @kickstartds/storyblok-services build      # build:esm then build:cjs
pnpm --filter @kickstartds/storyblok-services typecheck
pnpm --filter @kickstartds/storyblok-services test       # NODE_OPTIONS=--experimental-vm-modules jest
```

CJS output additionally emits `dist/cjs/package.json` to mark the folder as CommonJS (n8n consumes it).

## Invariants

- Root content types are `ROOT_CONTENT_TYPES = ["page", "blog-post", "blog-overview", "event-detail", "event-list"]` (`registry.ts`). Everything else is derived from schemas — never hardcode component names or nesting rules.
- Content destined for Storyblok uses `component` as its sole discriminator; `processForStoryblok()` performs `type` → `component` and strips leftover `type` from nodes that already carry `component`.
- Validation and compositional warnings run inside the write path; `skipValidation: true` is the documented escape hatch.
- Keep this package free of React/DOM dependencies; visualization helpers (e.g. `buildGraphFromCssProperties`) belong in `@kickstartds/token-graph`.
- Build order: `shared-auth` → `storyblok-services` → consumers (`storyblok-mcp`, `storyblok-n8n`, website).

## Gotchas

- Only `index.ts` is exported: adding a module without re-exporting it is invisible to consumers.
- Tests import compiled paths (`../src/x.js` style with ESM), hence the `--experimental-vm-modules` flag.
- Consumers rely on identical semantics here — changing transform/validation behavior changes the website, MCP server, and n8n node at once. Update `packages/storyblok-services/README.md` (the API reference) with behavior changes.
