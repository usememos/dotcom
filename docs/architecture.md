# Architecture

The official Memos website is **one Next.js 16 (App Router) application** deployed
to **Cloudflare Workers via OpenNext**. It serves two surfaces from the same
codebase:

- a **static public** surface (project-owned marketing/editorial UI plus Fumadocs documentation), and
- an **account product** surface (`/dashboard` and `/settings/connections`, with
  Clerk sign-in and browser-side access to a connected Memos instance).

This document is the source of truth for how the code is organized and how to
expand the authenticated surface. Keep it in sync when conventions change.

## Current scope

The public site explains Memos, publishes documentation and releases, and links
to installation and the Web Clipper. The account app connects one Memos instance
per account and displays its activity. It does not run Memos instances or proxy
their API requests: the browser calls the user's instance directly.

There is no application database, server-side product API, `src/server/`
directory, or request middleware today. Extension guidance below describes what
to add when a feature needs those pieces; it is not an inventory of existing
infrastructure or a committed product roadmap.

## Route groups (`src/app`)

| Group | Purpose | Rendering |
| --- | --- | --- |
| `(public)/(site)` | Project-owned marketing + blog + changelog shell | Static |
| `(public)/docs` | Fumadocs documentation and API reference | Static |
| `(app)` | Overview and connection settings; Clerk provider and account shell | Static client-auth shells, noindex |
| `api/search` | Public docs search index, searched in the browser | Static |
| `og/` | Generated Docs, Blog, and Changelog social images | Static, `nodejs` runtime |
| `og-image.png` | Default social image, using the same SVG sky and text-only wordmark template | Static, `nodejs` runtime |
| `llms.txt`, `llms-full.txt`, `llms.mdx/[...slug]` | Public content indexes and Markdown exports | Static |

The site also generates `sitemap.xml` and `/blog/feed.xml`. There is no `(auth)`
route group: account actions open Clerk's sign-in modal.

`(app)` is the home for authenticated product pages. Its layout sets
`robots: noindex`. Pages that only read Clerk and product data in the browser may
use a static client-auth shell; pages that read request-time or server-side user
data stay dynamic.

## Feature folders (`src/features/<domain>`)

UI and client logic are vertical slices: `components/`, `hooks/`, `lib/`, and
co-located tests, per domain (`marketing`, `docs`, `editorial`, `ai-discovery`,
`overview`, `connections`, `account`). Cross-domain primitives live in `src/shared`; the
client-safe Memos protocol and connection data helpers live in `src/shared/memos`.

## Content and generated references

- `content/docs/`, `content/blog/`, and `content/changelog/` contain MDX sources.
  `source.config.ts` defines their schemas; `src/shared/content/source.ts` exposes
  the Fumadocs loaders.
- `.source/` is ignored build output. `pnpm docs:generate:source` rebuilds it;
  do not edit it directly.
- `src/features/docs/lib/api-docs-versions.json` owns the API version manifest.
  `pnpm docs:refresh` downloads schemas into `openapi/`, regenerates
  `content/docs/api/`, and refreshes the source and scoped styles. Both YAML
  snapshots and generated API MDX are committed. A failed download can fall back
  to an existing local snapshot, so check the refresh log before claiming it is
  current. Ordinary builds use committed schemas and do not download new ones.
- The published API window is Latest (`main`) plus the two newest minor series
  (currently 0.31 and 0.30). Retired YAML snapshots remain committed; their pages
  redirect to the upgrade guide. Keep `src/shared/memos/supported-versions.ts`
  aligned with the manifest. The minimum instance version supported by the
  account app is a separate compatibility setting.
- Search and the sitemap include only Latest API pages. Versioned API pages are
  noindex. `src/features/ai-discovery/` exports prose docs, blog, and changelog
  content; generated API references are excluded from the Markdown exports.
- Docs child layouts own either the prose tree or one API version's tree, so a
  page does not serialize every version's navigation.

## UI primitives

`DESIGN_SYSTEM.md` is authoritative for public marketing and editorial design;
`AGENTS.md` defines product terminology. Docs and the account app retain their own
layout and styling boundaries.

Reusable interactive primitives use shadcn/ui's `base-nova` style backed by Base UI. The CLI configuration is `components.json`, generated components live in `src/shared/ui`, and their shared utility import resolves to `src/shared/lib/utils.ts`.

Feature and application code should consume the wrappers in `src/shared/ui` instead of importing `@base-ui/react` directly. Do not introduce direct Radix UI dependencies or imports. Fumadocs currently owns some transitive Radix dependencies internally; those are part of the documentation framework rather than the application's UI layer.

Fumadocs UI, its provider, CSS, and search are scoped to `/docs`; the marketing/editorial shell is project-owned and does not initialize documentation search. The docs layout owns an independent CSS entry composed of the generated Fumadocs stylesheet and project theme overrides. `pnpm docs:generate:styles` prefixes Fumadocs selectors with `:where(html:has(#nd-docs-layout))`, deriving the boundary from the root rendered by Fumadocs `DocsLayout`. The scope therefore activates in server-rendered HTML, updates automatically during client navigation, and still covers portals such as search dialogs rendered elsewhere under `<html>`.

The `:where()` wrapper is load-bearing, not cosmetic: it contributes zero specificity, so scoping narrows *where* Fumadocs rules apply without changing how they rank against project CSS. A bare `html:has(#nd-docs-layout)` prefix adds the layout ID's specificity to every rule and silently flips cascade winners — Fumadocs' `.dark` palette would outrank the project theme bridge, and its `--radius-*`/`--font-*` would outrank `:root`. A test in `src/features/docs/fumadocs-boundary.test.ts` enforces this. The generated stylesheet is gitignored and produced by `postinstall` and `pnpm build`; because CI installs with `--ignore-scripts`, the test job regenerates it explicitly.

Note the scoping covers rules only. `@property` and `@keyframes` blocks stay document-global, and Next.js retains a route stylesheet after a client-side navigation away — so those at-rules remain in effect on non-docs pages once a visitor has loaded `/docs`.

Blog and changelog keep using `fumadocs-mdx` and `fumadocs-core/source` as a headless build-time content pipeline, but render with the project-owned MDX registry in `src/features/editorial/lib/mdx-components.ts`, which owns the `a`, `img`, and `pre` primitives that the docs registry takes from Fumadocs.

Public marketing and editorial routes live in the `(site)` route group, which applies the shared header and footer. Page shells use the `site-container` utility for width and gutters rather than a per-section `max-w-*`; the width is `--site-layout-width` in `src/app/global.css`, and `src/features/marketing/site-layout-boundary.test.ts` enforces the convention in CI.

Rendered MDX uses the owned shadcn Typeset stylesheet at `src/app/typeset.css`. Blog and changelog pages use the spacious `typeset-editorial` preset in `src/app/global.css`; documentation pages use the denser `typeset-docs` preset while retaining Fumadocs for layout, navigation, code blocks, callouts, cards, and generated API reference components. Complex Fumadocs widgets opt out with `not-typeset`, and MDX tables use a `typeset-scroll` wrapper so narrow viewports scroll the table instead of the page.

## Account data flow

`useMemosConnection` reads and writes one `{ instanceUrl, accessToken }` connection
in Clerk `unsafeMetadata.memos`. Saving or disconnecting reloads the user,
compares the stored connection with the last observed value, writes the change,
and reloads again. This catches an already-changed connection; it is not an
atomic compare-and-swap between simultaneous writes. This browser-writable
metadata must not be treated as server-owned authorization data.

The connection form validates the URL and tests the instance before saving.
`src/shared/memos/instance-client.ts` sends the personal access token directly
to the instance's `/api/v1` endpoints. It handles timeouts, redirects, mixed
content, and CORS/network failures. `instance-stats.ts` and `versions.ts` resolve
the instance user and normalize version-specific statistics for the overview.
The instance must be reachable from the browser and permit the site's origin.

The overview keeps a best-effort statistics cache in browser `localStorage`
through `src/features/overview/lib/stats-cache.ts`, then refreshes from the
instance. The cache contains statistics, a resolved Memos user ID, and version
metadata, not the access token. The account app has no IndexedDB or local memo
sync engine. The Web Clipper is a separate client; this repository owns its
landing page and the account connection settings entry point.

## Connection route contract

- `/settings/connections` is the canonical account connection resource.
- `?source=web-clipper` changes return guidance only; it does not select a
  different workflow or trigger a write.
- The legacy `/dashboard?setup=memos&source=web-clipper` entry permanently
  redirects to the canonical route.
- Overview and clients link to this page; they do not implement separate
  connection dialogs.
- Sign-in uses the current pathname and query as its forced return URL.

## Runtime & caching boundary

- **One runtime.** OpenNext runs the whole app in the Cloudflare Workers runtime.
  Do **not** add `export const runtime = "edge"` — it is unsupported. Handlers that
  need Clerk or bindings use `export const runtime = "nodejs"`.
- **Static client-auth routes** such as `/dashboard` and `/settings/connections`
  use `dynamic = "force-static"` and `revalidate = false`. Their HTML contains no
  user data; Clerk and the connected Memos instance load after hydration in the
  browser. Route presentation inputs such as the settings page's `source` query
  are read through a client adapter inside `Suspense`. This lets OpenNext serve
  the build-time shell without invoking NextServer per visit.
- **Server-auth or request-dependent routes** use
  `export const dynamic = "force-dynamic"` and return `Cache-Control: no-store`.
  They opt out of the static cache and coexist with static content.
- **Static cache cannot revalidate.** The incremental cache is
  `staticAssetsIncrementalCache` with `enableCacheInterception: true` in
  `open-next.config.ts`. Content changes require a rebuild and redeploy.
  On-demand revalidation / ISR requires a deliberate persistent-cache design;
  no R2, KV, D1, or Durable Object bindings are configured today. Do not enable
  partial prerendering without revisiting cache interception.
- **Public responses are cached before Worker execution.** Wrangler's Workers
  Caching is enabled, so eligible responses are served without invoking OpenNext.
  OpenNext's cache interceptor gives prerendered routes a long `s-maxage`; the
  marketing/docs routes also declare that policy explicitly in
  `next.config.mjs`. Cache keys are Worker-version isolated, so each deployment
  starts with a fresh cache and cannot serve output from the previous build.
  Tradeoff: OpenNext runs as one gateway entrypoint, so with caching on,
  `no-store` APIs and any future dynamic server-auth pages pay a cache-tier
  lookup before the Worker runs — no benefit for them, and Cloudflare's
  per-entrypoint opt-out can't be applied to a single-entrypoint Worker. Watch
  dynamic-route latency after rollout.
- **Unknown routes use the prerendered 404 cache.** Next 16 stores the App Router
  not-found artifact at `/_not-found`, while `@opennextjs/aws` 4.1.2 still routes
  unknown URLs to `/404`. The pinned `@opennextjs/aws` patch aligns those paths so
  cache interception returns a 404 without loading NextServer. The same patch
  narrowly preserves the computed long-lived cache policy only for the immutable
  build-time `/_not-found` artifact (`initialRevalidateSeconds: false`); OpenNext's
  4.1.2 safety override continues to make transient or revalidating 404s and all
  500s `no-store`. OpenNext already handles the separate root `/` versus `/index`
  cache-key mismatch upstream, so do not restore that older local patch. The smoke
  test verifies the 404 status,
  long-lived cache header, and `x-opennext-cache: HIT`; keep the remaining patch
  until the upstream adapter handles the Next 16 not-found cache key.
- **Known browser probe paths are real assets.** The root Apple Web Clip filenames
  live in `public/` and receive immutable asset headers. Cloudflare serves them
  before the Worker, avoiding a 404 invocation for legacy clients and crawlers.
- **Prefetch inlining is disabled.** `next.config.mjs` sets
  `experimental.prefetchInlining: false` to avoid repeated RSC requests with the
  current Next.js/OpenNext combination. Recheck this compatibility setting when
  upgrading the adapter.
- **Caching is opt-out, not opt-in — a `200` without `Cache-Control` is stored.**
  Workers Caching applies RFC 9111 heuristic freshness (a `200` with no
  `Cache-Control` is cached for 2h), and a request `Cookie` (Clerk's `__session`)
  does *not* trigger a cache bypass — only a `Set-Cookie` response header or an
  `Authorization` request header does. So an authenticated route MUST explicitly
  return `no-store`; it is not automatic. `force-dynamic` **pages** already emit
  `no-store`, but **route handlers do not** — an `/api/*` handler must set it
  itself. As a safety net, `next.config.mjs` forces `Cache-Control: private,
  no-store` on all `/api/*` except the public `/api/search` index; put any
  authenticated non-`/api` route on that list too.
- **No request middleware is currently needed.** Clerk is consumed by client
  components, and the existing route handlers produce public static output. Add
  Clerk middleware with a narrow matcher when a future route starts using
  server-side Clerk auth; do not leave matchers for deleted API namespaces.

## Auth seam

`AuthProviders` mounts Clerk only under `(app)`. `AppShell` supplies navigation;
the overview and settings components render their own signed-out and loading
states. The layout does not enforce server-side authentication. Public marketing
and docs layouts do not mount Clerk.

`useAccountActions` opens Clerk's sign-in modal and preserves the current path
and query unless the caller supplies a return URL. The current browser flow uses
`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`; `scripts/verify-deploy-env.mjs` requires it for
deploy and upload. Set it before building because the account shells are static.
There are no current `CLERK_SECRET_KEY` consumers, server auth helpers, or Clerk
webhook handlers in this repository.

If a feature introduces server-authenticated routes, add server credentials,
narrowly matched auth middleware, and a testable auth dependency together. Derive
the acting user from the verified session, not a client-supplied `userId`.

## Testing

- `pnpm test` runs Vitest against `src/**/*.{test,spec}.{ts,tsx}` as configured in
  `vitest.config.mts`. The default environment is jsdom; individual tests can
  select Node. `vitest.setup.ts` installs in-memory local/session storage,
  Testing Library cleanup, and a `matchMedia` stub. It does not install IndexedDB.
- Mock Clerk and inject fetch dependencies for instance-client tests; do not
  contact real accounts or instances in unit tests.
- `scripts/*.test.mjs` use Node's test runner and are not included in `pnpm test`
  or the current CI test job. Run a relevant script test explicitly when changing
  the configuration it covers.
- Standard validation is `pnpm test`, `pnpm lint`, and `pnpm build`. For routing
  or runtime changes, use `pnpm run preview` and run
  `SMOKE_BASE_URL=http://localhost:8788 pnpm run smoke`. `pnpm start` checks only
  the local Next.js production server, not the Workers runtime.
- `.github/workflows/ci.yml` runs tests, lint, and the Cloudflare dry-run build.
  Dependencies install with `--ignore-scripts`; the test job explicitly generates
  the scoped docs stylesheet, and the build generates both styles and sources.

## Build and deployment

Use Node 24 or newer and the pnpm version declared in `package.json`. `pnpm dev`
runs Next.js with Turbopack. `pnpm build` generates Fumadocs sources and scoped
styles before the production build.

`pnpm run build:worker` runs the OpenNext build and produces `.open-next/`.
`pnpm run deploy` promotes that existing artifact with `--keep-vars`;
`pnpm run upload` uploads it without promotion. Neither command rebuilds the
artifact. `pnpm run deploy:dry-run` builds and packages without deploying.
`wrangler.jsonc` configures the `ASSETS` binding, Node compatibility, observability,
and port 8788 for the local preview.

## Adding an authenticated feature

1. Add the page under `src/app/(app)/<feature>/`. Use a static client-auth shell
   when all personalized data loads in the browser; use a dynamic route when the
   server reads request or authentication state.
2. Put UI + client logic in `src/features/<feature>/`.
3. If browser access to the connected instance is sufficient, reuse the helpers
   in `src/shared/memos`; a new page does not automatically need a server API.
4. If server logic is needed, introduce `src/server/<feature>/` with a handler
   factory accepting dependencies, a store interface for persistence, and a Zod
   schema for input validation. These folders and abstractions do not exist yet.
5. Wire concrete dependencies in a thin `src/app/api/<feature>/route.ts`; use
   `runtime = "nodejs"`, verify the session, and return `Cache-Control: private,
   no-store`. Add narrowly matched Clerk middleware with the first server-auth
   route.
6. Test the new client behavior or server dependency seams with fakes, and check
   caching in the Workers preview when adding a route.

## Future data layer

There is no database client, ORM, migration system, or server-side credential
store in this application. D1, Drizzle, KV caches, and Clerk user-sync webhooks
are not implemented dependencies or prerequisites for the current account app.

Before adding persistence or a Cloudflare binding, document the feature's data
ownership, access rules, retention, migration, and runtime needs. Choose the
backend for those requirements and access it through a per-domain store
interface. Do not copy browser-writable Clerk metadata for larger or server-owned
data, and do not assume changing database providers is only a configuration edit.

If the server starts storing third-party credentials, include encryption, key
rotation, and deletion in that design. Add a cache or local user table only when
the feature requires one. Record the chosen design here when it is implemented.
