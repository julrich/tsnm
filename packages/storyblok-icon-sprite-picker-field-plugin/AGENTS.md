# AGENTS.md — packages/storyblok-icon-sprite-picker-field-plugin

`@kickstartds/storyblok-icon-sprite-picker-field-plugin` (**private**). Storyblok field plugin to pick an icon id from the site's icon sprite.

- `src/hooks/useStoryblok.ts` — loads the `icon-sprite` story via the Storyblok Delivery API and parses available icon ids from the SVG sprite symbols.
- `src/components/` — picker UI; `src/main.tsx` — bootstrap; `style.css`.
- Stores the **icon id string** via `plugin.actions.setContent`. Icon ids must match the design-system icon sprite; list valid ids with the MCP `list_icons` tool.

```bash
pnpm --filter @kickstartds/storyblok-icon-sprite-picker-field-plugin dev      # Vite :8080
pnpm --filter @kickstartds/storyblok-icon-sprite-picker-field-plugin build    # tsc && vite build → dist/index.js (commonjs)
pnpm --filter @kickstartds/storyblok-icon-sprite-picker-field-plugin deploy   # npx @storyblok/field-plugin-cli@latest deploy
```

Conventions: `dist/index.js` is committed and loaded by Storyblok — rebuild and commit it after changes. Needs `STORYBLOK_API_TOKEN`/space config in `.env.local` for local development (see the package `.env.local.example`).
