# SEO Program — Design & Plan

- **Date:** 2026-06-16
- **Owner:** boojack
- **Source data:** Google Search Console export, last 28 days (`usememos.com-Performance-on-Search-2026-06-16/`)
- **Integration:** one batch committed directly to `main` (no PR, per owner decision)

## Context (what the data says)

Last 28 days: ~4,236 clicks / ~187.5k impressions / 2.26% CTR / avg pos ~7.
Over the window, impressions roughly halved while average position improved 8.9 → 5.3 and
CTR more than doubled — junk impressions churned out, real footprint improved. Not a decline.

Key findings driving this work:

1. **`open source note taking apps` — 69,711 impressions, position 10.3, 0 clicks.** ~37% of all
   impressions. Listicle/plural intent; we're a single product at the page-1/2 boundary. The
   homepage title does not contain the phrase "note-taking app," so we are barely relevant to it.
2. **"MemOS" name collision** with the AI-memory research paper (arxiv 2507.03724, openmem.net):
   thousands of wrong-intent impressions, ~0 clicks. Unwinnable noise that drags aggregate CTR down.
3. **Brand term `memos`** (25,079 impressions) sits at position 3.9 — we don't own our own SERP
   because "memos" is a common English word.
4. **No comparison/alternative pages** despite real demand (`joplin vs memos`, `memos vs obsidian`,
   `google keep alternative open source`, `evernote open source alternative`).
5. **High-rank, low-CTR pages:** `/features` (0.21% @ 4.5), `/changelog` (0.17% @ 3.5),
   `/docs` (0.53% @ 4.75) — title/snippet problems, not ranking problems.
6. **Index bloat:** every versioned API-doc tree (`0-26-2`, `0-27-1`, `0-28-0`, `0-29-1`, `latest`)
   is separately indexed — hundreds of near-duplicate pages diluting authority.

Already solid (do not redo): metadata factory (`src/shared/lib/seo.ts`), canonicals, OG/Twitter,
four JSON-LD blocks (SoftwareApplication, Organization, WebSite, SiteNavigation) in `layout.tsx`,
prioritized `sitemap.ts`, `robots.txt`, `/scratchpad` already `noindex`, `metadata-title-audit`.

## Decisions

- **Brand vs SEO: blend.** On-page hero copy stays unchanged ("Capture first. Keep it yours.").
  Only SERP-facing strings (title tag, meta description) adopt the "self-hosted note-taking app"
  descriptor.
- **Keep both honest-caveat items:** the homepage FAQ schema (limited rich-result value post-2023,
  but helps question-query ranking + AI answers) and the low-CTR title/description rewrites
  (modest lift, near-free).
- **`/compare` slugs:** `obsidian`, `joplin`, `notion`, `google-keep`, `evernote`.

## Goals

- Make the homepage *relevant* for the "(open-source / self-hosted) note-taking app" descriptor.
- Capture comparison/alternative demand we currently have no pages for.
- Recover CTR on high-rank pages via better titles/descriptions + structured data.
- Concentrate crawl/authority by removing indexed API-doc duplicates.

## Non-goals

- Chasing the listicle intent of `open source note taking apps` with a fake "best apps" page.
- Changing visible homepage positioning/voice.
- Trying to capture the "MemOS" AI-paper traffic (wrong product).

## Workstreams

### 1. Homepage metadata blend
- `src/app/(public)/page.tsx`: `title.absolute` →
  `Memos – Open-Source, Self-Hosted Note-Taking App`; description →
  `Memos is an open-source, self-hosted note-taking app — a Markdown-native timeline for quick notes, daily logs, and snippets. Self-host with Docker in minutes; private and free.`
- `src/app/layout.tsx`: align the root default `description` + OG/Twitter description with the
  blended copy (keeps non-home pages consistent). Default title template unchanged.

### 2. Homepage FAQ section + FAQPage schema
- New marketing component rendering a visible Q&A block on the homepage.
- Questions: Is Memos free? Can I self-host Memos? Does Memos support Markdown? Is Memos a good
  open-source alternative to Google Keep / Notion / Evernote? Is my data private?
- `FAQPage` JSON-LD built from the same data (single source of truth).

### 3. `/compare` demand-capture pages
- Mirror the `use-cases` data module: `src/features/marketing/data/comparisons/`
  (`data.ts`, `slugs.ts`, `types.ts`, `index.ts`).
- Routes: `/compare` index + `/compare/[slug]` detail (`generateStaticParams`,
  `generateMetadata`, `MarketingPageHero`, breadcrumb JSON-LD), `force-static`.
- Each page written to target both "Memos vs X" and "open-source X alternative"; honest
  comparison table + "when to choose which."
- Add to `sitemap.ts`; link from homepage Discover section + footer.
- Tests mirroring `data/catalog.test.ts` (every slug resolves, metadata present, no dupes).

### 4. Low-CTR title/description rewrites
- `src/app/(public)/features/page.tsx`, `src/app/(public)/changelog/page.tsx`, and the `/docs`
  landing metadata: benefit-driven, keyword-aware titles/descriptions. No brand in `title`
  (root template adds "- Memos"; respects `metadata-title-audit`).

### 5. Index hygiene
- `src/app/(public)/docs/[...slug]/page.tsx` `generateMetadata`: add `robots: { index: false, follow: true }`
  for API-doc pages whose version !== `latestApiDocsVersion`.
- `src/app/sitemap.ts`: drop non-latest API-doc pages from the sitemap.

## Quality gates

- `pnpm lint` (biome + `metadata-title-audit` + `static-revalidate-audit`) green.
- `pnpm test` (vitest) green; new tests for the comparisons module and any new seo helpers.
- All new routes `export const dynamic = "force-static"`.

## Risks / watch-items

- **Cannibalization:** homepage and `/compare` could compete. Mitigated by keeping homepage on the
  brand+descriptor and `/compare` on comparison/alternative intent.
- **noindex correctness:** ensure only *non-latest* API versions are noindexed; `latest` stays
  indexable and in the sitemap.
- **No clean attribution** (one-batch choice): can't isolate which change moved which metric.
  Accepted by owner.

## Implementation checklist (ordered)

1. [ ] Homepage metadata blend (`page.tsx` + `layout.tsx`).
2. [ ] Homepage FAQ data + component + `FAQPage` JSON-LD + render on home.
3. [ ] `comparisons` data module + types + slugs + tests.
4. [ ] `/compare` index + `/compare/[slug]` routes.
5. [ ] Sitemap entries + internal links for `/compare`.
6. [ ] Low-CTR rewrites (`features`, `changelog`, `docs`).
7. [ ] Index hygiene (docs `[...slug]` noindex + sitemap exclusion of non-latest API).
8. [ ] `pnpm lint` + `pnpm test` green; commit to `main`.
