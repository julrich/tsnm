# AGENTS.md — packages/storyblok-sharepoint-folder-picker-field-plugin

`@kickstartds/storyblok-sharepoint-folder-picker-field-plugin` (**private**). Storyblok field plugin to browse and pick a SharePoint folder via Microsoft Graph.

- `src/SharePointFolderPicker.tsx` — folder browser; persists a JSON string `{ driveId, folderId, ... }` via `plugin.actions.setContent`.
- Plugin options: `proxyUrl` (default `/api/sharepoint/token`), `siteHostname`, `sitePath`, `driveId`.
- The Graph access token is **never** held client-side long-term: the plugin calls the website proxy `pages/api/sharepoint/token.ts`, which performs the Azure client-credentials (`Sites.Selected`) exchange using `AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET` and validates the caller with `NEXT_STORYBLOK_API_TOKEN`. Site-side resolution lives in `packages/website/helpers/sharepoint.ts`.

```bash
pnpm --filter @kickstartds/storyblok-sharepoint-folder-picker-field-plugin dev      # Vite :8080
pnpm --filter @kickstartds/storyblok-sharepoint-folder-picker-field-plugin build    # tsc && vite build → dist/index.js (commonjs)
pnpm --filter @kickstartds/storyblok-sharepoint-folder-picker-field-plugin deploy   # npx @storyblok/field-plugin-cli@latest deploy
```

Conventions: store the JSON envelope (drive + folder ids), not a URL; keep token acquisition server-side. Requires an Azure app registration with `Sites.Selected` plus the three env vars above before it works end-to-end (see `docs/adr/adr-sharepoint-folder-picker.md`). `dist/index.js` is committed — rebuild and commit after changes.
