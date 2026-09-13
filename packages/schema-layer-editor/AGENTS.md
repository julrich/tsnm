# AGENTS.md — packages/schema-layer-editor

`@kickstartds/schema-layer-editor` (**private**). Vite SPA + Express server that edits CMS **schema layers** — per-component JSON Schema overlays that control field visibility/behavior in Storyblok. Credential-free: it reads and writes local files.

Stack: React 19, Vite 5, Express 4, Vitest 1, Node ≥ 20.

## How it works

- CLI entry `src/cli.ts` (commander):
  `--schemas <path>` (required, dir of `*.schema.dereffed.json`), `--namespace <name>` (required, becomes the `$id` namespace), `--layer <path>`, `--schemas-extra <paths…>` (shadow base schemas by name), `--base-url <url>`, `--output <path>`, `--port <number>` (default 4201).
- Server routes (`src/server/routes.ts`): `GET /api/schemas`, `GET/POST /api/layer`, `POST /api/save`, `GET /api/config`.
- Output: one `<component>.schema.json` per component containing **only the overridden fields**, `$id` = `http://<namespace>.mydesignsystem.com/<name>.schema.json`; field order is normalized on save and stale files are deleted.
- Layer namespaces in use: `visibility` and `language`, consumed by the website from `packages/website/cms/<namespace>/`.

## Commands

```bash
pnpm --filter @kickstartds/schema-layer-editor dev     # Vite :4200 + tsx watch src/cli.ts (:4201)
pnpm --filter @kickstartds/schema-layer-editor test    # vitest run (schema tree, content-type classification)
pnpm --filter @kickstartds/schema-layer-editor build   # vite build && tsc -p tsconfig.server.json
pnpm layer-editor visibility                           # root alias — CURRENTLY BROKEN (bare pnpm filter); use the full command below
pnpm --filter @kickstartds/schema-layer-editor dev -- --schemas packages/website/node_modules/@kickstartds/design-system/dist/components --schemas-extra packages/website/components --namespace visibility --layer packages/website/cms/visibility
```

## Conventions

- Overrides are **sparse**: never write a full schema copy; only fields the layer actually changes.
- Layer files are one-per-component-name; the content-type allowlist lives in `docs/adr/adr-schema-layer-editor.md` (currently 7 types) — extending it means updating that ADR.
- Cascade order matters: base schemas come from the design-system `dist/components`, `--schemas-extra` shadows them by name (website-local components).
- `dist/` (SPA + server) is generated.

## Gotchas

- The root `layer-editor` alias and the Docker entrypoint hardcode `--namespace visibility --output ./output --port 8080`; `SCHEMA_LAYER_NAMESPACE`/`SCHEMA_LAYER_PORT` from the Kamal env are **not** read by `cli.ts`.
- Deployed unauthenticated (`config/deploy-schema-layer-editor.yml`, health `/api/schemas`) while the other editors sit behind JWT — do not assume auth middleware exists here.
- Port 4200 collides with the design-tokens-editor Vite server; the API port is 4201.
- The Dockerfile pre-bakes dereferenced design-system schemas as `./schemas`, so the image does not need a fresh build of the design system at runtime.
