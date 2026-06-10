# Docs Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure `content/docs/` so sections follow the reader journey, duplicated/misplaced pages are fixed, and the missing Upgrade and API Access guides exist.

**Architecture:** This is a Fumadocs + Next.js 16 static docs site. Sidebar order is controlled by `meta.json` files; a folder with `index.mdx` and a flat `name.mdx` file serve the same URL, so flattening one-page sections is URL-stable. Removed URLs get `redirects()` entries in `next.config.mjs`.

**Tech Stack:** Next.js 16, Fumadocs, MDX, pnpm. No test suite — verification is `pnpm lint` and `pnpm build` (build statically generates every page and fails on missing pages or broken meta.json entries).

**Spec:** `docs/superpowers/specs/2026-06-10-docs-restructure-design.md`

**Conventions (from AGENTS.md):** use `pnpm`; never edit `.source/`; full build is slow, so run it once at the end, not per task.

---

### Task 1: Commit the pending deploy-section reorder

The working tree already contains an earlier, related change (deploy cards/bullets reordered Docker → Compose → Binary). Commit it first so later tasks have a clean baseline.

**Files:**
- Already modified: `content/docs/deploy/index.mdx`, `content/docs/deploy/meta.json`

- [ ] **Step 1: Verify only those two files are dirty**

Run: `git status --porcelain`
Expected output (exactly):

```
 M content/docs/deploy/index.mdx
 M content/docs/deploy/meta.json
```

If other files appear, stop and ask the user.

- [ ] **Step 2: Commit**

```bash
git add content/docs/deploy/index.mdx content/docs/deploy/meta.json
git commit -m "docs(deploy): order methods by recommendation

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Reorder top-level sections by reader journey

**Files:**
- Modify: `content/docs/meta.json`

- [ ] **Step 1: Replace the `pages` array**

Replace the entire file content with:

```json
{
  "title": "Documentation",
  "pages": [
    "index",
    "getting-started",
    "deploy",
    "configuration",
    "admin",
    "usage",
    "integrations",
    "operations",
    "troubleshooting",
    "faq",
    "api",
    "development"
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add content/docs/meta.json
git commit -m "docs: reorder top-level sections by reader journey

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Flatten Getting Started to a single page

The folder contains only `index.mdx`. A flat `getting-started.mdx` serves the same `/docs/getting-started` URL. Content is moved verbatim — do not edit it.

**Files:**
- Move: `content/docs/getting-started/index.mdx` → `content/docs/getting-started.mdx`
- Delete: `content/docs/getting-started/meta.json` (and the now-empty folder)

- [ ] **Step 1: Move the page and delete the folder**

```bash
git mv content/docs/getting-started/index.mdx content/docs/getting-started.mdx
git rm content/docs/getting-started/meta.json
```

- [ ] **Step 2: Verify the folder is gone and the page exists**

Run: `ls content/docs/getting-started.mdx && ls content/docs/getting-started 2>&1`
Expected: first `ls` prints the file path; second prints `No such file or directory`.

- [ ] **Step 3: Commit**

```bash
git commit -m "docs(getting-started): flatten one-page section

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: Flatten Troubleshooting into a single merged page

Merge the 38-line `common-issues.mdx` into a flat `troubleshooting.mdx`. The old child URL gets a redirect in Task 8.

**Files:**
- Create: `content/docs/troubleshooting.mdx`
- Delete: `content/docs/troubleshooting/index.mdx`, `content/docs/troubleshooting/common-issues.mdx`, `content/docs/troubleshooting/meta.json`

- [ ] **Step 1: Create `content/docs/troubleshooting.mdx`**

Exact content (sections carried over from `common-issues.mdx` unchanged):

```mdx
---
title: Troubleshooting
description: Common startup, storage, database, and proxy problems and how to fix them.
---

Work through the section that matches your symptom. Most problems trace back to ports, file permissions, database connection strings, or proxy headers.

## Port already in use

Change the port with `--port` or `MEMOS_PORT` and restart the server.

## Cannot write to the data directory

Ensure the data directory exists and is writable by the Memos process. You can set it with `--data` or `MEMOS_DATA`.

## Database connection errors

Verify the driver and DSN:

- `MEMOS_DRIVER` should be `sqlite`, `mysql`, or `postgres`.
- `MEMOS_DSN` should use the correct DSN format for your database.

## Reverse proxy issues

If you run behind a reverse proxy, make sure:

- `MEMOS_INSTANCE_URL` matches the public URL
- the proxy forwards standard headers (`Host`, `X-Forwarded-*`)

## Docker starts but the app does not respond

Check:

- `docker logs memos`
- whether the host port is already occupied
- whether the mounted data directory is writable

## Attachments are missing after migration

Confirm which storage backend the instance uses. If attachments are stored outside the database, they must be migrated and backed up separately.

## Still stuck?

Check the [FAQ](/docs/faq) or search [GitHub issues](https://github.com/usememos/memos/issues).
```

- [ ] **Step 2: Delete the folder**

```bash
git rm -r content/docs/troubleshooting
git add content/docs/troubleshooting.mdx
```

- [ ] **Step 3: Commit**

```bash
git commit -m "docs(troubleshooting): merge into single page

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: Deduplicate Build From Source

`deploy/development.mdx` currently copies the toolchain list and build commands from `development/setup.mdx` and `development/building.mdx`. Rewrite it to keep only the deploy-specific story and link to the Development section for the rest. URL and sidebar position are unchanged.

**Files:**
- Rewrite: `content/docs/deploy/development.mdx`

- [ ] **Step 1: Replace the entire file content**

```mdx
---
title: Build From Source
description: Produce your own Memos build and run it as a deployment.
---

Build from source when you deploy a fork, a custom patch, or a build pinned to an exact revision. If you want to work on the Memos codebase itself, start with the [Development](/docs/development) section instead — this page only covers turning a source build into a deployment.

## Produce a release build

Follow [Setup](/docs/development/setup) for the toolchain, then [Building](/docs/development/building) for the build commands. A release build embeds the frontend assets into a single binary, so the result deploys exactly like a downloaded release.

For deployments, always build from a tagged or pinned revision rather than `main`:

```bash
git clone https://github.com/usememos/memos.git
cd memos
git checkout v0.26.2  # pin the version you intend to run
```

## Run the result as a deployment

The self-built binary behaves like the official release binary. Memos listens on `http://localhost:8081` by default.

Follow the [Binary](/docs/deploy/binary) guide for the production concerns:

- process supervision (systemd or similar)
- data directory ownership and permissions
- reverse proxy and HTTPS

## Before production use

- set explicit environment variables for instance URL and database
- run a smoke test against the new binary before switching traffic
- keep a backup before deploying a new build — see [Backup & Restore](/docs/operations/backup-restore)
```

- [ ] **Step 2: Verify the duplicated toolchain list is gone**

Run: `grep -c "pnpm 10" content/docs/deploy/development.mdx`
Expected: `0`

- [ ] **Step 3: Commit**

```bash
git add content/docs/deploy/development.mdx
git commit -m "docs(deploy): dedupe Build From Source against Development section

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6: Replace admin/tokens with an API Access page under Integrations

`admin/tokens.mdx` is three sentences describing a user-level feature. Replace it with a real API on-ramp page. Token facts (prefix, one-time display) come from `content/docs/configuration/security.mdx` — they are already verified there.

**Files:**
- Create: `content/docs/integrations/api-access.mdx`
- Modify: `content/docs/integrations/meta.json`, `content/docs/integrations/index.mdx`
- Delete: `content/docs/admin/tokens.mdx`
- Modify: `content/docs/admin/meta.json`, `content/docs/admin/index.mdx`
- Modify: `content/docs/integrations/mcp.mdx` (two links to the old URL)

- [ ] **Step 1: Create `content/docs/integrations/api-access.mdx`**

```mdx
---
title: API Access
description: Authenticate against the Memos API with personal access tokens.
---

Every Memos feature is available over the API. To call it programmatically, create a personal access token and send it as a Bearer credential.

## Create a personal access token

Create and revoke tokens from your **user settings** in the app. Tokens use the `memos_pat_` prefix, and the plain token value is shown only once at creation — store it somewhere safe.

Tokens are scoped to your user: API calls made with a token can do what your user can do.

## Call the API

Pass the token in the `Authorization` header:

```bash
curl -H "Authorization: Bearer memos_pat_..." \
  https://memos.example.com/api/v1/memos
```

## Where to go next

- [API Reference](/docs/api) — every service and method, REST and gRPC
- [Webhooks](/docs/integrations/webhooks) — push events instead of polling
- [MCP Server](/docs/integrations/mcp) — connect AI assistants using the same tokens
- [Security](/docs/configuration/security) — the full token security model
```

- [ ] **Step 2: Update `content/docs/integrations/meta.json`**

Replace file content with:

```json
{
  "title": "Integrations",
  "description": "Connect Memos with third-party services and tools",
  "pages": ["index", "api-access", "mcp", "rss", "telegram-bot", "webhooks"]
}
```

- [ ] **Step 3: Add the card to `content/docs/integrations/index.mdx`**

Insert this card as the FIRST card inside `<Cards>` (before the MCP Server card):

```mdx
  <Card title="API Access" href="/docs/integrations/api-access" icon="Key">
    Authenticate API calls with personal access tokens.
  </Card>
```

- [ ] **Step 4: Remove the admin tokens page**

```bash
git rm content/docs/admin/tokens.mdx
```

Replace `content/docs/admin/meta.json` content with:

```json
{
  "title": "Admin",
  "description": "Instance administration and user management",
  "pages": ["index", "instance-settings", "users-roles"]
}
```

In `content/docs/admin/index.mdx`, delete the Tokens card (these three lines):

```mdx
  <Card title="Tokens" href="/docs/admin/tokens" icon="Key">
    Manage personal access tokens.
  </Card>
```

- [ ] **Step 5: Update the two links in `content/docs/integrations/mcp.mdx`**

Line 16: change `[personal access token](/docs/admin/tokens)` to `[personal access token](/docs/integrations/api-access)`.

Line 47: change `See [Tokens](/docs/admin/tokens).` to `See [API Access](/docs/integrations/api-access).`

- [ ] **Step 6: Verify no doc page still links to the old URL**

Run: `grep -rn "admin/tokens" content/docs/`
Expected: no output. (A link remains in `content/changelog/0-15-0.mdx`; leave it — the Task 8 redirect covers it, and changelog entries are historical.)

- [ ] **Step 7: Commit**

```bash
git add content/docs/integrations content/docs/admin
git commit -m "docs: replace admin tokens stub with API Access integration guide

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 7: Add the Upgrade guide under Operations

**Files:**
- Create: `content/docs/operations/upgrade.mdx`
- Modify: `content/docs/operations/meta.json`, `content/docs/operations/index.mdx`

- [ ] **Step 1: Create `content/docs/operations/upgrade.mdx`**

```mdx
---
title: Upgrade
description: Upgrade Memos safely across Docker, Docker Compose, and binary deployments.
---

Memos applies database migrations automatically on startup, so an upgrade is: back up, replace the version, start, verify. Downgrading after a migration has run is not supported — your backup is the rollback path.

## Before every upgrade

1. Back up the database and attachments — see [Backup & Restore](/docs/operations/backup-restore).
2. Read the [changelog](/changelog) for the versions you are skipping, especially across minor versions (0.x → 0.y), which can contain breaking changes.
3. Note your current version so you can report it if something goes wrong.

## Docker

```bash
docker pull neosmemo/memos:stable
docker stop memos
docker rm memos
# re-run your original docker run command — the data volume keeps your data
```

The exact `docker run` flags are in the [Docker guide](/docs/deploy/docker).

## Docker Compose

```bash
docker compose pull
docker compose up -d
```

## Binary

1. Stop the service (`systemctl stop memos` or your supervisor's equivalent).
2. Replace the binary with the new release from [GitHub releases](https://github.com/usememos/memos/releases).
3. Start the service and watch the logs for migration output.

See the [Binary guide](/docs/deploy/binary) for service setup.

## Pinning versions

`neosmemo/memos:stable` tracks the latest stable release, which is convenient but upgrades implicitly on every pull. For production, pin a specific version tag (for example `neosmemo/memos:0.26.2`) and upgrade deliberately.

## Verify after upgrading

- the UI loads and you can sign in
- a new memo can be created and an existing one opens
- attachments load (storage config survived the upgrade)

## Rolling back

Restore the pre-upgrade backup and start the previous version. Do not point an old version at a database that a newer version has already migrated.
```

- [ ] **Step 2: Update `content/docs/operations/meta.json`**

Replace file content with:

```json
{
  "title": "Operations",
  "description": "Architecture, backup, upgrade, and performance guidance for operating Memos",
  "pages": ["index", "architecture", "backup-restore", "upgrade", "performance-tuning"]
}
```

- [ ] **Step 3: Add the card to `content/docs/operations/index.mdx`**

Note: Card icon names must exist in the string-to-component map in `src/shared/ui/card.tsx` (an explicit import list — unknown names render no icon). `RefreshCw` and `Key` are both already mapped; if you change any icon in this plan, check that file first.

Insert after the Backup & Restore card, before the Performance Tuning card:

```mdx
  <Card title="Upgrade" href="/docs/operations/upgrade" icon="RefreshCw">
    Upgrade safely with backups, pinned versions, and a rollback plan.
  </Card>
```

- [ ] **Step 4: Commit**

```bash
git add content/docs/operations
git commit -m "docs(operations): add upgrade guide

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 8: Add redirects for the two removed URLs

**Files:**
- Modify: `next.config.mjs`

- [ ] **Step 1: Add a `redirects()` method to the config object**

In `next.config.mjs`, inside the `config` object (directly before `async headers() {`), add:

```js
  async redirects() {
    return [
      {
        source: "/docs/troubleshooting/common-issues",
        destination: "/docs/troubleshooting",
        permanent: true,
      },
      {
        source: "/docs/admin/tokens",
        destination: "/docs/integrations/api-access",
        permanent: true,
      },
    ];
  },
```

- [ ] **Step 2: Commit**

```bash
git add next.config.mjs
git commit -m "docs: redirect removed troubleshooting and tokens URLs

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 9: Update the docs landing page

Reorder "Browse All Docs" to match the new sidebar order and add the missing FAQ card. "Popular Paths" links are all still valid — leave that section unchanged.

**Files:**
- Modify: `content/docs/index.mdx`

- [ ] **Step 1: Replace the "Browse All Docs" `<Cards>` block**

Replace everything from `## Browse All Docs` to the end of the file with:

```mdx
## Browse All Docs

<Cards>
  <Card title="Getting Started" href="/docs/getting-started" icon="Play">
    Deploy Memos quickly and create your first memo.
  </Card>
  <Card title="Deploy" href="/docs/deploy" icon="Container">
    Run Memos with Docker, Compose, source builds, or Kubernetes.
  </Card>
  <Card title="Configuration" href="/docs/configuration" icon="Settings">
    Configure runtime flags, database, storage, authentication, and security.
  </Card>
  <Card title="Admin" href="/docs/admin" icon="Shield">
    Instance settings and user management.
  </Card>
  <Card title="Usage" href="/docs/usage" icon="FileText">
    Write memos in Markdown, organize with tags, and work faster with shortcuts.
  </Card>
  <Card title="Integrations" href="/docs/integrations" icon="Puzzle">
    API access, RSS, webhooks, and community tools.
  </Card>
  <Card title="Operations" href="/docs/operations" icon="Network">
    Plan backups, upgrade safely, and tune production performance.
  </Card>
  <Card title="Troubleshooting" href="/docs/troubleshooting" icon="HelpCircle">
    Common issues and fixes.
  </Card>
  <Card title="FAQ" href="/docs/faq" icon="HelpCircle">
    Quick answers about licensing, data, and limits.
  </Card>
  <Card title="API" href="/docs/api" icon="Terminal">
    REST and gRPC API reference.
  </Card>
  <Card title="Development" href="/docs/development" icon="Code">
    Set up a local environment, build Memos, test changes, and contribute.
  </Card>
</Cards>
```

- [ ] **Step 2: Commit**

```bash
git add content/docs/index.mdx
git commit -m "docs: align landing page cards with new section order

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 10: Full verification

**Files:** none (verification only; fix anything found and amend the relevant commit or add a fixup commit)

- [ ] **Step 1: Check for stale internal links**

```bash
grep -rn "troubleshooting/common-issues\|admin/tokens" content/docs/ src/
```

Expected: no output.

- [ ] **Step 2: Confirm sitemap doesn't hardcode removed docs URLs**

```bash
grep -n "docs/" src/app/sitemap.ts | grep -v "docs.getPages\|source" || echo "no hardcoded docs urls"
```

Expected: either `no hardcoded docs urls` or only entries that still exist. If `/docs/admin/tokens` or `/docs/troubleshooting/common-issues` appear, remove those entries.

- [ ] **Step 3: Lint**

Run: `pnpm lint`
Expected: exits 0.

- [ ] **Step 4: Build**

Run: `pnpm build` (slow — generates hundreds of static pages)
Expected: exits 0. A missing page, broken meta.json entry, or bad MDX fails here.

- [ ] **Step 5: Spot-check routes in the build output**

The build log lists generated routes. Confirm these appear:

- `/docs/getting-started`
- `/docs/troubleshooting`
- `/docs/integrations/api-access`
- `/docs/operations/upgrade`

And these do NOT appear:

- `/docs/troubleshooting/common-issues`
- `/docs/admin/tokens`

- [ ] **Step 6: Commit any fixes**

If steps 1–5 required changes, commit them:

```bash
git add -A
git commit -m "docs: fix stragglers from restructure

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```
