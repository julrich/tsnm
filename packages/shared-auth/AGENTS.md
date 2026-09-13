# AGENTS.md — packages/shared-auth

`@kickstartds/shared-auth` (**private**, consumed via `workspace:*`). Single source of JWT verification and OAuth 2.1 support for all hosted services. Built first in every dependent Dockerfile.

## Public API (`src/index.ts`)

`verifyToken`, `extractBearerToken`, `isAuthEnabled`, `isRevoked`, `createOAuthMiddleware`, `wwwAuthenticateHeader`, plus types `AuthUser`, `AuthenticatedRequest`, `OAuthMiddlewareConfig`.

- `verify.ts` — HS256 verification against `MCP_JWT_SECRET`; `isAuthEnabled()` is false when the secret is unset.
- `revocation.ts` — `isRevoked()` reads `MCP_REVOKED_TOKENS` (comma-separated, entries `jti:<id>` or `sub:<user>`).
- `oauth.ts` — OAuth 2.1 authorization-code + PKCE layer for clients like claude.ai: `/.well-known/oauth-protected-resource` (RFC 9728), `/.well-known/oauth-authorization-server-metadata` (RFC 8414), `/authorize` (token-paste form), `/token` (returns the originally issued JWT as `access_token`), `/register` (RFC 7591). With no secret configured, `/authorize` auto-approves.

Consumers: `storyblok-mcp`, `design-tokens-mcp`, `component-builder-mcp`, `design-tokens-editor`.

## Commands

```bash
pnpm --filter @kickstartds/shared-auth build       # tsc
pnpm --filter @kickstartds/shared-auth typecheck
```

Token issuing lives at the repo root: `node scripts/issue-token.mjs --user alice --role admin --expires 90d` (add `--generate-secret` once). See `docs/guides/authentication.md` and `docs/adr/adr-jwt-auth.md`.

## Invariants

- **Graceful degradation is the contract**: unset `MCP_JWT_SECRET` means every guard passes through. Never make auth mandatory in this library.
- **One secret, one revocation list** shared by all services. Do not add per-service secrets, algorithms, or claim formats.
- The `access_token` returned by the OAuth `/token` endpoint *is* the pre-issued JWT, so downstream guards need no OAuth awareness.

## Gotchas

- Changing verification or revocation semantics affects four services simultaneously; re-run their tests (`storyblok-mcp`, `design-tokens-mcp` have MCP-level auth tests).
- The 401 contract consumers rely on: JSON-RPC error `{ code: -32001, message: "Unauthorized" }` plus a `WWW-Authenticate` header pointing at the resource metadata.
