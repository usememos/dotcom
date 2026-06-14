# Architecture Expansion-Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the codebase expansion-ready by extracting a named persistence store seam, tidying server-folder conventions, and writing authoritative architecture docs — without adding any product feature or database.

**Architecture:** One Next.js 16 app on Cloudflare Workers (OpenNext). The single behavioral change is a pure refactor that moves the Clerk `privateMetadata` access out of the API route files into a named `MemosSettingsStore` (interface + Clerk implementation) that both routes consume. Everything else is documentation and placeholder cleanup.

**Tech Stack:** TypeScript, Next.js App Router, `@clerk/nextjs`, Zod, Vitest.

> **Commits:** Per the user's preference, **do not commit** — leave all changes uncommitted on `main`. Each task ends with a verification step instead of a commit. Run verification from the repo root.

---

## File map

- Create: `src/server/settings/memos-settings-store.ts` — the persistence seam (interface + Clerk impl).
- Create: `src/server/settings/memos-settings-store.test.ts` — Vitest unit test for the Clerk store.
- Modify: `src/app/api/settings/memos/route.ts` — consume the store instead of inline functions.
- Modify: `src/app/api/memos/stats/route.ts` — consume the store instead of inline functions.
- Create: `src/server/db/README.md` — boundary note for the future DB home.
- Delete: `src/server/api/.gitkeep` — remove the unused placeholder directory.
- Modify: `src/app/(app)/layout.tsx` — add a doc comment describing the authed shell.
- Create: `docs/architecture.md` — the architecture + expansion guide.
- Modify: `AGENTS.md` — bring guidance in line with reality and link the guide.

---

### Task 1: Persistence store seam

**Files:**
- Create: `src/server/settings/memos-settings-store.ts`
- Test: `src/server/settings/memos-settings-store.test.ts`
- Modify: `src/app/api/settings/memos/route.ts`
- Modify: `src/app/api/memos/stats/route.ts`

- [ ] **Step 1: Write the failing test**

Create `src/server/settings/memos-settings-store.test.ts`:

```ts
import { describe, expect, test } from "vitest";
import { createClerkMemosSettingsStore } from "./memos-settings-store";

/** Minimal in-memory stand-in for the Clerk backend client. */
function fakeClient(initial?: unknown) {
  const state = { memos: initial as unknown };
  const calls: Array<{ userId: string; memos: unknown }> = [];
  const client = {
    users: {
      getUser: async (_userId: string) => ({ privateMetadata: { memos: state.memos } }),
      updateUserMetadata: async (userId: string, params: { privateMetadata: { memos: unknown } }) => {
        state.memos = params.privateMetadata.memos;
        calls.push({ userId, memos: params.privateMetadata.memos });
        return {};
      },
    },
  };
  return { client, state, calls };
}

describe("createClerkMemosSettingsStore", () => {
  test("read returns the stored memos object", async () => {
    const saved = { instanceUrl: "https://memos.example.com", accessToken: "t" };
    const { client } = fakeClient(saved);
    const store = createClerkMemosSettingsStore(async () => client);
    expect(await store.read("user_123")).toEqual(saved);
  });

  test("read returns null when no memos metadata is set", async () => {
    const { client } = fakeClient(undefined);
    const store = createClerkMemosSettingsStore(async () => client);
    expect(await store.read("user_123")).toBeNull();
  });

  test("write persists settings under privateMetadata.memos", async () => {
    const { client, calls } = fakeClient();
    const store = createClerkMemosSettingsStore(async () => client);
    const settings = { instanceUrl: "https://memos.example.com", accessToken: "t" };
    await store.write("user_123", settings);
    expect(calls).toEqual([{ userId: "user_123", memos: settings }]);
  });

  test("write(null) clears the stored settings", async () => {
    const { client, state } = fakeClient({ instanceUrl: "x", accessToken: "y" });
    const store = createClerkMemosSettingsStore(async () => client);
    await store.write("user_123", null);
    expect(state.memos).toBeNull();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm exec vitest run src/server/settings/memos-settings-store.test.ts`
Expected: FAIL — cannot resolve `./memos-settings-store` (module does not exist yet).

- [ ] **Step 3: Write the store module**

Create `src/server/settings/memos-settings-store.ts`:

```ts
import { clerkClient } from "@clerk/nextjs/server";
import type { MemosSettings } from "./memos-settings-schema";

/**
 * Persistence seam for a user's Memos connection settings.
 *
 * This is the named boundary the route handlers depend on. Today it is backed
 * by Clerk `privateMetadata`; a later implementation can back it with D1 behind
 * the same interface without touching any handler or route code.
 * See docs/architecture.md ("Data access").
 */
export interface MemosSettingsStore {
  /** Returns the raw stored `memos` object (including the token), or null. */
  read(userId: string): Promise<unknown>;
  /** Persists settings for a user, or clears them when passed null. */
  write(userId: string, settings: MemosSettings | null): Promise<void>;
}

/** The subset of the Clerk backend client this store uses. */
type ClerkClientLike = {
  users: {
    getUser(userId: string): Promise<{ privateMetadata?: { memos?: unknown } }>;
    updateUserMetadata(userId: string, params: { privateMetadata: { memos: MemosSettings | null } }): Promise<unknown>;
  };
};

/**
 * Clerk-backed Memos settings store. `getClient` is injectable for tests;
 * production defaults to Clerk's `clerkClient`. The cast adapts Clerk's broad
 * client type to the narrow surface this store actually uses.
 */
export function createClerkMemosSettingsStore(
  getClient: () => Promise<ClerkClientLike> = clerkClient as unknown as () => Promise<ClerkClientLike>,
): MemosSettingsStore {
  return {
    async read(userId) {
      const client = await getClient();
      const user = await client.users.getUser(userId);
      return user.privateMetadata?.memos ?? null;
    },
    async write(userId, settings) {
      const client = await getClient();
      await client.users.updateUserMetadata(userId, { privateMetadata: { memos: settings } });
    },
  };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm exec vitest run src/server/settings/memos-settings-store.test.ts`
Expected: PASS — 4 tests pass.

- [ ] **Step 5: Refactor the settings route to use the store**

Replace the entire contents of `src/app/api/settings/memos/route.ts` with:

```ts
import { clerkRouteAuthDeps } from "@/server/auth/clerk";
import { createMemosSettingsHandlers } from "@/server/settings/memos-settings-handlers";
import { createClerkMemosSettingsStore } from "@/server/settings/memos-settings-store";

export const runtime = "nodejs";

const store = createClerkMemosSettingsStore();

const handlers = createMemosSettingsHandlers({
  ...clerkRouteAuthDeps,
  readMemosMetadata: store.read,
  writeMemosMetadata: store.write,
});

export const GET = handlers.GET;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
```

This removes the inline `clerkClient` `readMemosMetadata`/`writeMemosMetadata` definitions; behavior is identical.

- [ ] **Step 6: Refactor the stats route to use the store**

Replace the entire contents of `src/app/api/memos/stats/route.ts` with:

```ts
import { clerkRouteAuthDeps } from "@/server/auth/clerk";
import { createMemosStatsHandler } from "@/server/memos/stats-handler";
import { createClerkMemosSettingsStore } from "@/server/settings/memos-settings-store";

export const runtime = "nodejs";

const store = createClerkMemosSettingsStore();

const handler = createMemosStatsHandler({
  ...clerkRouteAuthDeps,
  readMemosMetadata: store.read,
});

export const GET = handler.GET;
```

This removes the duplicated inline `readMemosMetadata`; the stats route now shares the same store as the settings route.

- [ ] **Step 7: Verify (format, lint, test, build)**

Run:
```bash
pnpm check
pnpm exec vitest run src/server/settings/
pnpm build
```
Expected: `pnpm check` reports no remaining issues; the settings tests pass (the new store test plus the existing handler coverage); `pnpm build` completes with both routes compiling. No behavior change. (Leave uncommitted.)

---

### Task 2: Server-domain placeholder cleanup

**Files:**
- Create: `src/server/db/README.md`
- Delete: `src/server/api/.gitkeep`

- [ ] **Step 1: Add the `db` boundary note**

Create `src/server/db/README.md`:

```md
# `src/server/db`

Reserved home for the shared database client and schema, introduced **only when
a feature needs persistence beyond a small per-user blob**.

When that time comes (see `docs/architecture.md` → "Future data layer"):

- Add a Cloudflare **D1** binding in `wrangler.jsonc` and regenerate types with `pnpm typegen`.
- Define the schema with **Drizzle** in `src/server/db/schema.ts`.
- Expose data access through a per-domain **store** (see
  `src/server/settings/memos-settings-store.ts` for the pattern) — handlers
  depend on the store interface, never on the database client directly.

Nothing is created here yet; this file marks the boundary so the directory has a
documented purpose instead of an empty placeholder.
```

- [ ] **Step 2: Remove the unused `api` placeholder**

API route handlers live under `src/app/api`, not here, so this directory is misleading. Run:
```bash
git rm src/server/api/.gitkeep
```
(If the directory still exists as an untracked empty folder afterward, remove it with `rmdir src/server/api`.)

- [ ] **Step 3: Verify nothing referenced the removed path**

Run: `grep -rn "server/api" src` (TS/TSX source).
Expected: no matches (confirmed during planning — the directory had no importers).
Then run `pnpm build`; expected: success.

---

### Task 3: Document the `(app)` authenticated shell

**Files:**
- Modify: `src/app/(app)/layout.tsx`

- [ ] **Step 1: Add the shell doc comment**

In `src/app/(app)/layout.tsx`, insert the comment block immediately above the `export const metadata` line so the file reads:

```tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";

// Shell for the authenticated product surface. Every route under `(app)` is
// signed-in, noindex, and dynamic — add new authed pages here, with their UI in
// `src/features/<domain>` and server logic in `src/server/<domain>`.
// See docs/architecture.md ("Route groups" and "Adding an authenticated feature").
export const metadata: Metadata = {
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function AppLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-stone-50 dark:bg-stone-950">{children}</div>;
}
```

- [ ] **Step 2: Verify**

Run: `pnpm check && pnpm build`
Expected: success; no behavior change (comment only).

---

### Task 4: Architecture & expansion guide

**Files:**
- Create: `docs/architecture.md`

- [ ] **Step 1: Write the guide**

Create `docs/architecture.md` with exactly this content:

````md
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
````

- [ ] **Step 2: Verify**

Run: `pnpm build`
Expected: success (Markdown under `docs/` is not part of the build, so this just confirms nothing broke). Open `docs/architecture.md` and confirm the internal links to `src/server/settings/memos-settings-store.ts` and the spec file are correct.

---

### Task 5: Refresh AGENTS.md

**Files:**
- Modify: `AGENTS.md`

- [ ] **Step 1: Update the Project Snapshot framing**

Replace:

```md
This repository is the official website for Memos at `usememos.com`. It is a static marketing and documentation site built with Next.js, TypeScript, Tailwind CSS, Fumadocs, and MDX content.

Treat it as a **Next.js 16 static marketing/docs website**. Do not introduce external services, databases, runtime auth, or environment-variable requirements unless the task explicitly asks for that integration.
```

with:

```md
This repository is the official website for Memos at `usememos.com`. It is a Next.js + TypeScript + Tailwind app that serves a static marketing/documentation site (Fumadocs + MDX) **and** an authenticated product surface (a Clerk-gated dashboard and `/api` handlers).

Treat it as a **Next.js 16 marketing/docs site plus an authenticated product app**. The marketing/docs surface stays static; the authenticated surface is dynamic. Before adding persistence, a new Cloudflare binding, or a new external dependency, follow the conventions in `docs/architecture.md` rather than introducing them ad-hoc.
```

- [ ] **Step 2: Update the Tech Stack (auth + Node version)**

Replace:

```md
- **Validation**: Zod schemas in `source.config.ts`
- **Node.js**: 22.0.0 or newer
```

with:

```md
- **Validation**: Zod schemas in `source.config.ts` and server route schemas
- **Auth**: Clerk (`@clerk/nextjs`), optional and env-gated via `isClerkConfigured()`
- **Node.js**: 24.0.0 or newer (pinned in `.nvmrc`)
```

- [ ] **Step 3: Add a test command row**

Replace:

```md
| Develop locally | `pnpm dev` | Starts Next.js with Turbopack on port 3000 |
```

with:

```md
| Develop locally | `pnpm dev` | Starts Next.js with Turbopack on port 3000 |
| Run tests | `pnpm test` | Vitest (`*.test.ts`/`*.test.tsx`); `pnpm test:watch` to watch |
```

- [ ] **Step 4: Fix the stale "no test script" line**

Replace:

```md
There is no `test` script. Standard verification is `pnpm lint` and `pnpm build`, with `pnpm run preview` plus smoke tests when the change could affect production routing or runtime behavior.
```

with:

```md
Standard verification is `pnpm test`, `pnpm lint`, and `pnpm build`, with `pnpm run preview` plus smoke tests when the change could affect production routing or runtime behavior. CI currently runs `lint` and `build`; run `pnpm test` locally.
```

- [ ] **Step 5: Add the architecture-guide pointer**

Replace:

```md
## Architecture

### Routes
```

with:

```md
## Architecture

See `docs/architecture.md` for the full architecture and the conventions for expanding the authenticated app (route groups, server-domain layout, the data-access store seam, runtime/caching rules, the auth seam, and a step-by-step for adding an authed feature).

### Routes
```

- [ ] **Step 6: Correct the `(auth)`/`(app)` description**

Replace:

```md
- `src/app/(auth)/` and `src/app/(app)/` are future-facing route boundaries. Do not add runtime auth or database behavior there without an explicit task.
```

with:

```md
- `src/app/(app)/` is the authenticated product surface (Clerk-gated, noindex, dynamic); the dashboard lives here. `src/app/(auth)/` holds sign-in/sign-up boundaries. Add authed features following `docs/architecture.md`.
```

- [ ] **Step 7: Update the Gotchas prohibition**

Replace:

```md
- Do not add external service, database, auth, or runtime environment dependencies unless explicitly requested.
```

with:

```md
- Auth (Clerk) and `/api` handlers already exist; the required env vars are `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` (auth is inert when unset). Do not add a database, a new Cloudflare binding, or a new external dependency ad-hoc — follow the sanctioned path in `docs/architecture.md` ("Future data layer").
```

- [ ] **Step 8: Verify**

Run: `pnpm lint`
Expected: success. Then read `AGENTS.md` start-to-finish and confirm there is no remaining "static site / no auth / no database / no test script" language and that the Node version reads 24.

---

## Final verification

- [ ] Run the full gate from the repo root:

```bash
pnpm check
pnpm lint
pnpm test
pnpm build
```
Expected: all pass. The only behavioral change is the store-seam refactor, which is covered by the new Vitest test and leaves all existing tests green. Leave everything uncommitted on `main`.

---

## Self-Review

**Spec coverage** (against `docs/superpowers/specs/2026-06-14-architecture-expansion-readiness-design.md`):

- In-scope item 1 (persistence store seam) → Task 1. ✓
- In-scope item 2 (server-domain convention + placeholder cleanup) → Task 2 (db README, remove api/.gitkeep) + the convention documented in Task 4. ✓
- In-scope item 3 (`(app)` authed shell) → Task 3. ✓
- In-scope item 4 (architecture & expansion guide) → Task 4. ✓
- In-scope item 5 (AGENTS.md refresh) → Task 5. ✓
- Non-goals (no D1/KV/encryption/features built; settings stay in Clerk; no worker split; no behavior change) → honored; the future data layer is documented, not implemented. ✓
- Acceptance criteria (store module exists + both routes consume it + no inline persistence; db README + api/.gitkeep removed; architecture.md covers the required sections; AGENTS.md accurate; no new binding/db/env; tests/lint/build pass) → covered across Tasks 1–5 and Final verification. ✓

**Placeholder scan:** No "TBD"/"TODO"/"add error handling"/"similar to" — every code and doc step contains its full content. ✓

**Type consistency:** `MemosSettingsStore.read/write`, `createClerkMemosSettingsStore`, and the `readMemosMetadata`/`writeMemosMetadata` dep names match exactly between the store module (Task 1 Step 3), the test (Step 1), and both route wirings (Steps 5–6). The store's `write(userId, settings: MemosSettings | null)` matches the handlers' `writeMemosMetadata` signature; `store.read` matches `readMemosMetadata`. ✓

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-06-14-architecture-expansion-readiness.md`. Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
