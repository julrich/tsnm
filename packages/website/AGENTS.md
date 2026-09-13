# AGENTS.md — packages/website

Next.js **13.5.6** (pages router) + React **19.2** Storyblok site. Package `@kickstartds/ruhmesmeile-storyblok-starter`, excluded from changesets (not published).

Read [../../AGENTS.md](../../AGENTS.md) first for repo-wide invariants.

## Layout

- `pages/[[...slug]].tsx` — catch-all Storyblok page (ISR, `getStaticPaths` fallback `blocking`, `data-pagefind-body` for Pagefind).
- `pages/_preview/[[...slug]].tsx` — draft-only twin rendered inside the Visual Editor.
- `pages/_app.tsx` — provider stack (`LanguageProvider → BlurHashProvider → DsaProviders → ComponentProviders → ImageSize/RatioProviders`), header/footer/breadcrumb shell, theme CSS injection.
- `pages/api/` — `preview`/`exit-preview` (draft mode, `_storyblok_tk` SHA1 check), `up` (health `"Ok"`), `server-sitemap.xml`, `markdown/[...slug]` (fetch own HTML → turndown), `sharepoint/token` (Azure client-credentials proxy), `prompter/{story,patterns,recipes,plan,generate-section,import,ideas}.ts` + `_helpers.ts`, and three deprecated legacy routes (`content`, `import`, `ideas`) that are **still live** with `Deprecation`/`Sunset: 2026-06-01` headers.
- `middleware.ts` — rewrites `*.md` paths and `Accept: text/markdown` to `/api/markdown/<slug>`.
- `helpers/` — `storyblok.ts` (`initStoryblok`, `fetchStory/fetchStories/fetchPaths/fetchPageProps`, `storyProcessing` for assets/links/relations/number coercion), `unflatten.ts` (`unflatten`/`flatten`), `fonts.ts` (next/font Montserrat), `sharepoint.ts`, `apiUtils.ts`.
- `components/` — `index.tsx` registry (46 entries) + `editable()` HOC; `ComponentProviders.tsx` overrides `Picture` (unpic + blurhash), `Link`, and per-component contexts; local components `book-a-demo/`, `info-table/`, `prompter/`, `headline/`, plus page components (`Page.tsx`, `BlogPost.tsx`, `BlogOverview.tsx`, `EventDetail.tsx`, `EventList.tsx`, `Search.tsx`, `SettingsPreview.tsx`, `TokenThemePreview.tsx`).
- `cms/` — hand-maintained only `visibility/*.schema.json` and `language/*.schema.json`; everything else there is generated and gitignored.
- `token/` — `dictionary/` (DTCG source), compiled `*-token.scss`, `branding-token.json` + 5 preset CSS files.
- `scripts/` — `prepareProject.js` (destructive init), `mergeStoryblokConfig.ts`, `seedCmsConfig.js`, `generatePresets.js`, `extractComponentToken.js`, `calculateCssProperties.js`, `createBlurHashes.js`, `syncDefaultTheme.ts`, `bundleStaticAssets.js`.

## Commands

```bash
pnpm --filter @kickstartds/ruhmesmeile-storyblok-starter dev          # Next :3000 + SSL proxy :3010 (mkcert)
pnpm --filter @kickstartds/ruhmesmeile-storyblok-starter build        # build-tokens → sync-default-theme → extract-tokens → blurhashes → bundle-static-assets → next build
pnpm --filter @kickstartds/ruhmesmeile-storyblok-starter create-storyblok-config   # regenerate CMS config from JSON schemas
pnpm --filter @kickstartds/ruhmesmeile-storyblok-starter update-storyblok-config   # regenerate → rename → pull → merge → push
pnpm --filter @kickstartds/ruhmesmeile-storyblok-starter generate-content-types    # pull schema + generate TS types
pnpm --filter @kickstartds/ruhmesmeile-storyblok-starter push-components | push-component
pnpm --filter @kickstartds/ruhmesmeile-storyblok-starter extract-tokens | build-tokens | sync-default-theme
pnpm --filter @kickstartds/ruhmesmeile-storyblok-starter init        # DESTRUCTIVE: wipes a fresh Storyblok space and seeds it
pnpm --filter @kickstartds/ruhmesmeile-storyblok-starter lint         # next lint
pnpm --filter @kickstartds/ruhmesmeile-storyblok-starter env      # plop → .env.local (args from $NEXT_STORYBLOK_API_TOKEN/$NEXT_STORYBLOK_OAUTH_TOKEN/$NEXT_STORYBLOK_SPACE_ID)
pnpm --filter @kickstartds/ruhmesmeile-storyblok-starter netrc    # plop → ~/.netrc (args from $STORYBLOK_LOGIN_EMAIL/$NEXT_STORYBLOK_OAUTH_TOKEN/$STORYBLOK_REGION)
```

`postbuild` runs `next-sitemap` + `pagefind`. There is no `typecheck`/`test` script in this package.

## Conventions

- Register every Storyblok component in `components/index.tsx` via `editable(Component, nestedBloksKey?)`. Nested blok keys: `section`/`slider` → `components`, `split-even` → `firstComponents`, `split-weighted` → `mainComponents`.
- `editable()` calls `unflatten()` and passes `typeProp` as `type`; always render from unflattened props.
- Never introduce React state in components — use vanilla JS client behavior (design-system pattern).
- SCSS is imported globally (`index.scss`, `components/prompter/prompter.scss`), not per component.
- Site-local component tokens go in `components/<name>/<name>-tokens.scss` (e.g. `info-table`, `book-a-demo`).
- Adding a component: create dir → registry entry → add to `section.schema.json` `anyOf` → add to the `--components` list inside the `create-storyblok-config` script → `update-storyblok-config` → `generate-content-types`.
- Prompter schemas resolve from `packages/storyblok-mcp/schemas` (dev) or `../storyblok-mcp/schemas` (Docker) via `pages/api/prompter/_helpers.ts`.

## Environment

`.env.local` (gitignored, required by `dotenvx`-wrapped scripts): `NEXT_STORYBLOK_API_TOKEN`, `NEXT_STORYBLOK_OAUTH_TOKEN`, `NEXT_STORYBLOK_SPACE_ID`, `NEXT_OPENAI_API_KEY`, `NEXT_PUBLIC_SITE_URL`.

Committed `.env`: `NEXT_PUBLIC_PRIMARY_PUBLIC_SITE_DOMAIN`, `NEXT_PUBLIC_SECONDARY_PUBLIC_SITE_DOMAIN`, `NEXT_PUBLIC_ANALYTICS_DOMAIN`, `NEXT_PUBLIC_ANALYTICS_SITE_ID`, `NEXT_PUBLIC_C15T_URL`, `DOCKER_SITE_IMAGE_NAME`, `HOSTING_SERVER_IP`.

Optional: `STORYBLOK_REGION` (default `eu`, used by `storyblok.config.ts`) and `AZURE_TENANT_ID`/`AZURE_CLIENT_ID`/`AZURE_CLIENT_SECRET` for the SharePoint token proxy.

## Gotchas

- `next` lives in `devDependencies` while `react`/`react-dom` are runtime deps at v19 (Next 13 nominally targets React 18) — do not "fix" this casually; both the website and the design system build against it.
- `next.config.js` sets `output: standalone`, CSP, `experimental.outputFileTracingRoot` at the monorepo root, redirects the secondary domain to primary, and externalizes `jsdom`/`readability`/`turndown` server-side.
- `scripts/prepareProject.js` deletes live Storyblok content. Never run it against a populated space.
- Generated + gitignored: `cms/merged/`, `cms/*.generated.json`, `cms/merge-report.json`, `types/components.*.json`, `token/{tokens.*,components.js,calculated.js,InlineIcon.tsx,storybook/}`, `public/{sitemap*,robots.txt,pagefind,img/screenshots,_}`. `public/blurhashes/` is committed.
- `update-storyblok-config` runs pull → merge → push against the **live** space; inspect `cms/merge-report.json` afterwards (see `docs/adr/adr-storyblok-config-merge.md`).
