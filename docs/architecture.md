# Architecture

The official Memos website is **one Next.js 16 (App Router) application** deployed
to **Cloudflare Workers via OpenNext**. It serves two surfaces from the same
codebase:

- a **static marketing/docs** surface (Fumadocs + MDX), and
- an **authenticated product** surface (a Clerk-gated dashboard and `/api` handlers).

This document is the source of truth for how the code is organized and how to
expand the authenticated surface. Keep it in sync when conventions change.

## Product direction

The product is a **companion / control-plane** for self-hosted Memos: users connect
their own instance (token-based `/api/v1`) and the app adds analytics and, later,
value-add features (cross-instance search, backups, AI, teams). It is **not** a
hosted multi-tenant Memos. See
`docs/superpowers/specs/2026-06-14-architecture-expansion-readiness-design.md` for
the research basis behind this direction and the conventions below.

## Route groups (`src/app`)

| Group | Purpose | Rendering |
| --- | --- | --- |
| `(public)` | Marketing + docs + blog + changelog | Static |
| `(tools)` | Standalone client tools (the scratchpad) | Client, browser-local |
| `(auth)` | Sign-in / sign-up boundaries | — |
| `(app)` | Authenticated product surface (dashboard, future authed pages) | Dynamic, noindex |
| `api/` | Route handlers (settings, stats, search, OG) | `nodejs` runtime |

`(app)` is the home for new authenticated pages. Its layout sets `robots: noindex`
and every route under it is signed-in and dynamic.

## Feature folders (`src/features/<domain>`)

UI and client logic are vertical slices: `components/`, `hooks/`, `lib/`, and
co-located tests, per domain (`marketing`, `docs`, `editorial`, `scratchpad`,
`dashboard`, `memos`, `account`). Cross-domain primitives live in `src/shared`.

## Server domains (`src/server/<domain>`)

Server logic is grouped by domain, each containing:

- `*-handlers.ts` — a **handler factory** that takes its dependencies as an
  argument (e.g. `createMemosSettingsHandlers(deps)`), so handlers are testable
  with fakes and free of direct I/O.
- `*-store.ts` — the **persistence seam** (see "Data access").
- `*-schema.ts` — Zod validation + parsing.
- `auth/` holds the Clerk auth seam (`RouteAuthDeps`, `requireUserId`, `isClerkConfigured`).
- `db/` is the reserved home for a future shared DB client + schema (empty today).

A `route.ts` under `src/app/api/<...>` stays thin: it constructs the concrete
dependencies (store, auth deps) and wires them into the factory.

## Data access (the store seam)

Persistence is reached only through a per-domain **store interface**, never by
calling a backend client directly from a handler. The worked example is
`src/server/settings/memos-settings-store.ts`:

```ts
export interface MemosSettingsStore {
  read(userId: string): Promise<unknown>;
  write(userId: string, settings: MemosSettings | null): Promise<void>;
}
export function createClerkMemosSettingsStore(getClient = clerkClient): MemosSettingsStore { /* ... */ }
```

Today the only store is Clerk-backed (Memos connection settings live in Clerk
`privateMetadata` — appropriate because they are a small, per-user blob read only
for the current user). When a feature needs more, add a new store implementation
(e.g. a D1-backed one) behind the same interface; handlers and routes do not change.

## Runtime & caching boundary

- **One runtime.** OpenNext runs the whole app in the Cloudflare Workers runtime.
  Do **not** add `export const runtime = "edge"` — it is unsupported. Handlers that
  need Clerk or bindings use `export const runtime = "nodejs"`.
- **Authenticated/dynamic routes** use `export const dynamic = "force-dynamic"` and
  return `Cache-Control: no-store`. They opt out of the static cache and coexist
  with static content.
- **Static cache cannot revalidate.** The incremental cache is
  `staticAssetsIncrementalCache` (build-time only). On-demand revalidation / ISR
  would require switching the backend to an R2 incremental cache plus a Durable
  Object tag cache — a deliberate future change, not enabled now. If the marketing
  surface ever needs revalidating ISR, that (or splitting the dashboard to its own
  worker) is the escape hatch — not a default.
- **Middleware matcher** (`src/middleware.ts`) currently covers `/api/settings/*`
  and `/api/memos/*`. Add new authenticated API namespaces there.

## Auth seam

Clerk is optional and env-gated. `isClerkConfigured()` is true only when both
`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are set; when unset, the
middleware is a no-op and authed UI is hidden. Route handlers depend on
`RouteAuthDeps` (`isClerkConfigured`, `getUserId`) and call `requireUserId(deps)` to
return a 503/401 or the resolved `userId`. Never accept a `userId` from the client.

## Testing

- Vitest (`*.test.ts` / `*.test.tsx`) is the current runner: `pnpm test`. The setup
  (`vitest.setup.ts`) provides jsdom, a localStorage polyfill, and IndexedDB.
- Test handlers and stores through their dependency seams with in-memory fakes — do
  not hit Clerk or the network in unit tests.
- Some legacy `*.test.mjs` (node:test) files predate the Vitest migration and are not
  run by `pnpm test`; write new tests as `*.test.ts`.

## Adding an authenticated feature

1. Add the page under `src/app/(app)/<feature>/` (signed-in, dynamic).
2. Put UI + client logic in `src/features/<feature>/`.
3. Put server logic in `src/server/<feature>/`: a `*-handlers.ts` factory, a
   `*-store.ts` seam if it persists data, and a `*-schema.ts` for input validation.
4. Add a thin `src/app/api/<feature>/route.ts` that wires concrete deps into the
   factory; set `runtime = "nodejs"`.
5. Add the new API path to the middleware matcher.
6. Write Vitest tests against the factory and store using fakes.

## Future data layer (sanctioned plan — not built yet)

When a feature first needs persistence beyond a small per-user blob, introduce —
behind the store seam — in this order:

- **Cloudflare D1 + Drizzle** as the relational store (Drizzle is the
  Workers-compatible default). Keep the schema Postgres-portable so a later
  Hyperdrive + Neon swap is a config change. Migrations via `drizzle-kit` +
  `wrangler d1 migrations apply`.
- **Credential encryption at rest** for any third-party token (AES-256-GCM via Web
  Crypto with a Worker-secret key and a `key_id` for rotation).
- **KV read-through cache** for high-read, staleness-tolerant aggregates (e.g.
  dashboard stats), with D1/the store as source of truth.
- **Clerk → D1 user-sync webhook** only when relational features (teams/sharing) need
  to join on a local users table.
