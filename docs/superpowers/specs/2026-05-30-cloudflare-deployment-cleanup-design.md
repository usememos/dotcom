# Cloudflare Deployment Cleanup Design

## Context

The site has migrated from Vercel to Cloudflare Workers through `@opennextjs/cloudflare`. The repository should now treat Cloudflare as the only production deployment target. The cleanup should improve maintainability by removing ambiguous deployment naming and making future contributors run the correct production checks.

## Goals

- Make default deployment scripts point to the Cloudflare Workers path.
- Avoid redundant `cf` suffixes when Cloudflare is the only deployment target.
- Remove old deployment ambiguity instead of keeping compatibility aliases.
- Improve CI confidence by validating the Cloudflare build output, not only the local Next.js build.
- Keep website behavior and routing unchanged.

## Non-Goals

- No framework migration.
- No static export conversion.
- No runtime route refactor.
- No Open Graph rendering redesign.
- No compatibility layer for Vercel or earlier script names.

## Proposed Changes

### Package Scripts

Keep `build` as the standard framework build because it remains useful for Next.js validation. Make the production-oriented scripts generic and Cloudflare-backed:

- `preview`: build with OpenNext and run the Worker preview.
- `deploy`: build with OpenNext and deploy with Wrangler.
- `deploy:dry-run`: build with OpenNext and run a Wrangler dry run.
- `smoke`: run the smoke test script.
- `typegen`: generate Wrangler environment types.

Remove `smoke:cf` and `cf-typegen`. Rename the smoke test file from `scripts/cf-smoke-test.mjs` to `scripts/smoke-test.mjs`.

### CI

Keep linting and the regular Next.js build. Add a Cloudflare deployment validation step that runs the dry-run deployment script. This checks the OpenNext output and Wrangler packaging before changes merge.

### Documentation

Update `AGENTS.md` and `CLAUDE.md` so they describe Cloudflare Workers as the production path. Mention that `pnpm start` is only for local Node.js production serving and not the production deployment path.

### Runtime Behavior

Do not change app routes, metadata, generated content, cache settings, or public URLs. The cleanup is operational only.

## Verification

- `pnpm lint`
- `pnpm build`
- `pnpm run deploy:dry-run`

If a Worker preview is started, run:

- `SMOKE_BASE_URL=http://localhost:8788 pnpm run smoke`

For production after deploy, run:

- `SMOKE_BASE_URL=https://usememos.com pnpm run smoke`
