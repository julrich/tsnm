# AGENTS.md — packages/website

Next.js **13.5.6** (pages router) + React **19.2** Storyblok site. Package `personal-site`, excluded from changesets (not published).

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
pnpm --filter personal-site dev          # Next :3000 + SSL proxy :3010 (mkcert)
pnpm --filter personal-site build        # build-tokens → sync-default-theme → extract-tokens → blurhashes → bundle-static-assets → next build
pnpm --filter personal-site create-storyblok-config   # regenerate CMS config from JSON schemas
pnpm --filter personal-site update-storyblok-config   # regenerate → rename → pull → merge → push
pnpm --filter personal-site generate-content-types    # pull schema + generate TS types
pnpm --filter personal-site push-components | push-component
pnpm --filter personal-site extract-tokens | build-tokens | sync-default-theme
pnpm --filter personal-site init        # DESTRUCTIVE: wipes a fresh Storyblok space and seeds it
pnpm --filter personal-site lint         # next lint
pnpm --filter personal-site env      # plop → .env.local (args from $NEXT_STORYBLOK_API_TOKEN/$NEXT_STORYBLOK_OAUTH_TOKEN/$NEXT_STORYBLOK_SPACE_ID)
pnpm --filter personal-site netrc    # plop → ~/.netrc (args from $STORYBLOK_LOGIN_EMAIL/$NEXT_STORYBLOK_OAUTH_TOKEN/$STORYBLOK_REGION)
```

`postbuild` runs `next-sitemap` + `pagefind`. There is no `typecheck`/`test` script in this package.

## Conventions

- **Site-local components** live in `components/<name>/` with the same shape as the design system's: `{Name}Component.tsx` (pure, `forwardRef`, Context-overridable, no React state), `<name>.schema.json`, `<name>.scss` + `<name>-tokens.scss`, and `{Name}Defaults.ts`. Behaviour goes in `<name>.client.js` — plain DOM, no framework — which `bundle-static-assets` bundles into `public/_/client.js` (the pattern used by `components/umami.client.js` and `components/track-teaser-box/track-teaser-box.client.js`). **After adding or editing a client script, re-run `bundle-static-assets`** — `next dev` serves the previously built bundle, so the behaviour silently won't run locally until you do. A `MutationObserver` is needed for cards added by client-side navigation.
- Registering a component touches four places: the registry in `components/index.tsx` (`editable(...)` — pass the nested-bloks key only for container components), the `$ref` list in `components/section/section.schema.json`, the `--components` list in the `create-storyblok-config` script, then `update-storyblok-config` + `generate-props`.
- `components/track-teaser-box/` (flip card: cover + topic on the front, native `<audio>` on the back) is a good reference for all of the above.
- Icons: the sprite is built from `packages/design-system/src/token/dictionary/icons/{built-in,presets}/*.svg` (24×24, single `<path>`, filled silhouette). To add one, drop the SVG in, run `pnpm --filter @kickstartds/design-system build-tokens`, build the DS, `pnpm install` (re-inject `dist`), then deploy. The ten brand glyphs added for this site (github, youtube, twitch, soundcloud, mixcloud, discogs, bandcamp, lastfm, instagram, whatsapp) came from **Simple Icons** (CC0-1.0); `socialLinks.icon` values are the sprite's `icon-<name>` suffix.
- Fonts: the site's theme sets a system font stack, so `helpers/fonts.ts` is deliberately inert (no `next/font` load, `localFontFamilyName` is a sentinel). `_document.tsx` only emits a Google Fonts link for a theme family that is a single, non-generic name — the helper `googleFontUrl()` owns that decision.

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
- `scripts/prepareProject.js` deletes live Storyblok content. Never run it against a populated space. It must be invoked as `pnpm --filter personal-site run init` — the bare `pnpm … init` form hits pnpm's built-in `init`.
- **`dev` needs the generated artifacts.** `build` produces `token/{tokens.*,calculated.js,components.js,InlineIcon.tsx}` and `components/bundle-hash.ts`; `dev` does not. Run `build-tokens`, `extract-tokens`, `blurhashes`, `bundle-static-assets` (and `sync-default-theme` if you want the CMS theme story) once, otherwise the app fails to compile with `Can't resolve '@/token/calculated'`.
- **Storyblok layout for settings and themes:** the theme pipeline owns the folder `settings/` and writes `settings/themes/<slug>` stories (`syncDefaultTheme.ts`). A *story* with slug `settings` at the space root collides with that folder (`422 Slug settings already taken`), so the settings story lives inside the folder as `settings/settings`. `fetchPageProps` finds it purely by `content_type=settings`, so its slug does not matter — but the folder does.
- Generated + gitignored: `cms/{components,presets}.123456.json`, `cms/merged/`, `cms/*.generated.json`, `cms/merge-report.json`, `types/components.*.json`, `token/{tokens.*,components.js,calculated.js,InlineIcon.tsx,storybook/}`, `public/{sitemap*,robots.txt,pagefind,img/screenshots,_}`. `public/blurhashes/` is committed.
- `update-storyblok-config` runs pull → merge → push against the **live** space; inspect `cms/merge-report.json` afterwards (see `docs/adr/adr-storyblok-config-merge.md`).
- **Build order matters for every CMS/schema script.** `create-storyblok-config`, `generate-props`, `dereference-schemas`, `create-defaults` and `update-storyblok-config` read the design-system through `node_modules/@kickstartds/design-system/dist/components`. With pnpm's `injectWorkspacePackages: true`, that path only exists after `pnpm --filter @kickstartds/design-system build` **followed by `pnpm install`**. Skipping the re-install yields `Couldn't find a reffed json in json allOf graph generation` (the `schema` layer loads zero schemas).
- `generate-content-types` pulls the live schema and overwrites the committed, LFS-tracked `types/components-schema.{json,d.ts}` and `types/components-presets.json` — commit the regenerated files after schema changes.
