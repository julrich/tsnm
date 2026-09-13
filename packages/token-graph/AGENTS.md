# AGENTS.md — packages/token-graph

`@kickstartds/token-graph` v0.1.0 (**private**). Token-dependency graph visualization built on sigma + graphology, consumed by the design system (build-time extraction) and the design-tokens editor (rendering).

## Public API (`src/index.ts`)

- `CosmosGraph` (default export of `src/TokenGraph.tsx`) — React component rendering the graph.
- Types/config: `GraphologyNodeType`, `GraphologyEdgeType`, `CosmosConfig`, `CosmosGraphProps`, `DEFAULT_CONFIG`, `resolveConfig`.
- Bridge (also `@kickstartds/token-graph/bridge`): `buildGraphFromCssProperties`, `CssExtractionInput`, `CssPropertyValue`.
- Helpers: `getDesignSystemSubGraph`, `getComponentName`, `rgbaToString`, `hexRgbToRgba`.

## Commands

```bash
pnpm --filter @kickstartds/token-graph extract      # node scripts/extractTokenGraph.mjs <dsRoot> <out>
pnpm --filter @kickstartds/token-graph typecheck
```

The design-system build invokes `extractTokenGraph.mjs` (`pnpm run token-graph`) to produce `src/token/token-graph.json`, copies it to `dist/tokens/token-graph.json`, and the design-tokens editor renders it via `GraphView.tsx`.

## Invariants

- `package.json` `exports` point at **TypeScript sources** (`./src/index.ts`, `./bridge`), so only bundler-based consumers (Vite/Rollup) can import this package — there is no build step and no `dist/`.
- The graph is built at design-system build time and shipped as prebuilt JSON. Never build the graph at runtime.
- graphology is the only graph dependency here; do not reintroduce `directed-graph-typed` or MUI (see `docs/adr/adr-cosmos-token-graph.md`).
- Peer deps are React 18/19 — keep the component free of app-specific context.

## Gotchas

- Changing the emitted JSON shape breaks the token editor's graph view and the design-system build's copy step; update `extractTokenGraph.mjs` and `src/types.ts` together.
- `react`/`react-dom` are peers, not dependencies: the consuming app provides them.
