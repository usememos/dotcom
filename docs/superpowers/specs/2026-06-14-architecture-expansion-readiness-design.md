# Architecture Expansion-Readiness Design

Date: 2026-06-14

## Context

The repository began as a static Next.js 16 marketing/docs site for Memos and has since grown an authenticated product surface: Clerk auth (optional, env-gated), a `force-dynamic` dashboard that proxies stats from a user's self-hosted Memos instance, and `/api` route handlers for settings and stats. The May 31 restructure already established good bones — feature-folder vertical slices under `src/features/*`, runtime-grouped routes (`(public)`, `(tools)`, `(auth)`, `(app)`), and dependency-injection seams in the server layer.

The goal now is **not** to add product features. It is to make the structure and architecture ready to expand into a richer SaaS dashboard, so that the next person (or agent) adding an authenticated feature drops it into clear, consistent homes instead of re-deciding architecture each time. This document is both the current-state assessment and the targeted readiness plan.

## Goals

- Establish an explicit, swappable **persistence store seam** so "where data lives" is a named boundary, not inline route code.
- Codify **server-domain and feature conventions** so authenticated expansion has obvious homes and one pattern to copy.
- Resolve dead/misleading structural placeholders.
- Produce an authoritative **architecture & expansion guide** and bring **AGENTS.md** in line with reality.
- Document the **sanctioned future data-layer design** (D1 + Drizzle, encrypted credentials, KV cache) so expansion follows a pre-decided plan rather than ad-hoc choices.

## Non-Goals

- No new product features (the scratchpad cloud-sync feature explored during design is explicitly deferred).
- Do not build D1, Drizzle, KV, R2, or any new Cloudflare binding in this pass.
- Do not migrate Memos settings out of Clerk metadata.
- Do not split the dashboard to a separate worker / `app.usememos.com`.
- Do not change user-visible behavior; no route, metadata, or rendering changes.
- Do not redesign pages or introduce new runtime environment requirements.

## Current-State Assessment

### What is already good

- **Vertical feature slices.** `src/features/{marketing,docs,editorial,scratchpad,dashboard,memos,account}/{components,hooks,lib}` keep domains self-contained.
- **Runtime-grouped routes.** `(public)` static content, `(tools)` standalone client tools, `(app)` authed product, with `(auth)` reserved.
- **Server DI seams.** `createMemosSettingsHandlers(deps)` and `createMemosStatsHandler(deps)` accept their auth and persistence dependencies, and `RouteAuthDeps` / `requireUserId` abstract auth. This is the single most important property for testability and for swapping implementations later.
- **Strong security hygiene on the proxy.** SSRF host guards, `redirect: "manual"`, timeouts, and `no-store` cache headers in the stats handler.
- **Strong test culture.** Co-located `.test.ts` / `.test.tsx` / `.test.mjs` across logic and UI, plus a vitest suite.

### The gaps relative to expansion

1. **Persistence is implemented inline in route files.** `readMemosMetadata` / `writeMemosMetadata` are defined directly in `src/app/api/settings/memos/route.ts` and wired ad-hoc in `src/app/api/memos/stats/route.ts`. The handler-level seam exists, but the *implementation* has no named home, so there is no obvious place or pattern for the next feature's persistence.
2. **Dead/misleading server placeholders.** `src/server/db/.gitkeep` is empty and `src/server/api/.gitkeep` is unused (API routes live under `src/app/api`). They imply structure that does not exist.
3. **Stale guardrails.** `AGENTS.md` states "Treat as a static marketing/docs website. Do not introduce auth, databases, or environment variables," which is now false (Clerk auth, `/api` handlers, and `CLERK_*` env vars already exist). It will misguide future work.
4. **Undocumented runtime/caching boundary.** The OpenNext constraints (single Workers runtime, no per-route `edge`, static incremental cache that cannot revalidate, `force-dynamic` for authed routes) are load-bearing but unwritten, so expansion can trip them.
5. **No written expansion path.** There is no single document a contributor can read to learn "how do I add an authenticated feature here, and where does its data go."

## Product Direction (research-grounded)

This direction informs the conventions below; it is documented here and in the guide, **not** built in this pass.

- **Model: companion / control-plane → value-add layer.** Users connect their own self-hosted Memos instance (token-based `/api/v1`), and the product adds analytics and, later, value-add features (cross-instance search, backups, AI, teams). A hosted multi-tenant Memos is explicitly **not** the direction — it contradicts the project's public "no hosted subscription" stance and is the heaviest possible lift.
- **One codebase, route groups.** Comparable open-source products (Dub, Cap) keep marketing + dashboard in one Next app and split only when runtime needs or contributor sets diverge. Neither applies here yet, so the dashboard stays in this codebase. `app.usememos.com` as a separate worker remains a future escape hatch, reachable only if marketing later needs revalidating ISR.

See **Research Basis** for sources.

## Decisions Locked (from this brainstorm)

- Dashboard stays in the current codebase; no worker split now.
- Memos connection settings stay in Clerk `privateMetadata` (small, per-user, current-user-only — an appropriate use of metadata).
- This pass ships seams + conventions + documentation only; no features, no D1.
- The future data-layer is D1 + Drizzle behind the store seam, with encrypted credentials and a KV stats cache — documented as the sanctioned plan.
- Credential encryption and the KV/rate-limit hardening remain recommended but are **separate** follow-on work, out of this spec's scope.

## In-Scope Work

### 1. Persistence store seam

Introduce a named store module that owns Memos-settings persistence and is consumed by both route handlers.

- New `src/server/settings/memos-settings-store.ts` exporting:
  - `interface MemosSettingsStore { read(userId: string): Promise<unknown>; write(userId: string, settings: MemosSettings | null): Promise<void>; }`
  - `createClerkMemosSettingsStore(): MemosSettingsStore` — the Clerk `privateMetadata.memos` implementation currently inlined in the settings route.
- `src/app/api/settings/memos/route.ts` and `src/app/api/memos/stats/route.ts` construct the store and pass it (or its bound methods) into their existing handler factories. The factories keep their injected-dependency shape so current handler tests continue to pass unchanged.
- Behavior is identical; this is a pure refactor that gives the seam a home and a name. The Clerk client stays the only place that talks to Clerk.

This is the concrete, copyable example the guide points to: **handler factory (DI) + store interface + provider implementation**. When a feature later needs D1, it adds a `createD1XStore()` implementation behind the same interface — no handler or route restructuring.

### 2. Server-domain convention + placeholder cleanup

- Adopt the convention `src/server/<domain>/` containing `*-handlers.ts` (factory), `*-store.ts` (persistence seam), `*-schema.ts` (Zod validation), and co-located tests. `auth/`, `settings/`, and `memos/` already approximate this; the convention makes it explicit.
- Replace `src/server/db/.gitkeep` with a short `README.md` describing it as the future home for the shared DB client and Drizzle schema (introduced only when a feature needs persistence).
- Remove `src/server/api/.gitkeep` (API routes live under `src/app/api`); if shared API helpers are ever needed they belong in the relevant `src/server/<domain>/` or `src/shared/`.

### 3. `(app)` authenticated shell

- Confirm `src/app/(app)/layout.tsx` is a clean, documented shell for future authed pages (it already sets `robots: noindex`). Keep `dashboard/`, and the `memos/` and `settings/` placeholders, as the documented homes for future authed surfaces. No feature UI is added.

### 4. Architecture & expansion guide

Create `docs/architecture.md` (linked from `AGENTS.md`) covering:

- **Route groups** and what belongs in each (`(public)`, `(tools)`, `(auth)`, `(app)`).
- **Feature-folder + server-domain conventions**, including the handler-factory + store-seam pattern with the Memos-settings store as the worked example.
- **Runtime rules:** a single Workers runtime under OpenNext, no per-route `export const runtime = "edge"`, `runtime = "nodejs"` for handlers needing Clerk/bindings, `force-dynamic` + `no-store` for authenticated/dynamic routes.
- **Caching boundary:** the static-assets incremental cache cannot revalidate; the dashboard stays `force-dynamic` and so coexists with static content; if marketing ever needs revalidating ISR, switch the incremental-cache backend (R2 + Durable Object tag cache) or split `app.usememos.com` — a deliberate future call, not a default.
- **Auth seam:** `RouteAuthDeps` / `requireUserId`, env-gating via `isClerkConfigured()`, the middleware matcher convention.
- **Testing conventions:** DI seams with fakes, co-located tests, the `.test.ts` vs `.test.mjs` split.
- **How to add an authenticated feature:** a step-by-step (route under `(app)`, UI in `src/features/<x>`, server logic in `src/server/<x>` with a handler factory + store, middleware matcher entry, tests).
- **Sanctioned future data-layer plan** (see below).

### 5. AGENTS.md refresh

- Replace the "static site; no auth/DB/env" framing with the accurate description: a marketing/docs site **and** an authenticated product app using Clerk, deployed to Cloudflare Workers via OpenNext.
- Document the real env vars (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`) and the env-gating behavior.
- Note that `pnpm test` (vitest) exists (the current "There is no test script" line is stale).
- Point to `docs/architecture.md` as the source of truth for conventions and the expansion path.

## Runtime & Caching Boundary (to document)

These are recorded so expansion does not rediscover them by breakage:

- OpenNext runs the whole app in one Workers runtime; the `edge` runtime directive is unsupported and must not be added.
- Authenticated/dynamic routes use `force-dynamic` and return `no-store`; they opt out of the static cache and coexist with static content.
- The current incremental cache is read-only (static assets) and cannot revalidate. On-demand revalidation/ISR requires switching the cache backend (R2 incremental cache + a Durable Object tag cache) — a future, deliberate change, not enabled now.
- The middleware matcher currently covers `/api/settings/*` and `/api/memos/*`; new authed API namespaces are added there.

## Sanctioned Future Data-Layer Plan (document, do not build)

When a feature first needs real persistence beyond a small per-user blob, introduce, behind the store seam:

- **Cloudflare D1 + Drizzle** as the relational store (Drizzle is the current Workers-compatible default; Prisma's runtime WASM codegen is disallowed on Workers). Keep the schema Postgres-portable so a later Hyperdrive + Neon swap is a config change.
- **Credential encryption at rest** for any third-party token (AES-256-GCM via Web Crypto with a Worker-secret key and a `key_id` for rotation) — applies if/when the Memos token moves or is hardened in place.
- **KV read-through cache** for high-read, staleness-tolerant aggregates such as dashboard stats, with the store/D1 as source of truth.
- **Clerk → D1 user-sync webhook** only when relational features (teams/sharing) need to join on a local users table.

None of these are created in this pass; the seam and the guide make adding them a drop-in.

## Testing & Verification

- The store-seam refactor must preserve all existing tests; existing handler tests continue to inject fakes and pass unchanged.
- Add a focused test for `createClerkMemosSettingsStore` wiring where practical (or leave Clerk as the integration boundary, mirroring current coverage).
- Documentation changes (`docs/architecture.md`, `AGENTS.md`, `src/server/db/README.md`) carry no runtime risk.

Required:

```bash
pnpm test
pnpm lint
pnpm build
```

`pnpm build` remains the critical check that route handling and static generation are unaffected.

## Acceptance Criteria

- `src/server/settings/memos-settings-store.ts` exists with `MemosSettingsStore` and a Clerk implementation; both the settings and stats routes consume it; no persistence logic remains inlined in route files.
- `src/server/<domain>/` convention is documented; `src/server/db/.gitkeep` is replaced by a boundary `README.md`; `src/server/api/.gitkeep` is removed.
- `docs/architecture.md` exists and covers route groups, conventions, the store-seam pattern, runtime/caching boundary, auth seam, testing, the add-a-feature walkthrough, and the future data-layer plan.
- `AGENTS.md` accurately describes the auth + product-app reality, real env vars, the test script, and links the guide; no stale "static site / no auth/DB" guidance remains.
- No new feature, route, Cloudflare binding, database, or environment requirement is introduced.
- `pnpm test`, `pnpm lint`, and `pnpm build` pass with no behavior change.

## Out of Scope / Named Follow-ons

- **Scratchpad cloud sync** (D1 snapshot-per-user) — the first feature that would exercise the seam; its own spec when prioritized.
- **Memos token encryption** — recommended security fix; small, independent, separate spec.
- **Dashboard hardening** — KV stats cache, rate-limiting, structured observability.
- **Relational features** — teams/sharing/automation, which trigger D1 + the user-sync webhook.

## Research Basis

Conventions and the product direction are grounded in a survey of comparable open-source products and the Cloudflare/OpenNext platform (current as of 2026):

- **Repo organization** — Dub and Cap keep marketing + dashboard in one Next app with route groups; Supabase, Cal.com, and Twenty use monorepos with separate apps; PostHog and Outline use separate repos. Splits track divergent runtime needs and contributor sets, not user count. Docs is the first surface teams split.
- **Memos & comparable PKM tools** — Memos is self-host-first (Go, `/api/v1`, personal access tokens, MIT) with a public "no hosted subscription" stance; comparable tools (Trilium, Joplin, AppFlowy, Affine, Notesnook, Standard Notes) monetize sync/collaboration/AI as services, not by hosting the app.
- **Cloudflare/OpenNext data + runtime** — D1 + Drizzle is the current Workers default (Prisma 7's runtime WASM codegen is disallowed on Workers); Clerk `privateMetadata` is appropriate only for small, current-user-only data (8 KB cap, rate-limited) and is an anti-pattern for relational data; OpenNext runs a single Workers runtime with a static incremental cache that cannot revalidate.

Key sources: OpenNext Cloudflare docs (caching, multi-worker); Cloudflare storage-options and Web Crypto docs; Clerk metadata limits and DB-sync guidance; Drizzle-vs-Prisma-on-Workers writeups; the Memos repository, docs, and pricing page.
