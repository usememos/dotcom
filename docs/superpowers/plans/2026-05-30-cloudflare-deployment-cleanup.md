# Cloudflare Deployment Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Cloudflare Workers the only production deployment path in scripts, CI, and agent documentation.

**Architecture:** Keep the application runtime unchanged. Rename operational commands to generic production names backed by OpenNext/Wrangler, validate the Cloudflare package in CI, and align documentation with the new command contract.

**Tech Stack:** Next.js 16, OpenNext for Cloudflare, Wrangler, pnpm, GitHub Actions, Biome.

---

## File Structure

- Modify `package.json`: replace Cloudflare-suffixed scripts with generic production scripts.
- Rename `scripts/cf-smoke-test.mjs` to `scripts/smoke-test.mjs`: preserve smoke behavior under the generic script name.
- Modify `.github/workflows/ci.yml`: add Cloudflare dry-run deployment validation after the regular build.
- Modify `AGENTS.md`: update quick-reference commands and clarify production deploy/preview behavior.
- Modify `CLAUDE.md`: update command examples and clarify that `pnpm start` is not the Cloudflare production path.

## Tasks

### Task 1: Rename Operational Scripts

**Files:**
- Modify: `package.json`
- Rename: `scripts/cf-smoke-test.mjs` -> `scripts/smoke-test.mjs`

- [x] **Step 1: Rename the smoke test file**

Run:

```bash
mv scripts/cf-smoke-test.mjs scripts/smoke-test.mjs
```

Expected: `scripts/smoke-test.mjs` exists and `scripts/cf-smoke-test.mjs` does not.

- [x] **Step 2: Update package scripts**

Change the scripts block so these entries exist:

```json
{
  "build": "next build",
  "dev": "next dev --turbo",
  "start": "next start",
  "preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview",
  "deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy",
  "deploy:dry-run": "opennextjs-cloudflare build && wrangler deploy --dry-run",
  "typegen": "wrangler types --env-interface CloudflareEnv cloudflare-env.d.ts",
  "smoke": "node scripts/smoke-test.mjs",
  "og:audit": "node scripts/og-audit.mjs",
  "postinstall": "node scripts/generate-openapi.mjs && fumadocs-mdx && pnpm format",
  "lint": "biome check",
  "format": "biome format --write",
  "check": "biome check --write"
}
```

Expected: `smoke:cf` and `cf-typegen` are removed.

- [x] **Step 3: Check script references**

Run:

```bash
rg -n "smoke:cf|cf-typegen|cf-smoke-test" package.json scripts AGENTS.md CLAUDE.md .github
```

Expected: no matches after the docs are updated in later tasks.

### Task 2: Add Cloudflare Dry-Run Validation to CI

**Files:**
- Modify: `.github/workflows/ci.yml`

- [x] **Step 1: Add the dry-run step**

In the `build` job, after `pnpm build`, add:

```yaml
      - name: Validate Cloudflare deployment package
        run: pnpm run deploy:dry-run
```

Expected: CI validates both `next build` and the OpenNext/Wrangler deployment package.

### Task 3: Update Documentation

**Files:**
- Modify: `AGENTS.md`
- Modify: `CLAUDE.md`

- [x] **Step 1: Update `AGENTS.md` command references**

Use generic script names:

```markdown
- **Cloudflare preview**: `pnpm run preview` (OpenNext build + local Workers runtime)
- **Cloudflare deploy**: `pnpm run deploy` (OpenNext build + Cloudflare deploy)
- **Cloudflare dry run**: `pnpm run deploy:dry-run` (OpenNext build + Wrangler dry-run packaging)
- **Smoke test**: `SMOKE_BASE_URL=http://localhost:8788 pnpm run smoke`
```

Also clarify that `pnpm start` is not the Cloudflare production path.

- [x] **Step 2: Update `CLAUDE.md` Cloudflare section**

Use these examples:

```bash
# Preview the production Worker runtime locally
pnpm run preview

# Smoke test a running preview
SMOKE_BASE_URL=http://localhost:8788 pnpm run smoke

# Validate the deployment package without publishing
pnpm run deploy:dry-run

# Deploy to Cloudflare
pnpm run deploy
```

Add one sentence that `pnpm start` runs the local Next.js production server and should not be used to validate Cloudflare production behavior.

### Task 4: Verify Cleanup

**Files:**
- No source edits expected.

- [x] **Step 1: Check removed names**

Run:

```bash
rg -n "smoke:cf|cf-typegen|cf-smoke-test" package.json scripts AGENTS.md CLAUDE.md .github
```

Expected: no matches.

- [x] **Step 2: Run lint**

Run:

```bash
pnpm lint
```

Expected: exits 0.

- [x] **Step 3: Run framework build**

Run:

```bash
pnpm build
```

Expected: exits 0.

- [x] **Step 4: Run Cloudflare dry run**

Run:

```bash
pnpm run deploy:dry-run
```

Expected: exits 0. Known OpenNext duplicate-key warnings are acceptable if packaging succeeds.
