# AGENTS.md — packages/storyblok-theme-select-field-plugin

`@kickstartds/storyblok-theme-select-field-plugin` (**private**). Storyblok field plugin that lets editors pick a `token-theme` story as a component's theme.

- `src/ThemeSelect.tsx` — fetches published `token-theme` stories (Storyblok Delivery API) and stores the **theme slug string** via `plugin.actions.setContent`.
- `src/main.tsx` — plugin bootstrap; `src/App.tsx` — field shell.
- Wired into the CMS by the `format: theme` mapping in the `@kickstartds/jsonschema2storyblok` patch (`/patches`).

```bash
pnpm --filter @kickstartds/storyblok-theme-select-field-plugin dev      # Vite :8080
pnpm --filter @kickstartds/storyblok-theme-select-field-plugin build    # tsc && vite build → dist/index.js (commonjs)
pnpm --filter @kickstartds/storyblok-theme-select-field-plugin deploy   # npx @storyblok/field-plugin-cli@latest deploy
```

Conventions: `dist/index.js` is committed (CommonJS, CSS injected by JS) and is what Storyblok loads — rebuild and commit it after changes. Store only the slug; resolve theme CSS at render time in the website, never persist CSS in the field.
