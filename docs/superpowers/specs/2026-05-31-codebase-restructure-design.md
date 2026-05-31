# Codebase Restructure Design

Date: 2026-05-31

## Context

The site is currently a static Next.js 16 marketing/docs project with Fumadocs content, MDX blog and changelog pages, OpenNext Cloudflare deployment, and a client-side scratchpad tool. It has no auth provider, database, runtime service dependency, or required environment variables.

The next planned integrations are product-level concerns such as authentication, a database, and multi-client APIs. Before adding them, the codebase needs clearer boundaries so public content, standalone tools, future authenticated app routes, server code, and shared utilities do not become tangled.

## Goals

- Preserve all existing public URLs and behavior.
- Restructure routes around runtime boundaries.
- Move components and modules into domain-owned locations.
- Add an inert product-ready skeleton for future auth, app, API, server, and type boundaries.
- Split oversized data modules where the split clarifies ownership.
- Update imports directly with no temporary compatibility re-export shims.

## Non-Goals

- Do not add Clerk, D1, or any other integration.
- Do not add new environment variables or Cloudflare bindings.
- Do not protect routes or change request handling.
- Do not redesign user-facing pages.
- Do not edit generated `.source/` files.

## Route Architecture

The App Router should be grouped by runtime and ownership boundary while preserving URL paths:

```txt
src/app/
  layout.tsx
  global.css
  layout.config.tsx
  sitemap.ts
  api/
    search/
  og/

  (public)/
    page.tsx
    blog/
    brand/
    changelog/
    docs/
    features/
    pricing/
    privacy/
    social-previews/
    sponsors/
    use-cases/

  (tools)/
    scratchpad/

  (auth)/
    sign-in/.gitkeep
    sign-up/.gitkeep

  (app)/
    dashboard/.gitkeep
    memos/.gitkeep
    settings/.gitkeep
```

`(public)` owns unauthenticated site content. `(tools)` owns standalone tools that are not marketing pages and are not the authenticated product app. `(auth)` and `(app)` are future-facing skeleton boundaries only; they must not introduce runtime behavior in this cleanup.

## Module Architecture

Domain code should move out of flat `src/components` and `src/lib` folders into feature-owned areas:

```txt
src/features/
  marketing/
    components/
    data/
  docs/
    components/
    lib/
  editorial/
    components/
    lib/
  scratchpad/
    components/
    hooks/
    lib/
    types.ts

src/shared/
  ui/
  lib/
  config/

src/server/
  auth/
  db/
  api/

src/types/
```

Marketing owns homepage sections, shared marketing page primitives, footer, sponsor presentation, feature-page presentation, and static marketing data.

Docs owns Fumadocs-specific UI, table-of-contents UI, docs ads/sponsor cards, API docs version helpers, docs source loading, and docs TOC configuration.

Editorial owns blog and changelog presentation, article layout helpers, editorial indexes, and social preview generation for content.

Scratchpad owns its client components, hooks, local storage/indexedDB helpers, compatibility API helpers, interaction utilities, viewport helpers, and scratchpad types.

Shared owns only cross-domain primitives such as generic UI components, class-name utilities, SEO helpers, and app-wide configuration that is not specific to one feature.

Server folders are reserved for future integration work. They may contain boundary notes or `.gitkeep` files only. They should not contain active auth, database, or API implementation in this cleanup.

## Large Module Splits

`src/lib/features.ts` should be split under the marketing domain into separate type, slug, data, and accessor modules. The feature pages and footer should depend on accessors or domain exports rather than a single oversized file.

`src/lib/use-cases.ts` should receive the same treatment: type definitions, slug list, data, and accessors should live in focused files under marketing data.

Large scratchpad files may be split where the boundary is already clear. Useful examples include attachment preview rendering, card interaction helpers, workspace gesture helpers, and component-local constants. Splits should preserve behavior and avoid broad rewrites.

## Data Flow

Public pages continue to read static marketing data, MDX/Fumadocs sources, and content metadata at build time. Docs, blog, changelog, sitemap, and Open Graph routes should behave exactly as before after imports move.

`/api/search` remains public and continues to search documentation content.

`/scratchpad` remains public at the same URL, but its route files live under `(tools)`. It remains a client-side tool that stores local state and talks to a user-provided external Memos instance. It must not become the seed of the future authenticated product app.

## Error Handling

User-visible error semantics must remain unchanged. Existing `notFound()` behavior, search responses, social preview fallbacks, scratchpad connection errors, and external Memos compatibility errors should not change.

No new auth or database errors should exist after this cleanup because no auth or database runtime code is being added.

## Verification

Required verification:

```bash
pnpm lint
pnpm build
```

Additional verification when time permits:

```bash
pnpm run preview
SMOKE_BASE_URL=http://localhost:8788 pnpm run smoke
```

`pnpm build` is the critical check because it exercises route moves, metadata, static generation, Fumadocs source imports, sitemap generation, and Open Graph routes.

## Acceptance Criteria

- All existing URLs continue to resolve.
- No Clerk, D1, new runtime service, new Cloudflare binding, or new environment variable is introduced.
- Route files are grouped under `(public)`, `(tools)`, future `(auth)`, and future `(app)` boundaries.
- Scratchpad lives under `(tools)` and its code lives under `src/features/scratchpad`.
- Marketing, docs, editorial, scratchpad, shared, server, and types folders exist with clear ownership.
- No source files remain directly under the old broad `src/components` or `src/lib` roots; code is moved into feature-owned or shared folders.
- Imports are updated directly to new paths with no compatibility shims.
- Lint and production build pass.
