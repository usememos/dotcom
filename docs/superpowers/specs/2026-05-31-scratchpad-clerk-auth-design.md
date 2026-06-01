# Scratchpad Clerk Auth Design

## Summary

Introduce Clerk authentication as an optional identity layer for the scratchpad. The scratchpad remains usable without signing in. Signed-in users see their account identity in the existing Memos dropdown menu. Persistence of per-user instance settings is intentionally out of scope for this phase.

## Goals

- Add Clerk to the Next.js App Router application with middleware that is compatible with the Cloudflare/OpenNext production runtime.
- Keep `/scratchpad` public and preserve the current anonymous, browser-local workflow.
- Show a sign-in entry inside the existing scratchpad Memos dropdown for signed-out users.
- Show avatar and username inside the same dropdown for signed-in users.
- Establish a clean base for later database-backed instance settings keyed by Clerk user identity.

## Non-Goals

- Do not protect `/scratchpad` or redirect anonymous users.
- Do not add a database, settings API, or cloud sync.
- Do not migrate, namespace, or duplicate existing local scratchpad storage.
- Do not alter public marketing, docs, blog, pricing, or SEO routes beyond the shared Clerk provider setup.
- Do not add a persistent account control outside the existing Memos dropdown.

## Architecture

Install `@clerk/nextjs` and add `ClerkProvider` in `src/app/layout.tsx`. The provider wraps the existing `RootProvider` from Fumadocs so the current theme and docs behavior stays intact.

Add `src/middleware.ts` with Clerk's middleware matcher for app routes, API routes, and `/__clerk/*`. Clerk's current Next.js quickstart uses `proxy.ts` for Next.js 16, but this project deploys through OpenNext Cloudflare, and OpenNext does not support Node middleware. Keeping Clerk in `middleware.ts` produces Edge Middleware for the Cloudflare preview/deploy path. No route matcher calls `auth.protect()` in this phase, so Clerk provides auth state without changing access behavior.

Clerk publishable and secret keys become deployment configuration for auth-aware environments. The required variable names are `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`; their values come from the Clerk dashboard for the target environment.

If the publishable key is absent, Clerk is not mounted and the scratchpad account menu section is hidden. If either the publishable key or secret key is absent, the middleware returns `NextResponse.next()`. This keeps local and Cloudflare previews of the static site usable before credentials are configured, while authenticated UI appears only in environments with a Clerk publishable key.

The site still has no database dependency in this phase.

## Scratchpad UI

Update `ScratchpadToolbar` so account UI appears only inside the existing Memos dropdown menu.

When signed out, the dropdown includes a `Sign in` item. Selecting it starts Clerk sign-in using Clerk's standard Next.js component behavior.

When signed in, the dropdown includes an account section with:

- User avatar.
- Display label using this fallback order: `username`, `fullName`, primary email address, then `Account`.
- Clerk account management/sign-out affordance through `UserButton`.

Existing menu behavior remains:

- `Instance Settings`
- connected instance status and version
- `Theme`
- `Back to Main Site`

While Clerk is loading, the menu should avoid large layout changes. It can omit the account section until Clerk resolves.

## Data Flow

Anonymous and signed-in users both continue to use the same current browser-local storage:

- Scratchpad items in `localStorage`.
- Viewport/settings in `localStorage`.
- Attachment blobs in IndexedDB.
- Memos instance settings and encrypted access tokens in `localStorage`.

Clerk identity is read-only in this phase. `useUser()` supplies display data for the toolbar menu. No server action, route handler, API endpoint, or database call is introduced.

Later database work can add a separate settings sync layer keyed by Clerk `userId`. That later phase must explicitly decide how to import local settings, handle conflicts, and store credentials.

## Error Handling

Editor initialization must not depend on Clerk readiness. The scratchpad should keep rendering anonymous/local behavior even when no user is signed in.

If Clerk is unavailable or keys are misconfigured, the auth UI can fail visibly during development or deployment verification. The editor, local cards, local attachments, and save-to-Memos behavior should not be coupled to Clerk state.

Signed-out users keep the exact current instance settings and save-to-Memos behavior. Signed-in users get only identity display changes in this phase.

## Verification

Run automated checks:

```sh
pnpm lint
pnpm build
```

Run local manual checks with `pnpm dev`:

- `/scratchpad` loads while signed out.
- Existing local cards, instance settings, and attachments still load.
- The Memos dropdown shows a `Sign in` item while signed out.
- Signing in succeeds.
- The Memos dropdown shows avatar and username after sign-in.
- Signing out returns the dropdown to the signed-out state.

Run Cloudflare runtime verification:

```sh
pnpm run preview
```

Confirm `/scratchpad` behaves the same under OpenNext/Workers preview.

## Future Work

The next phase can introduce database-backed instance settings for authenticated users. That work should be designed separately because it requires persistence decisions, credential handling, data migration or import behavior, and conflict resolution.
