# Docs Restructure for Readability — Design

Date: 2026-06-10
Status: Approved (pending spec review)

## Goal

Make the documentation under `content/docs/` better structured and easier to read and understand, without renaming sections or breaking URLs (redirects where a URL must change).

## Background / Problems found

1. `deploy/development.mdx` ("Build From Source") duplicates `development/setup.mdx` and `development/building.mdx` (same prerequisites and build commands). Duplicated content will drift.
2. `getting-started/` is a folder containing only `index.mdx` — needless sidebar nesting for the most-visited page.
3. `troubleshooting/` is a 10-line index wrapping a single 38-line `common-issues.mdx` page.
4. `admin/tokens.mdx` is three sentences and describes a user-level feature (personal access tokens are managed in user settings), not an admin one. The API section is pure generated reference with no prose on-ramp.
5. Top-level section order does not follow the reader journey: Development (contributor docs) sits mid-list; Admin is stranded after Integrations.
6. Content gap: no upgrade guide exists anywhere.

## Changes

### 1. Reorder top-level sections (`content/docs/meta.json`)

New order:

```
index, getting-started, deploy, configuration, admin, usage,
integrations, operations, troubleshooting, faq, api, development
```

Journey: install → configure → administer → use daily → connect → run long-term → fix problems → look up → contribute.

### 2. Flatten Getting Started

- Move `content/docs/getting-started/index.mdx` → `content/docs/getting-started.mdx`.
- Delete `content/docs/getting-started/` (including its `meta.json`).
- URL `/docs/getting-started` is unchanged.

### 3. Flatten Troubleshooting

- Merge `troubleshooting/common-issues.mdx` content into a single `content/docs/troubleshooting.mdx` (keep the FAQ-like H2-per-problem format).
- Delete `content/docs/troubleshooting/`.
- Add redirect: `/docs/troubleshooting/common-issues` → `/docs/troubleshooting` in `next.config.mjs` (`redirects()`).

### 4. Deduplicate Build From Source

- Rewrite `content/docs/deploy/development.mdx` to cover only the deploy-specific story: producing a release build and running the self-built binary in production.
- Link to `/docs/development/setup` and `/docs/development/building` for toolchain and build instructions instead of copying them.
- URL and sidebar position stay the same.

### 5. Replace `admin/tokens.mdx` with "API Access" under Integrations

- New page `content/docs/integrations/api-access.mdx`: personal access tokens (creation in user settings, `memos_pat_` prefix, shown once), bearer auth header, a curl example, links into `/docs/api` reference and `/docs/configuration/security` token model.
- Remove `tokens` from `admin/meta.json`; delete `admin/tokens.mdx`. Admin keeps `instance-settings` and `users-roles`.
- Add redirect: `/docs/admin/tokens` → `/docs/integrations/api-access`.
- Update `integrations/meta.json` and the Integrations index cards.

### 6. Add Upgrade guide under Operations

- New page `content/docs/operations/upgrade.mdx`: backup first (link to backup-restore), upgrade steps per method (Docker, Docker Compose, binary), version pinning vs `:stable`, checking the changelog for breaking changes before major upgrades.
- Add to `operations/meta.json` and Operations index cards.

### 7. Docs landing page pass

- Update `content/docs/index.mdx` "Popular Paths" and "Browse All Docs" cards to match the new section order and any changed link targets.

## Out of scope

- Renaming top-level sections or regrouping into fewer sections (considered, rejected: breaks every URL for marginal gain).
- Blog, changelog, and generated API reference content.
- New content beyond the Upgrade guide and API Access page.

## Error handling / risks

- Broken internal links after flattening: grep `content/` and `src/` for `/docs/troubleshooting/common-issues`, `/docs/admin/tokens`, and `/docs/getting-started` references; fix or redirect.
- Redirects must work on Cloudflare Workers via OpenNext: `redirects()` in `next.config.mjs` is supported; verify with `pnpm run preview` if in doubt.
- `pnpm build` statically generates all pages — a missing page or bad meta.json entry fails the build, which acts as the safety net.

## Verification

- `pnpm lint` (Biome + metadata audit) and `pnpm build` pass.
- Sidebar shows the new order; flattened pages render at their original URLs.
- Old URLs `/docs/troubleshooting/common-issues` and `/docs/admin/tokens` redirect correctly.
- Confirm `src/app/sitemap.ts` picks up the new/moved docs pages automatically (it should, via the Fumadocs source); update it only if docs URLs are hardcoded there.
