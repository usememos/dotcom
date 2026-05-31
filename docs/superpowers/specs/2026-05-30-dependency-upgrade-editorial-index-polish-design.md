# Dependency Upgrade and Editorial Index Polish Design

## Context

The site is a Next.js 16 static marketing and documentation app for Memos. Blog and changelog content is file-based MDX loaded through Fumadocs. The `/blog` and `/changelog` list pages currently use similar page shells and separate list item components, but their spacing, metadata placement, type scale, and empty states have drifted.

`pnpm outdated` shows both minor and major dependency updates are available. The project owner wants to attempt upgrading all dependencies to their latest versions and fix any resulting breakage.

## Goals

- Upgrade project dependencies to their latest available versions.
- Resolve compatibility issues caused by those upgrades.
- Polish `/blog` and `/changelog` list pages so they feel like one editorial system.
- Preserve each page's content model and purpose.
- Keep the site static, file-based, and aligned with existing App Router and Fumadocs patterns.

## Non-Goals

- Add filters, search, pagination, or archive grouping to the blog or changelog pages.
- Redesign article detail pages.
- Change generated `.source/` files directly.
- Change the Cloudflare deployment model.
- Add external services, databases, or environment variables.

## Dependency Upgrade Design

Run a full latest-version dependency upgrade with `pnpm update --latest`. Treat resulting errors as migration work. Prefer fixing source compatibility, type issues, generated content requirements, and config changes over reverting upgrades.

If one latest dependency release is incompatible in a way that cannot be resolved in reasonable scope, pin only that package to the newest working version and document the reason in the implementation summary.

Expected risk areas:

- Fumadocs and Fumadocs MDX API or type changes.
- Shiki major version behavior.
- TypeScript 6 type checking differences.
- React and React DOM patch updates.
- Lucide React major version export or type changes.
- Biome rule or formatter changes.
- Tailwind 4 patch/minor changes.

## Editorial Index Design

Create a small shared editorial index layer for the blog and changelog list pages. The exact file boundaries can follow the existing component structure, but the intended responsibilities are:

- Shared page header: breadcrumbs, eyebrow, title, description, optional summary metadata.
- Shared list wrapper: consistent vertical rhythm and responsive spacing.
- Shared list item shell: consistent hover surface, padding, title scale, description style, metadata placement, CTA row, and dark mode behavior.
- Shared empty state: consistent icon container, heading, copy, and spacing.

Blog-specific behavior remains in the blog page:

- Source records from `blogSource`.
- Sort by `published_at` descending.
- Show tags when present.
- Use `formatBlogDate`.
- Use `Read article` CTA text.

Changelog-specific behavior remains in the changelog page:

- Source records from `changelogSource`.
- Sort with semantic version ordering.
- Derive display version with `getChangelogVersion`.
- Show release date when present.
- Show `Latest` and `Breaking` labels where applicable.
- Use `Read release` CTA text.

## UI Requirements

- `/blog` and `/changelog` should have matching header proportions, section padding, list spacing, cardless hover treatment, title sizing, description width, metadata styling, CTA styling, and empty state layout.
- Keep the current restrained editorial tone: white or zinc backgrounds, serif display headings, neutral text colors, subtle borders, and simple hover states.
- Do not introduce decorative gradients, nested cards, large marketing heroes, or new visual assets for these index pages.
- Preserve accessibility expectations: list items are links, metadata remains readable, icons are decorative unless needed semantically, and text must not overlap or overflow on mobile.

## Data Flow

Each page keeps its own static data preparation:

1. Load pages from the relevant Fumadocs source.
2. Sort using the existing blog or changelog helper.
3. Map records into the shared editorial list item props.
4. Render the shared header, list, and empty state.

No client-side state, runtime fetching, or environment configuration is needed.

## Verification

Run:

- `pnpm lint`
- `pnpm build`

If dependency upgrades require regenerated MDX/Fumadocs output, run the relevant generation command and review generated changes before keeping them.

## Rollback Criteria

Rollback or pin a specific dependency only if the latest version creates an incompatibility that requires unrelated architectural changes, unsupported runtime behavior, or broad content rewrites outside this task's scope.
