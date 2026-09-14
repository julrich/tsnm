# Personal site from the ruhmesmeile Storyblok Starter

## Execution status (2026-09-13) — deployed

**Live:**
- Website at **https://www.tsnm.de** (`tsnm.de` → 308 → www), Let's Encrypt cert (`CN=www.tsnm.de`, until 2026-12-12), `/api/up` → `Ok`, homepage 200 with header/footer from the CMS, no Book-a-Demo, no language switcher, **0** `localhost` references.
- `robots.txt` → `Allow: /` + `Host: https://www.tsnm.de` + both sitemaps; `sitemap.xml` → index; `server-sitemap.xml` → only `https://www.tsnm.de/`.
- Analytics live: `usage.tsnm.de` (Umami + `postgres:15` accessory, `{"ok":true}` heartbeat) and the site carries `data-website-id="0598e946-9426-4749-a197-d1f61bf38939"`; `script.js` serves 200. Admin password rotated off the default and stored in `packages/website/.env.local` as `UMAMI_ADMIN_PASSWORD` (+ `/root/.umami-admin-password` on the server).
- Design tokens editor live at **https://design.tsnm.de** — `/api/health` → `{"status":"ok"}`, `/api/auth/me` → `Not authenticated`, `/api/tokens` → 401 without a token (auth enabled, `MCP_JWT_SECRET` generated into `packages/design-tokens-editor/.env` + `.env.sh`, both gitignored).
- Design system Storybook live at **https://ds.tsnm.de** — nginx serving `storybook-static` on 8080, Let's Encrypt cert `CN=ds.tsnm.de` (to 2026-12-13), `/` 200, `/iframe.html` 200, `/index.json` = **211 entries** (158 stories, 53 docs). `STORYBLOK_API_TOKEN` is baked at build time (Vite `define`) so the theme toolbar can fetch CMS `token-theme` stories — verified present in the shipped bundle. Deploy: `set -a && . packages/website/.env.sh && . packages/design-system/.env.sh && set +a && kamal deploy -c config/deploy-design-system.yml` (the DS image builds Storybook itself, so no host-side `dist/` is needed; `KAMAL_REGISTRY_PASSWORD` comes from the website env file — source both or `docker login` fails with `flag needs an argument: 'p' in -p`).

**Storyblok space `tsnm` (295207126131307):** seeded with 94 components, story `home` (“Getting Started”, published — still demo content), `settings` story at `settings/settings`, default theme at `settings/themes/default` (`system: true`).

**Repo state:** Phase 2a–2g applied (package renamed `personal-site` + `private: true`; Dockerfile/changeset/root-alias filters fixed; `netlify.toml` deleted; `cms/language/` and `cms/visibility/` deleted; Book-a-Demo removed; analytics guard; crawlable robots; manifest link). `lint` clean; `tsc --noEmit` shows only the pre-build generated-module gaps that `build` fills.

### Port from the previous repos (github.com/julrich/tsnm-ds + tsnm-page)

Both repos were cloned and audited. Find them at `/tmp/tsnm-ds` and `/tmp/tsnm-page` (re-clone with `git clone --depth 1 <url>`).

**Reused, now live:**
- **Palette** from `tsnm-ds/colors/src/tokens.css` → compiled into a Storyblok `token-theme` story at `settings/themes/tsnm` (selected via `settings.theme`): bg `#d3ffd7` (old Chakra body bg), fg `#021605`, primary `#4bfe4a`, link `#4bfe4a`, inverted surfaces `#050505`, secondary cyan `#65fffc` on inverted, semantic info `#007eb4` / success `#008300` / warning `#b85b00` / error `#cc0000`. Verified in the served HTML: 16 `--ks-brand-color-*` vars.
  Regenerate with: `branding-tokens.json` (DS default) + overrides → `tokensToCss()` → story `settings/themes/tsnm` (`name`, `tokens`, `css`, `system: false`). The DS default theme stays untouched; `syncDefaultTheme.ts` only rewrites `settings/themes/default`.
- **Favicon** — `tsnm-page/public/favicon.ico` is **byte-identical** in production (`sha256 2b8ad2d3…`). It is a black tile with a white *equilateral* play triangle (verified as a single continuous stroke widening 2 px → 125 px; **not** the create-next-app/Next.js logo, which differs by hash). The 256 px master generated the full set: `favicon-16/32`, `apple-touch-icon` (180), `android-chrome-192/512`, five mstiles, `safari-pinned-tab.svg` (hand-authored triangle silhouette), manifest `name`/`short_name` = `tsnm`, `theme_color` `#050505`, `background_color` `#d3ffd7`, `browserconfig.xml` `TileColor` `#050505` + corrected paths.
- **Copy and links** (from `tsnm-page/pages/*` and the old DS header/footer): SEO titles/descriptions (`Personal page of TSNM / Jonas Ulrich. Musings about music and Dev`), nav `Music`/`Coding`, header CTA `Follow` → `twitter.com/intent/follow?screen_name=tsnmp`, footer `© 2026 TSNM / Jonas Ulrich. All rights reserved`, social links (Twitter/LinkedIn/Xing via `socialLinks` bloks — the modern sprite only ships facebook/linkedin/twitter/xing) and text groups `Elsewhere` (GitHub, SoundCloud, Mixcloud, Discogs, Last.fm, Bandcamp) + `Follow` (Twitter, YouTube, Twitch) via `navGroups`.
- **Pages**: `home` rewritten, `music` and `coding` created — all published, all 200, all in the sitemap.

**Deliberately not ported:**
- `tsnm-ds` is not a kickstartDS repo: it's a Divriots/Backlight "selection" on **kickstartDS 1.6 + Chakra UI 1.7** (10+ major versions behind the current `@kickstartds/* ^4.1`). Every component there is a thin re-export wrapper with no schema, no `*.client`, no tokens — wrapper code does not survive the jump.
- `tsnm-page` is Next 12 / React 17 with Chakra for chrome and **OneGraph/Netlify Graph** for live Spotify + GitHub data; the GraphQL client, API routes and all `.jsx` bridges are obsolete.
- The old nav's `How it's made` → `/how` link had no page; omitted rather than reproducing a dead link.

*(The three follow-ups listed here in the first round — system typography, the audio card, and the extra glyphs — were all implemented; see below. The Spotify/GitHub feeds and a `How it's made` page were dropped by decision.)*

**Second round (fonts, icons, audio card) — live and verified:**
- **Typography = system stack.** The theme's `font.family.{display,copy,interface}` now start with `system-ui` (the old site's stack). `helpers/fonts.ts` is deliberately inert — no `next/font` load, `localFontFamilyName` is a sentinel — so the page ships **zero** webfont files (was 5 preloaded Montserrat woff2). Verified: 0 webfont requests, family value read back as the system stack.
- **Bug found and fixed while switching:** `_document.tsx` extracted font names with `[a-zA-Z0-9_,]+`, which stops at the hyphen, so a system stack produced the family names `system` and `ui` and emitted **4 bogus Google Fonts links** per page. Replaced the four duplicated blocks with a `googleFontUrl()` helper (hyphens included, plus a `SYSTEM_FAMILIES` deny-list). Verified: 0 `fonts.googleapis.com` references.
- **Icon pack:** the old sprite had youtube/instagram/whatsapp and friends; the modern sprite only facebook/linkedin/twitter/xing. Ten brand glyphs (**Simple Icons, CC0-1.0**, no attribution required) were added to `packages/design-system/src/token/dictionary/icons/presets/` — github, youtube, twitch, soundcloud, mixcloud, discogs, bandcamp, lastfm, instagram, whatsapp — taking the sprite from 29 to **39 symbols**. They land through the existing pipeline (`build-tokens` → DS build → `pnpm install` → deploy). The footer now renders **8 social icons** (Twitter, LinkedIn, Xing, YouTube, Twitch, Instagram, GitHub, SoundCloud) alongside the text groups.
- **`track-teaser-box` audio card** — reimplemented for a **non-React frontend** as the design system demands: markup in `TrackTeaserBoxComponent.tsx` (pure, `forwardRef`, Context-overridable), a native `<audio controls>` element instead of `react-h5-audio-player`, a CSS `rotateY` flip instead of `react-card-flip`, and behaviour in `track-teaser-box.client.js` (plain DOM: toggle `data-flipped`, pause on flip-back, flip back on `ended`, Escape, `MutationObserver` for client-side navigation). Registered in all four places (registry, `section.schema.json`, `--components` list, `generate-props`) and pushed to the CMS.
- **Content:** five cards on `/music` using the old fixtures, with covers uploaded to the Storyblok CDN in a `Track Covers` folder (ids 219742234108132 … 219742245322984) and alt text `Cover art: <topic>`. The audio previews are the old repo's public SoundHelix sample MP3s — **placeholders to replace with real tracks**.
- **Verified in a real browser** (local dev + Puppeteer, then production): 5 cards, cover rendered at 640 px from the CDN with alt text, `<audio>` carrying the preview URL and `controls`, two flip buttons, client script initialising the card (`data-track-teaser-box-ready`), click toggling `data-flipped` + `aria-pressed`, and the flip resolving to `matrix3d(-1,0,0,0,0,1,0,0,0,0,-1,0,0,0,0,1)` (rotateY 180°) with `backface-visibility: hidden`. Animations cannot be observed in a hidden headless tab, so the geometry check disables the transition first.

**Field-shape rules learned the hard way (now in `AGENTS.md`):** `storyProcessing` rewrites asset objects to plain URL strings and multilinks to strings before components see them; a JSON Schema `format: image` becomes a Storyblok `asset` field but `format: uri` becomes a **multilink**; `token-theme.tokens` is a *text* field holding JSON as a string.

**Dropped by decision:** the Spotify/GitHub data feeds (OneGraph/Netlify Graph, dropped for now) and a `How it's made` page (the old nav linked `/how` with no page behind it — left out rather than reproducing a dead link).

**Logo (found and restored):** neither old repo contains a single image file — `find` over both trees returns only `tsnm-page/public/vercel.svg` and `public/favicon.ico`. The logo was never a file you owned: the old header hotlinked the **SoundCloud avatar** (`i1.sndcdn.com/avatars-000003159261-cat82d-t200x200.jpg`, `tsnm-ds/header/src/Header.tsx:78-84`, rendered 50×50, alt "tsnm Logo") beside a bold text label styled by `tsnm-page/styles/logo.css` (`.logo` / `.logo__text`), and the old footer used **kickstartDS's placeholder wordmark** as an inline SVG (`viewBox="0 0 120 28"`). The new site had inherited the design system's own generic wordmark (`packages/design-system/static/logo.svg`, sha `6123957dd745232a` — the seeded asset was byte-identical). Both old URLs were still online, so: the avatar was fetched and uploaded as `tsnm-logo.jpg` (id 219880438843960) and the portrait as `jonas-ulrich-portrait.jpg` (id 219880441154105) into a Storyblok **Brand** folder; header and footer `logo_src` now point at the avatar (with `logo_alt`, `logo_width`/`logo_height` as **strings** — this space rejects numbers), and the portrait fills `seo.image`/`seo.cardImage` as the site-wide OG image. Verified in production: 0 references to the old placeholder hash, logo loaded at 40×40 in header and footer, correct alt, `og:image` set, all pages 200.

Note: `/tmp` is wiped periodically by systemd (`tmpfiles`), so the `/tmp/tsnm-ds` and `/tmp/tsnm-page` clones are volatile — re-clone with `git clone --depth 1 <url>` when needed.

**Third round (Storybook branding, default theme, favicons for both surfaces) — live and verified:**
- **Logo in Storybook.** The sidebar brand image is `static/tsnm-logo.png` (128×128, derived from the logo upload) with `brandUrl` → `https://www.tsnm.de` (new tab). The branding source is the **manager theme object in `.storybook/themes.ts`** (`brandTitle`/`brandUrl`/`brandImage`), *not* `addons.setConfig` — that mistake cost one rebuild; documented in the DS AGENTS file. Sidebar title is "TSNM Design System".
- **Storybook opens on the TSNM theme.** The palette is now a first-class DS preset: `packages/design-system/src/token/branding-tokens-tsnm.json` (values derived from the CMS story, AJV-validated and compiled to `branding-tokens-tsnm.css`), registered in `STATIC_THEME_FILES`, listed first in the theme toolbar with its swatch colours, and set as the default via `initialGlobals.theme = "tsnm"`. Verified in a browser against a local build: the preview iframe reports `--ks-brand-color-bg: #d3ffd7`, `--ks-brand-color-primary: #4bfe4a` and the system font from `/tokens/branding-tokens-tsnm.css`, with no clicking. A static preset (rather than `cms:tsnm`) keeps the default deterministic and independent of the Storyblok fetch.
- **Favicons from the logo, on both surfaces.** Generated from `tsnm-logo.jpg`: `favicon.ico` (16/32/48), 16/32/192 PNGs, apple-touch (180), android-chrome 192/512, five mstiles, plus `favicon-192-192.png` for the Storybook. `packages/website/public/favicon/` and `packages/design-system/static/favicon/` now carry identical art (verified by sha256 in production on both hosts), the unused `safari-pinned-tab.svg` was deleted from both, and the Storybook's `manager-head.html` icons resolve.
- **Caveat:** at 16 px the mark reads as a green diamond blur; at 32 px the diamond and inner glyph are legible. That is inherent to the artwork (the mark spans the full frame — there is nothing to crop tighter), so a crisper small-size favicon would need either a simplified/posterised variant or the old play-triangle mark.

### Defects found by verification and fixed
1. **`.dockerignore` patterns were root-anchored.** `.env.local` inside `packages/website/` was copied into the build context, so the image baked `NEXT_PUBLIC_SITE_URL=https://localhost:3010` (canonical URLs and sitemaps pointed at localhost) and the context also carried `.env.sh` with real secrets. Now `**/.env.local`, `**/.env.sh`, `**/*.pem`.
2. **`transformRobotsTxt` produced `Sitemap: undefined/...`** — its second argument is not the resolved config. Removed the override; next-sitemap's own resolution (proven by the earlier `additionalSitemaps` output) yields the right absolute URLs.
3. **Theme stories were rendered as pages** — `fetchPaths()` filtered only `settings`; now also `token-theme` and anything under `settings/`, so `settings/themes/default` no longer appears in the sitemap.
4. **Kamal 2 destinations don't resolve this repo's config names.** `kamal deploy -d website` fails with `Configuration file not found in config/deploy.yml`; Kamal 2 reads `config/deploy.<destination>.yml`. All active docs now use `-c config/deploy-<name>.yml`.
5. **`pnpm --filter personal-site init` hits pnpm's built-in `init`** — must be `pnpm --filter personal-site run init`. Documented.
6. **`dev` needs build-generated artifacts** (`token/calculated.js`, `components/bundle-hash.ts`, `token/InlineIcon.tsx`): run `build-tokens`, `extract-tokens`, `blurhashes`, `bundle-static-assets` once or the app fails with `Can't resolve '@/token/calculated'`.
7. **Settings story vs theme folder:** the by-the-book root slug `settings` collides with the `settings/` folder that `syncDefaultTheme.ts` owns (`422 Slug settings already taken`); the settings story lives at `settings/settings`. `fetchPageProps` only cares about `content_type=settings`.
8. **Storybook container always reported `unhealthy`.** `packages/design-system/Dockerfile`'s `HEALTHCHECK` probed `http://localhost:8080/`, which resolves to `::1` while nginx listens on IPv4 only — the check failed while the service worked (Kamal's proxy check uses its own probe, so deploys still succeeded and the site served). Now probes `127.0.0.1`; container reports `healthy`.
9. **`_document.tsx` emitted bogus Google Fonts links** for system/generic families: the extraction regex `[a-zA-Z0-9_,]+` stops at the hyphen, turning `system-ui` into `system` and `ui-monospace` into `ui`, both single names that passed the "no comma" guard. Replaced the four duplicated blocks with one `googleFontUrl()` helper (hyphens included + a `SYSTEM_FAMILIES` deny-list).
10. **Client behaviour silently missing in `next dev`:** `components/**/*.client.js` reach the browser only through `bundle-static-assets` → `public/_/client.js`. Editing a client script (or adding one) needs that script re-run, otherwise local dev serves the stale bundle while production picks it up at build time.

### Incident (self-inflicted, repaired)
A secret-injection script of mine opened `packages/design-tokens-editor/.env` and `.env.sh` with `"w"` **before** reading them back, truncating both to just the new `MCP_JWT_SECRET`. Rebuilt from `.env.example` plus the values recorded during verification; every field reconciles to the exact length observed beforehand (`STORYBLOK_OAUTH_TOKEN` 50, `STORYBLOK_SPACE_ID` 15, `DOCKER_USERNAME` 11, `DOCKER_DESIGN_TOKENS_EDITOR_IMAGE_NAME` 37, `DESIGN_TOKENS_EDITOR_PUBLIC_DOMAIN` 14, `HOSTING_SERVER_IP` 10). A fresh 64-char JWT secret was generated.

### Still open
- **Favicon set**: `public/favicon/*` is still the starter's icon set; only the manifest `name`/`short_name` (“tsnm”) and the icon `src` paths are corrected. Needs a supplied source image.
- **Content**: the demo “Getting Started” page is what is live; `NEXT_OPENAI_API_KEY` is empty so the Prompter and MCP generation tools stay inactive.
- **Visual identity** (Phase 9): theme, type, colours — waiting on reference designs.
- Optional extras not deployed: Storybook (`design-system`), the three MCP servers, the n8n node.

**Correction to an earlier assumption in this plan:** the schema-tooling failure (`Couldn't find a reffed json in json allOf graph generation`) is **not** a repo defect and has nothing to do with the deleted layers. Root cause: the design system must be built **and then `pnpm install` re-run** before any `kickstartDS schema …`/`cms storyblok` command in `packages/website`. With `injectWorkspacePackages: true`, pnpm snapshots `@kickstartds/design-system` into the store at install time, so `packages/website/node_modules/@kickstartds/design-system/dist/` does not exist until a post-build install re-injects it. The CLI's `--schema-paths node_modules/@kickstartds/design-system/dist/components` then matches zero files, leaving the `schema` layer empty and every `cms.*` schema `$ref` dangling.

**Correction to the credentials audit below:** the Management API 401s were **my probe's fault**, not the token's. `storyblok-js-client` sends `Authorization: <token>` with no `Bearer` prefix; with the raw header the token returns 200. `storyblok login -t "$NEXT_STORYBLOK_OAUTH_TOKEN" -r eu` also works non-interactively. The stale `~/.netrc` session did need replacing (`storyblok logout` first — the CLI otherwise reports “already logged in”).

| Check (as of the audit) | Result |
| --- | --- |
| Preview token (`NEXT_STORYBLOK_API_TOKEN`) | **valid** — CDN API HTTP 200 |
| Space | `tsnm`, id `295207126131307`, EU/quickstart; fresh quickstart space with only the default `Home` story |
| `NEXT_STORYBLOK_OAUTH_TOKEN` | **valid** once sent as a raw `Authorization` header |
| DNS | `tsnm.de` + `www.tsnm.de` → `2.29.21.50` ✓; `usage.tsnm.de` + `design.tsnm.de` ✓ |
| server `2.29.21.50` | SSH (key `~/.ssh/id_hetzner`), Docker installed by `kamal server bootstrap` |

## Context

Fresh clone of a website accelerator: a pnpm monorepo whose working parts are `packages/website` (Next.js 13.5.6, pages router, React 19, Storyblok CMS + Visual Editor + AI Prompter) and `packages/design-system` (kickstartDS fork: 74+ components, tokens, Storybook). Around them sit three MCP servers, two editors, an n8n node and three Storyblok field plugins.

The goal is a personal website running on my own domain and my own server: English-only, with the demo/sales surface removed (Book-a-Demo CTA, German CMS labels, ruhmesmeile domains/images, c15t consent), authored in Storyblok, deployed with Kamal. Visual identity (colors, type, logo, imagery) is applied in Phase 9 once reference designs exist; Phases 1–8 deliver a clean, deployed, editable site on starter defaults.

## Decisions already made (do not re-litigate during execution)

1. **Hosting = Kamal on my own server.** `config/deploy-website.yml` + `packages/website/Dockerfile` are complete (container port 3030, healthcheck `/api/up`, Let's Encrypt, domains from env). `packages/website/netlify.toml` is a stale footgun — it would run the destructive Storyblok `init` on every build — so it gets deleted in Phase 2.
2. **Storyblok = brand-new space, full demo seed (`init`), then replace demo content.** `prepareProject.js` refuses to run unless the space still has the default `Home`/`home` story, so this must be a genuinely fresh space.
3. **English only, and no CMS overlay layers.** Both `cms/language/` (German field labels, stale for `footer`) and `cms/visibility/` (`x-cms-hidden` toggles) are removed, so the pushed CMS config comes from the design-system base schemas plus the website's own component overrides (`cms.mydesignsystem.com/*`) only. Consequence to be aware of: the visibility layer hid **58 fields** from editors (e.g. `section.backgroundImage`, `hero.height`/`overlay`/`textPosition`, `header.inverted`, `slider.components`, `logo.width`/`height`, `seo.cardImage`, `footer.inverted`); after removal those become editable in Storyblok. Its 159 `x-cms-hidden: false` entries were no-ops (the base schemas hide nothing). Restore at any time with `git checkout -- packages/website/cms/visibility` (and re-run `create-storyblok-config`).
4. **Kept extras:** Umami analytics, the Storyblok MCP server (local stdio), the design tokens editor (deployed).
5. **Dropped:** c15t cookie consent. Verified: `NEXT_PUBLIC_C15T_URL` is the only website-side reference and no website component renders `CookieConsent` (`grep -rln "CookieConsent\|cookie-consent" packages/website --include=*.tsx --include=*.ts` excluding `types/` returns nothing). The design-system component stays in the repo unused.
6. **The `@kickstartds/*` npm scope is NOT renamed.** The same scope is used by external published packages (`@kickstartds/core|base|blog|content|form|style-dictionary|jsonschema-utils|jsonschema2types|jsonschema2storyblok|cambria`) referenced by semver ranges, `pnpm-workspace.yaml` overrides and 3 files in `/patches`; a scope rename breaks all of that. Only the website package is renamed.
7. **`info-table` is kept.** It is a generic CMS blok wired into the Prompter preview map (`PrompterComponent.tsx:63,97`), `section.schema.json:29`, `SectionProps.ts:34` and `index.scss:1`; removing it is churn without benefit.
8. **`book-a-demo` is removed.** It is a sales CTA rendered unconditionally by the app shell (`_app.tsx:301`), not a CMS component, and has no place on a personal site.

## Values to supply before starting

Placeholders used verbatim in the steps below: `<PRIMARY_DOMAIN>` (apex host), `<SECONDARY_DOMAIN>` (`www.…`), `<SITE_NAME>` (manifest/app name), `<HOSTING_SERVER_IP>`, `<DOCKER_USERNAME>`, `<SITE_IMAGE>` (`<user>/<repo>`), `<ANALYTICS_DOMAIN>` (`usage.…`), `<ANALYTICS_IMAGE>`, `<TOKENS_EDITOR_DOMAIN>`, `<TOKENS_EDITOR_IMAGE>`, `<STORYBLOK_SPACE_ID>`, `<STORYBLOK_API_TOKEN>` (Preview), `<STORYBLOK_OAUTH_TOKEN>` (personal access token), `<OPENAI_API_KEY>`.

### A. `packages/website/.env` (committed — public values only)

| Key | Value | Consumed by |
| --- | --- | --- |
| `NEXT_PUBLIC_PRIMARY_PUBLIC_SITE_DOMAIN` | `<PRIMARY_DOMAIN>` | CSP + host redirect (`next.config.js`), Kamal proxy host |
| `NEXT_PUBLIC_SECONDARY_PUBLIC_SITE_DOMAIN` | `<SECONDARY_DOMAIN>` | www→apex 301, Kamal proxy host |
| `NEXT_PUBLIC_SITE_URL` | keep `https://${NEXT_PUBLIC_PRIMARY_PUBLIC_SITE_DOMAIN}` | canonical/hreflang, sitemap, `api/markdown` |
| `NEXT_PUBLIC_ANALYTICS_DOMAIN` | `<ANALYTICS_DOMAIN>` | Umami script src (baked at build) |
| `NEXT_PUBLIC_ANALYTICS_SITE_ID` | leave empty until Phase 6, then the Umami site UUID | Umami `data-website-id`; script is skipped while empty |
| `DOCKER_USERNAME` | `<DOCKER_USERNAME>` | Kamal `registry.username` |
| `DOCKER_SITE_IMAGE_NAME` | `<SITE_IMAGE>` | Kamal `image` |
| `DOCKER_BUILDKIT` | keep `1` | build |
| `HOSTING_SERVER_IP` | `<HOSTING_SERVER_IP>` | Kamal `servers`, Umami accessory host |

Delete the `NEXT_PUBLIC_C15T_URL` line — verified it is read only inside a commented-out rewrite block in `next.config.js:108`.

### B. `packages/website/.env.local` (create; gitignored; excluded from Docker images by the root `.dockerignore`)

| Key | Value | Needed for |
| --- | --- | --- |
| `NEXT_STORYBLOK_API_TOKEN` | `<STORYBLOK_API_TOKEN>` | every build/dev fetch, CMS scripts |
| `NEXT_STORYBLOK_OAUTH_TOKEN` | `<STORYBLOK_OAUTH_TOKEN>` | Management API: `init`, asset upload, pushes |
| `NEXT_STORYBLOK_SPACE_ID` | `<STORYBLOK_SPACE_ID>` (numeric, no `#`) | everything |
| `NEXT_OPENAI_API_KEY` | `<OPENAI_API_KEY>` | Prompter + MCP generation tools (optional otherwise) |
| `NEXT_PUBLIC_SITE_URL` | `https://localhost:3010` | local dev only (production takes it from `.env`) |
| `STORYBLOK_REGION` | optional; default `eu` | CLI login/push if your space is not EU |

Deploy-time secrets can live here too (they are gitignored and the local MCP wrapper sources this file): `KAMAL_REGISTRY_PASSWORD`, `POSTGRES_PASSWORD`. `AZURE_*` only if you adopt the SharePoint picker (not in scope).

### C. `packages/umami-analytics/.env` (committed)

| Key | Value |
| --- | --- |
| `DOCKER_ANALYTICS_IMAGE_NAME` | `<ANALYTICS_IMAGE>` |
| `HOSTING_SERVER_IP` | `<HOSTING_SERVER_IP>` |
| `NEXT_PUBLIC_ANALYTICS_DOMAIN` | `<ANALYTICS_DOMAIN>` (must match A) |
| `DOCKER_USERNAME` | `<DOCKER_USERNAME>` |

### D. `packages/design-tokens-editor/.env` (create from `.env.example`; gitignored)

| Key | Value | Notes |
| --- | --- | --- |
| `STORYBLOK_OAUTH_TOKEN` | `<STORYBLOK_OAUTH_TOKEN>` | required |
| `STORYBLOK_SPACE_ID` | `<STORYBLOK_SPACE_ID>` | required |
| `STORYBLOK_API_BASE` | uncomment only if the space is not in the default region | |
| `PORT` | optional, default `4200` | |
| `GOOGLE_FONTS_API_KEY` | optional, only `scripts/updateGoogleFonts.js` | |
| `DOCKER_USERNAME` | `<DOCKER_USERNAME>` | |
| `DOCKER_DESIGN_TOKENS_EDITOR_IMAGE_NAME` | `<TOKENS_EDITOR_IMAGE>` | |
| `DESIGN_TOKENS_EDITOR_PUBLIC_DOMAIN` | `<TOKENS_EDITOR_DOMAIN>` | |
| `HOSTING_SERVER_IP` | `<HOSTING_SERVER_IP>` | |
| `MCP_JWT_SECRET` | generated in Phase 8 via `scripts/issue-token.mjs --generate-secret` | uncomment; auth must be on for a public host |
| `MCP_REVOKED_TOKENS` | optional | |

### E. Not files — shell environment at deploy time

Kamal's ERB (`config/deploy-*.yml`) and `.kamal/secrets` read these from the environment; do not commit them:
`KAMAL_REGISTRY_PASSWORD` (Docker Hub access token), `NEXT_STORYBLOK_API_TOKEN`/`NEXT_STORYBLOK_OAUTH_TOKEN`/`NEXT_STORYBLOK_SPACE_ID`, `NEXT_OPENAI_API_KEY` (runtime secret for the container), `POSTGRES_PASSWORD`, `MCP_JWT_SECRET`. `DATABASE_URL`/`DATABASE_TYPE` are derived inside `.kamal/secrets` — no action.

### F. Non-env values

- `packages/website/public/favicon/site.webmanifest`: `name` + `short_name` → `<SITE_NAME>`; icons replaced with your own set (see 2f).
- Storyblok UI: Visual Editor preview URL `https://localhost:3010/api/preview/`.
- DNS: A records for `<PRIMARY_DOMAIN>`, `<SECONDARY_DOMAIN>`, `<ANALYTICS_DOMAIN>`, `<TOKENS_EDITOR_DOMAIN>` → `<HOSTING_SERVER_IP>`.

**Not needed for this plan:** `packages/storyblok-mcp/.env` (the local MCP entry in `.vscode/mcp.json` reads `packages/website/.env.local`), `packages/component-builder-mcp/.env`, `packages/design-tokens-mcp` (no env file), `packages/schema-layer-editor` (no env file), `.kamal/secrets` (already written).

## Phase 1 — Toolchain and clone hygiene

1. Node 24 (`nvm use` reads `.nvmrc`), pnpm 10.30.3 (`corepack enable && corepack prepare pnpm@10.30.3 --activate`), `git-lfs` installed (`git lfs install`), `mkcert` installed.
2. `pnpm install` from the repo root.
3. Verify LFS content materialised: `packages/website/types/components-schema.json` must be a real JSON file (`jq -r .space_id packages/website/types/components-schema.json` prints the old demo space id `289871530294721`). If it prints a pointer stub, run `git lfs pull`.

**Verification:** `pnpm --filter @kickstartds/design-system typecheck` may fail (pre-existing, see `docs/adr/adr-monorepo-integration.md` ADR-011) — that is expected and not a blocker. `pnpm install` must exit 0.

## Phase 2 — Repo identity, English-only, demo removal (no CMS access needed)

Do this **before** Phase 3: `create-storyblok-config` reads the changed component schemas, the root `--components` list and the `cms/` layers, so the very first push to the new space is already clean.

### 2a. Website package identity

1. `packages/website/package.json`: `"name"` → `"personal-site"`, add `"private": true` (the site is never published; it is already in the changesets ignore list).
2. `packages/website/Dockerfile:58`: change the build filter to `pnpm --filter personal-site run build`.
3. `.changeset/config.json:11`: replace the ignore entry with `"personal-site"`.
4. Delete `packages/website/netlify.toml`.
5. Root `package.json` scripts — repair the three broken filters so the documented aliases work:
   - `dev:web` → `pnpm --filter personal-site dev`
   - `dev:mcp` → `pnpm --filter @kickstartds/storyblok-mcp-server dev`
   - `layer-editor` → `pnpm --filter @kickstartds/schema-layer-editor dev --`
   (Leave `dev:design-system`, `dev:tokens-editor`, `dev:component-mcp`, `dev:tokens-mcp` unchanged — their filters are already correct.)

### 2b. Environment file

Replace `packages/website/.env` with exactly (keep the file committed — it holds only public values):

```
NEXT_PUBLIC_PRIMARY_PUBLIC_SITE_DOMAIN=<PRIMARY_DOMAIN>
NEXT_PUBLIC_SECONDARY_PUBLIC_SITE_DOMAIN=<SECONDARY_DOMAIN>
NEXT_PUBLIC_SITE_URL=https://${NEXT_PUBLIC_PRIMARY_PUBLIC_SITE_DOMAIN}
NEXT_PUBLIC_ANALYTICS_DOMAIN=<ANALYTICS_DOMAIN>
NEXT_PUBLIC_ANALYTICS_SITE_ID=
DOCKER_USERNAME=<DOCKER_USERNAME>
DOCKER_SITE_IMAGE_NAME=<SITE_IMAGE>
DOCKER_BUILDKIT=1
HOSTING_SERVER_IP=<HOSTING_SERVER_IP>
```

The `NEXT_PUBLIC_C15T_URL` line is deleted. `NEXT_PUBLIC_ANALYTICS_SITE_ID` stays empty until Phase 6; see 2f for the guard that keeps the empty value harmless.

### 2c. Guard the analytics script while the site id is empty

`packages/website/components/Meta.tsx` renders the Umami tag unconditionally (~lines 92–99), which would emit `https://<domain>/script.js` with an empty `data-website-id`. Wrap exactly that `<script defer src={`https://${process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN}/script.js`} …>` element in `{process.env.NEXT_PUBLIC_ANALYTICS_SITE_ID && ( … )}`. Leave the `/_/client.js` script and the `<style>` below it untouched.

### 2d. English only, no CMS overlay layers

1. Delete the directories `packages/website/cms/language/` (38 files: German CMS field titles/descriptions) and `packages/website/cms/visibility/` (38 files: `x-cms-hidden` toggles that hid 58 fields from editors). Both are *overlay layers* consumed by the `kickstartDS cms storyblok`/`schema` layer machinery; the website's own component overrides live in `packages/website/components/**` and stay.
2. `packages/website/components/ComponentProviders.tsx:447`: `const SUPPORTED_LANGS = ["en", "de"] as const;` → `["en"] as const`.
3. `packages/website/pages/_app.tsx:163`: `const SUPPORTED_LANGS = ["en", "de"];` → `["en"];`.
4. In `ComponentProviders.tsx`, wrap the language-switcher element around line 483 in a length guard so a single-language site shows no switcher:

```tsx
{SUPPORTED_LANGS.length > 1 && (
  <div className="dsa-language-switcher">
    …
  </div>
)}
```

Leave `getAltPath` and the `hrefLang` output in `Meta.tsx` as they are — with no alternates, only the `en` alternate is emitted, which is valid. Verified after removal: the generated `cms/components.123456.json` contains no German strings and no `x-cms-hidden` markers.

### 2e. Remove the Book-a-Demo CTA

1. `packages/website/pages/_app.tsx`: delete the import at line 36 (`import { BookADemo } from "@/components/book-a-demo/BookADemoComponent";`), delete `const hideBookDemoButton = storyProps?.hideBookDemoButton || false;` (line 154), and delete the `<BookADemo … />` element (lines ~301–310, whose `enabled` prop references `hideBookDemoButton`). Read `_app.tsx:295-315` first to confirm the element bounds.
2. `packages/website/index.scss:6`: delete `@use "./components/book-a-demo/book-a-demo.scss";`.
3. Delete the directory `packages/website/components/book-a-demo/` (3 files: `BookADemoComponent.tsx`, `book-a-demo.scss`, `book-a-demo-tokens.scss`).
4. `packages/website/components/settings/settings.schema.json`: delete the `bookDemoButton` property object (starts at line 43).
5. `packages/website/components/page/page.schema.json`: delete the `hideBookDemoButton` property object (line 17).
6. Regenerate the committed prop types so `HideBookADemoButton`/`hideBookDemoButton` disappear from `packages/website/components/page/PageProps.ts`:
   `pnpm --filter personal-site generate-props`
   Expect a diff limited to the removed prop in `PageProps.ts` (plus `settings` props).
7. Verify no stragglers: `grep -rn "bookDemoButton\|hideBookDemoButton\|BookADemo\|book-a-demo" packages/website/pages packages/website/components packages/website/index.scss` must return nothing.

### 2f. Identity assets and crawlability

1. Replace the favicon set in `packages/website/public/favicon/` with icons generated from my own source image (keep the same filenames so nothing else changes): `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`, `android-chrome-192x192.png`, `android-chrome-512x512.png`, `mstile-70x70.png`, `mstile-144x144.png`, `mstile-150x150.png`, `mstile-310x150.png`, `mstile-310x310.png`, `safari-pinned-tab.svg`.
2. `packages/website/public/favicon/site.webmanifest`: set `"name"` and `"short_name"` to `<SITE_NAME>`, and fix the two icon `src` values from `/android-chrome-*.png` to `/favicon/android-chrome-*.png` (they currently point at the wrong path).
3. `packages/website/components/Meta.tsx`: next to the existing `<link rel="shortcut icon" href="/favicon/favicon.ico" />` (line ~44) add `<link rel="manifest" href="/favicon/site.webmanifest" />`.
4. `packages/website/next-sitemap.config.js`: replace `transformRobotsTxt` (currently `User-agent: *\nDisallow: /`, i.e. the whole site is blocked from crawlers) with:

```js
    transformRobotsTxt: async (_, config) =>
      `User-agent: *
Allow: /

Sitemap: ${config.siteUrl}/sitemap.xml
Sitemap: ${config.siteUrl}/server-sitemap.xml`,
```

### 2g. Keep generated CMS config out of git

`packages/website/cms/components.123456.json` and `cms/presets.123456.json` are produced by `create-storyblok-config` and are currently still listed in `.gitattributes` with the LFS filter. Add both paths to `.gitignore` (after the existing `packages/website/cms/merge-report.json` line) and delete those two lines from `.gitattributes`, so a later `git add -A` cannot commit multi-megabyte generated JSON.

**Verification for Phase 2:** `pnpm --filter personal-site lint` exits 0 with no warnings; `grep -rn "ruhmesmeile\|BookADemo\|c15t" packages/website/.env packages/website/pages packages/website/components packages/website/next-sitemap.config.js --include=*.ts --include=*.tsx --include=*.env --include=*.js` returns nothing; `grep -rn "bookDemoButton\|hideBookDemoButton" packages/website/components packages/website/pages` returns nothing after the props regeneration.

## Phase 3 — Storyblok space: seed, settings story, first render

Prerequisite: the interface changes in Phase 4 need Storyblok **Management API** access with the region the space lives in (`STORYBLOK_REGION`, default `eu`).

1. Create an empty Storyblok space. Note the Preview API token, a personal access token, and the numeric space id.
2. Create `packages/website/.env.local` from `.env.local.sample` and fill:
   `NEXT_STORYBLOK_API_TOKEN`, `NEXT_STORYBLOK_OAUTH_TOKEN`, `NEXT_STORYBLOK_SPACE_ID=<STORYBLOK_SPACE_ID>`, `NEXT_OPENAI_API_KEY=<OPENAI_API_KEY>`, `NEXT_PUBLIC_SITE_URL=https://localhost:3010`.
3. Authenticate the Storyblok CLI once: `pnpm --filter personal-site storyblok-login` (enter the personal access token, pick the space region). `pnpm --filter personal-site netrc` writes `~/.netrc` as an alternative.
4. Build the design system — required before CMS config generation (the CLI reads `node_modules/@kickstartds/design-system/dist/components`) and before the website build (fonts + tokens):
   `pnpm --filter @kickstartds/design-system build`
5. **Re-run `pnpm install` now.** With `injectWorkspacePackages: true`, pnpm snapshots each workspace package into the store at install time, so the freshly built `packages/design-system/dist/` is invisible to `packages/website` until an install re-injects it. Skipping this makes the next step fail with `Couldn't find a reffed json in json allOf graph generation` (the `schema` layer loads zero files and every `cms.*` schema `$ref` dangles). Verify: `ls packages/website/node_modules/@kickstartds/design-system/dist/components/section/section.schema.json` must exist.
6. Generate the CMS config from the (now layer-free) schemas:
   `pnpm --filter personal-site create-storyblok-config`
   Expect new files `packages/website/cms/components.123456.json` (~330 KB) and `cms/presets.123456.json` (~200 KB), both gitignored per 2g. Sanity-check the removal worked: `grep -c -iE "Einwilligung|Datenschutz" packages/website/cms/components.123456.json` → `0`, and `grep -c x-cms-hidden packages/website/cms/components.123456.json` → `0`.
   Also run `pnpm --filter personal-site generate-props` once (it rewrites the committed `*Props.ts` files from the same schemas).
7. Seed the space (destructive by design, fresh space only):
   `pnpm --filter personal-site init`
   This runs `prepareProject.js` → deletes the default `Home` story and the default `feature`/`grid`/`teaser` components, replaces the default `page` component, recreates the asset folders `Component Screenshots` and `Demo Content`, uploads preset screenshots and demo images, creates the story “Getting Started” at slug `home` (published), writes `cms/merged/components/<SPACE_ID>/`, then pushes components and regenerates `packages/website/types/components-schema.{json,d.ts}`.
8. **Manual CMS step (required for chrome and SEO):** create a `settings` story. In Storyblok → Content, add a story of content type *Settings* (slug `settings`, at the space root or under `en/`), fill:
   - `header`: logo asset + alt, `navItems` (top-level navigation), optional inverted styles;
   - `footer`: logo, `navGroups`, `copyright`, `legalLink`, `socialLinks`;
   - `seo`: title (site-wide suffix), description, keywords, image;
   then **publish** it. Rationale: `fetchPageProps()` takes `settingsData.stories[0]` from `content_type=settings` with `version=published` (`helpers/storyblok.ts:244-253,361-371`); the build is a published-content build, so an unpublished or missing settings story yields no header/footer and SEO titles fall back to story names. Exactly one settings story should exist — delete any others.
9. Generate local SSL certs for the Visual Editor iframe: in `packages/website`, `mkcert -key-file localhost-key.pem -cert-file localhost.pem localhost` (the `dev:proxy` script expects exactly these two filenames).
10. Start the site: `pnpm --filter personal-site dev` → Next on :3000, SSL proxy on :3010. Open `https://localhost:3010`.
11. Set the Storyblok Visual Editor preview URL to `https://localhost:3010/api/preview/`.

**Verification for Phase 3:**
- `https://localhost:3010` renders the seeded “Getting Started” page with header, footer and the theme’s fonts.
- `curl -s http://localhost:3000/api/up` returns `Ok`.
- `jq -r .space_id packages/website/types/components-schema.json` prints `<STORYBLOK_SPACE_ID>` (not the demo space id).
- Storyblok → Components shows the starter component set with English labels only, and the field set no longer omits the 58 fields the visibility layer used to hide.

## Phase 4 — Your content

1. In Storyblok, edit the `home` story (currently the seeded “Getting Started” demo page): remove the demo sections and compose real content. Keep the slug `home` — `helpers/storyblok.ts:404` defines `INDEX_SLUG = "home"` and `[[...slug]].tsx` resolves the homepage through it.
2. Delete the demo images from the asset folder `Demo Content` once nothing references them; keep the folder `Component Screenshots` (preset previews rendered in the Visual Editor).
3. Add real pages as stories under the space root (English-only: no `en/` prefix needed; the header `navItems` links drive navigation). Every page must be **published**, otherwise it will not appear in a production build.
4. Search index: nothing to configure — Pagefind runs in `postbuild` over the built HTML.

**Verification for Phase 4:** every page you intend to publish is reachable at `https://localhost:3010/<slug>` after a `pnpm --filter personal-site dev` restart, and `git status` shows `packages/website/types/components-schema.*` modified (they mirror the live space).

## Phase 5 — Deploy to the server

1. DNS: point `<PRIMARY_DOMAIN>` and `<SECONDARY_DOMAIN>` (A records) at `<HOSTING_SERVER_IP>` and wait for propagation. `next.config.js` 301-redirects the secondary host to the primary, and Kamal's Let's Encrypt setup needs both names resolvable on ports 80/443.
2. Registry: create the repository `<SITE_IMAGE>` and a Docker Hub access token.
3. Export the deploy environment in the shell (Kamal's ERB reads `ENV[…]`, and `.kamal/secrets` reads `$VAR` from the environment):

```bash
cd /path/to/repo
set -a
. packages/website/.env.local      # NEXT_STORYBLOK_*, NEXT_OPENAI_API_KEY
. packages/website/.env            # domains, DOCKER_*, HOSTING_SERVER_IP
set +a
export KAMAL_REGISTRY_PASSWORD='<docker-hub-access-token>'
```

4. First-time server setup, then deploy:

```bash
kamal setup -c config/deploy-website.yml     # installs Docker, boots, obtains certificates
kamal deploy -c config/deploy-website.yml
```

5. Follow the health check: `config/deploy-website.yml` polls `GET /api/up` (expects `Ok`) on container port 3030.

**Verification for Phase 5:**
- `curl -sI https://<PRIMARY_DOMAIN>/api/up` → HTTP 200 with body `Ok`.
- `curl -sI https://<SECONDARY_DOMAIN>/` → 301 to `https://<PRIMARY_DOMAIN>/`.
- `curl -s https://<PRIMARY_DOMAIN>/robots.txt` shows `Allow: /` and both `Sitemap:` lines; `curl -s https://<PRIMARY_DOMAIN>/sitemap.xml` lists the real pages.
- `curl -s https://<PRIMARY_DOMAIN>/ | grep -o '<title>[^<]*'` shows the page title plus the global SEO suffix from the settings story.
- No `ruhmesmeile` string in the served HTML: `curl -s https://<PRIMARY_DOMAIN>/ | grep -c ruhmesmeile` → `0`.

## Phase 6 — Umami analytics

The website's analytics script is build-time baked from `NEXT_PUBLIC_ANALYTICS_*`, which is why Phase 2c guarded it and the site currently ships without analytics.

1. Fill `packages/umami-analytics/.env`:
   `DOCKER_ANALYTICS_IMAGE_NAME=<ANALYTICS_IMAGE>`, `HOSTING_SERVER_IP=<HOSTING_SERVER_IP>`, `NEXT_PUBLIC_ANALYTICS_DOMAIN=<ANALYTICS_DOMAIN>`, `DOCKER_USERNAME=<DOCKER_USERNAME>`.
2. DNS: A record for `<ANALYTICS_DOMAIN>` → `<HOSTING_SERVER_IP>`.
3. Export and deploy (the config attaches a `postgres:15` accessory):

```bash
set -a && . packages/umami-analytics/.env && set +a
export KAMAL_REGISTRY_PASSWORD='<docker-hub-access-token>'
export POSTGRES_PASSWORD='<choose-a-strong-password>'
kamal setup -c config/deploy-umami-analytics.yml
kamal deploy -c config/deploy-umami-analytics.yml
```

4. In the Umami UI at `https://<ANALYTICS_DOMAIN>`, log in with the upstream image's first-run default credentials (`admin` / `umami`) and change the password immediately, then add a website with domain `<PRIMARY_DOMAIN>` and copy its site id.
5. Put that id into `packages/website/.env`: `NEXT_PUBLIC_ANALYTICS_SITE_ID=<uuid>`, then redeploy the website: `kamal deploy -c config/deploy-website.yml`.

**Verification for Phase 6:** `curl -s https://<PRIMARY_DOMAIN>/ | grep -c '<ANALYTICS_DOMAIN>/script.js'` → `1`; the Umami Realtime view shows your own visit after loading the site.

## Phase 7 — Storyblok MCP server (local, stdio)

1. Build it (build order matters: `shared-auth` and `storyblok-services` first, then `pnpm install` to re-inject their `dist`, then the MCP server — `sync-schemas` also resolves schemas from the design-system dist):
   `pnpm --filter @kickstartds/shared-auth build && pnpm --filter @kickstartds/storyblok-services build && pnpm install && pnpm --filter @kickstartds/storyblok-mcp-server build`
2. `.vscode/mcp.json` now starts that build and pulls credentials from `packages/website/.env.local` at launch (no secrets in the file, nothing to fill in beyond `.env.local`):

```json
{
  "servers": {
    "personal-site-storyblok": {
      "command": "bash",
      "args": [
        "-c",
        "cd /absolute/path/to/repo/packages/website && [ -f ./.env.local ] && { set -a; . ./.env.local; set +a; }; STORYBLOK_API_TOKEN=\"$NEXT_STORYBLOK_API_TOKEN\" STORYBLOK_OAUTH_TOKEN=\"$NEXT_STORYBLOK_OAUTH_TOKEN\" STORYBLOK_SPACE_ID=\"$NEXT_STORYBLOK_SPACE_ID\" OPENAI_API_KEY=\"$NEXT_OPENAI_API_KEY\" exec /usr/bin/node ../storyblok-mcp/dist/index.js"
      ]
    }
  },
  "inputs": []
}
```

Node is referenced as `/usr/bin/node` (v25.7.0) so the server starts regardless of the PATH VS Code inherits; swap it for the nvs/nvm path if you prefer the repo's Node 24. `dev` is `tsc --watch` only — the server itself runs from `dist/index.js`.

**Verification for Phase 7:** with the MCP server connected in VS Code, `list_stories` returns the stories of `<STORYBLOK_SPACE_ID>` (and no demo space), and `content_audit` runs without an OpenAI error once `<OPENAI_API_KEY>` is set.

## Phase 8 — Design tokens editor (deployed)

1. `packages/design-tokens-editor/.env` (copy from `.env.example`): `STORYBLOK_OAUTH_TOKEN=<STORYBLOK_OAUTH_TOKEN>`, `STORYBLOK_SPACE_ID=<STORYBLOK_SPACE_ID>`, `DOCKER_USERNAME=<DOCKER_USERNAME>`, `DOCKER_DESIGN_TOKENS_EDITOR_IMAGE_NAME=<TOKENS_EDITOR_IMAGE>`, `DESIGN_TOKENS_EDITOR_PUBLIC_DOMAIN=<TOKENS_EDITOR_DOMAIN>`, `HOSTING_SERVER_IP=<HOSTING_SERVER_IP>`; leave `STORYBLOK_API_BASE` commented unless the space is not in `eu`.
2. Create a JWT secret and one admin token (auth is optional: unset secret disables it, which must not happen on a public host):

```bash
node scripts/issue-token.mjs --generate-secret          # prints MCP_JWT_SECRET
MCP_JWT_SECRET='<printed-secret>' node scripts/issue-token.mjs --user <your-name> --role admin --expires 365d
```

Store the printed secret (needed at deploy time and for the token-paste login) — it is not written to disk anywhere.
3. DNS: A record for `<TOKENS_EDITOR_DOMAIN>` → `<HOSTING_SERVER_IP>`.
4. Export and deploy:

```bash
set -a && . packages/design-tokens-editor/.env && set +a
export KAMAL_REGISTRY_PASSWORD='<docker-hub-access-token>'
export MCP_JWT_SECRET='<printed-secret>'
kamal setup -c config/deploy-design-tokens-editor.yml
kamal deploy -c config/deploy-design-tokens-editor.yml
```

The Dockerfile builds the whole design system inside the image, so expect a multi-minute first build.

**Verification for Phase 8:** `https://<TOKENS_EDITOR_DOMAIN>/api/health` returns healthy; the UI shows the token-paste login; the pasted token from step 2 grants access and `/api/tokens/*` returns 401 without it.

## Phase 9 — Apply the look & feel (run when the reference designs are available)

Two routes; both end with the same visible result. Pick per ambition:

**A. CMS-only theme (no code, recommended first pass).** Use the tokens editor from Phase 8 (or Storyblok) to create a `token-theme` story under the folder `settings/themes/<name>` with the desired values, then select it in the `settings` story's `theme` field (rendered by the `storyblok-theme-select-field-plugin`) and publish. `fetchPageProps` resolves the slug to that story's `css` and `_app.tsx` injects it as `<style data-tokens>`. A page can override the global theme via its own `theme` field.

**B. Code-level default theme (changes the shipped default).**
1. Edit `packages/design-system/src/token/branding-tokens.json` — the schema (`branding-tokens.schema.json`) requires `color` (9 pairs: `primary,onPrimary,bg,fg,link,positive,negative,informative,notice` plus `scale.1..9`), `font` (family/weight/size), `spacing`, `border`, `box-shadow`, `duration`, and forbids extra properties. Colors are `{colorSpace:"srgb",components:[r,g,b]}` with 0–1 floats.
2. `pnpm --filter @kickstartds/design-system branding-tokens` (Ajv-validates and writes the sibling CSS), then `pnpm --filter @kickstartds/design-system build`.
3. `pnpm --filter personal-site build` — this runs `sync-default-theme`, which upserts and **publishes** the `settings/themes/default` story with `system: true`. Note the guard: the story is system-managed, so later CMS-side edits to `default` are rejected; make further changes by re-running the sync or by creating a separate theme story (route A).
4. `kamal deploy -c config/deploy-website.yml`.

**If the reference uses another typeface:** replace the woff2 files in `packages/design-system/static/fonts/` (`Montserrat-{Light,Regular,Medium,SemiBold,Bold}.woff2`), update the six `localFont({…})` declarations in `packages/website/helpers/fonts.ts` (`displayFont`, `copyFont`, `interfaceFont` + the three `…Preview` variants; `src` entries are `{path, weight, style}` with paths relative to `helpers/`), set `localFontFamilyName` to the new family name, and set `font.family.{display,copy,interface,mono}` in `branding-tokens.json` to match. Fonts are shipped as files — there are no runtime webfont fetches.

## End-to-end verification

Run after Phase 5 (or after any later redeploy):

1. `curl -sI https://<PRIMARY_DOMAIN>/api/up` → `200`, body `Ok`.
2. `curl -s https://<PRIMARY_DOMAIN>/robots.txt` → `Allow: /` + two `Sitemap:` entries.
3. `curl -s https://<PRIMARY_DOMAIN>/ | grep -c ruhmesmeile` → `0`.
4. Load the site in a browser: header/footer from the settings story, fonts render, no console errors, no Book-a-Demo button, no language switcher, no cookie-consent dialog.
5. Edit a story in the Storyblok Visual Editor against `https://localhost:3010/api/preview/` and confirm live preview + the Prompter (needs `NEXT_OPENAI_API_KEY`).
6. `/mcp`-less local check for the MCP: `list_stories` returns exactly the stories you created.
7. `git status` — regenerated artifacts (`packages/website/types/components-schema.{json,d.ts}`, `components-presets.json`) show as modified; `cms/components.123456.json` does **not** appear (ignored per 2g).

## Assumptions & contingencies

- **Storyblok seeding assumes a genuinely empty space.** If the space was already touched, `prepareProject.js` exits with “Project already prepared” — create a new space or run only `create-storyblok-config` + `push-components` (schema-only seed) and author the `home` story manually.
- **One settings story only.** `fetchPageProps` takes `stories[0]` from the settings content type; multiple settings stories make the picked one arbitrary. Delete extras.
- **`cms/language` deletion is verified in Phase 3 step 5**, with the restore fallback described in 2d. Deleting it only changes generated German CMS labels.
- **The `en/` prefix is optional.** The site tolerates root-level stories (`language ?? "en"` in `_app.tsx:215`). If you later want a real bilingual setup, restore `cms/language` and re-add `"de"` to `SUPPORTED_LANGS`; nothing else in this plan depends on English-only.
- **Analytics is baked at build time.** Changing `NEXT_PUBLIC_ANALYTICS_SITE_ID` (or any `NEXT_PUBLIC_*` value) requires a website rebuild + redeploy, not just a restart.
- **Deployment values are read at deploy time** by Kamal's ERB from the shell environment; if `HOSTING_SERVER_IP`, `DOCKER_SITE_IMAGE_NAME` or the domain vars are missing, `kamal deploy` fails with an undefined-value error rather than a partial deploy.
- **The design tokens editor shares story storage with the site.** Themes it creates live under `settings/themes/`; deleting a story that a page's `theme` field references leaves that page on the default theme (the lookup swallows the error).
- **`pnpm -r run test` / `pnpm -r run lint` are red in this repo** (placeholder test scripts in two MCP packages, a stale prompt-count assertion in `packages/storyblok-mcp/test/prompts.test.ts`, no ESLint setup for `storyblok-n8n`, CI pinned to Node 20). Use the per-package commands in this plan for verification; do not treat repo-wide CI as a gate. Details in `AGENTS.md` → “Known defects”.
