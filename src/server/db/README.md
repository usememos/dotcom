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
