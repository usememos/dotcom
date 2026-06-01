# Scratchpad Clerk Auth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add optional Clerk login awareness to the scratchpad so anonymous use keeps working and signed-in users see their avatar and username in the existing Memos dropdown.

**Architecture:** Clerk is installed at the app shell level with `ClerkProvider` and Clerk middleware, but no routes are protected. Scratchpad auth UI is isolated to a small client component rendered inside `ScratchpadToolbar`; storage and editor logic stay local-first and unchanged. The implementation uses `src/middleware.ts` rather than `src/proxy.ts` so OpenNext Cloudflare builds Edge Middleware instead of unsupported Node middleware.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Radix Dropdown Menu, Clerk Next.js SDK, pnpm.

---

## File Structure

- Modify `package.json` and `pnpm-lock.yaml`: add `@clerk/nextjs`.
- Modify `src/app/layout.tsx`: wrap existing `RootProvider` with Clerk's `ClerkProvider`.
- Create `src/middleware.ts`: add Clerk middleware without protected route matchers.
- Create `src/features/scratchpad/components/scratchpad-account-menu-section.tsx`: render signed-out sign-in item or signed-in identity row.
- Modify `src/features/scratchpad/components/scratchpad-toolbar.tsx`: mount the account menu section inside the existing Memos dropdown.
- No storage files change in this phase. `src/features/scratchpad/lib/storage.ts`, `src/features/scratchpad/lib/indexeddb.ts`, and `src/features/scratchpad/hooks/use-scratchpad.ts` remain behaviorally unchanged.

## Environment Setup Notes

Local development needs `.env.local` values for `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`. Copy the exact development-instance values from the Clerk dashboard. Do not commit `.env.local`.

Production/preview deployments need the same variable names configured in the deployment environment before auth can work. The database is still not required in this phase.

When the publishable key is absent, the implementation intentionally leaves the site in anonymous mode: `ClerkProvider` is not mounted and the scratchpad account menu section is hidden. When either the publishable key or secret key is absent, the middleware passes through. This keeps the static site and Cloudflare preview working before Clerk credentials are configured.

---

### Task 1: Install Clerk SDK

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

- [ ] **Step 1: Install dependency**

Run:

```sh
pnpm add @clerk/nextjs
```

Expected:

- `package.json` contains `@clerk/nextjs` in `dependencies`.
- `pnpm-lock.yaml` is updated.

- [ ] **Step 2: Verify dependency is present**

Run:

```sh
pnpm pkg get dependencies.@clerk/nextjs
```

Expected: command prints the installed Clerk version string, for example `"^7.x.x"` or the current version selected by pnpm.

- [ ] **Step 3: Commit dependency changes**

Run:

```sh
git add package.json pnpm-lock.yaml
git commit -m "chore: add Clerk Next.js SDK"
```

Expected: commit succeeds with only dependency files included.

---

### Task 2: Add Clerk Provider And Middleware

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/middleware.ts`

- [ ] **Step 1: Wrap the app with `ClerkProvider`**

In `src/app/layout.tsx`, add this import near the top:

```tsx
import { ClerkProvider } from "@clerk/nextjs";
```

Then replace the current body provider block:

```tsx
<body className={`${inter.variable} ${displaySerif.variable} flex min-h-screen flex-col antialiased`}>
  <RootProvider theme={{ defaultTheme: "system", enableSystem: true }}>{children}</RootProvider>
</body>
```

with:

```tsx
<body className={`${inter.variable} ${displaySerif.variable} flex min-h-screen flex-col antialiased`}>
  <ClerkProvider>
    <RootProvider theme={{ defaultTheme: "system", enableSystem: true }}>{children}</RootProvider>
  </ClerkProvider>
</body>
```

Expected: `RootProvider` remains present and continues to wrap `children`.

- [ ] **Step 2: Add Clerk middleware**

Create `src/middleware.ts` with:

```ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};
```

Expected: there is no `auth.protect()` call and no protected route matcher.

Execution note: this was initially implemented as `src/proxy.ts` per Clerk's Next.js 16 quickstart. `pnpm run preview` then failed because OpenNext Cloudflare does not currently support Node middleware. The file was moved to `src/middleware.ts` to keep the same Clerk behavior while producing Edge Middleware for the Cloudflare runtime.

- [ ] **Step 3: Run static checks**

Run:

```sh
pnpm lint
```

Expected: Biome check passes.

- [ ] **Step 4: Run production build**

Run:

```sh
pnpm build
```

Expected: Next.js build completes. If it fails because Clerk environment variables are missing, add valid local `.env.local` values and rerun.

- [ ] **Step 5: Commit provider and middleware**

Run:

```sh
git add src/app/layout.tsx src/middleware.ts
git commit -m "feat: wire Clerk into app shell"
```

Expected: commit succeeds with only provider and middleware changes.

---

### Task 3: Add Scratchpad Account Menu Section

**Files:**
- Create: `src/features/scratchpad/components/scratchpad-account-menu-section.tsx`

- [ ] **Step 1: Create account menu component**

Create `src/features/scratchpad/components/scratchpad-account-menu-section.tsx` with:

```tsx
"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { LogInIcon } from "lucide-react";
import { UserButton, useClerk, useUser } from "@clerk/nextjs";

function getUserDisplayName(user: ReturnType<typeof useUser>["user"]): string {
  if (!user) {
    return "Account";
  }

  return user.username || user.fullName || user.primaryEmailAddress?.emailAddress || "Account";
}

export function ScratchpadAccountMenuSection() {
  const { openSignIn } = useClerk();
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn || !user) {
    return (
      <>
        <DropdownMenu.Item
          className="flex cursor-pointer items-center space-x-2 rounded-[14px] px-3 py-2 text-sm text-stone-600 outline-none hover:bg-stone-100/80"
          onSelect={(event) => {
            event.preventDefault();
            openSignIn();
          }}
        >
          <LogInIcon className="h-4 w-4" />
          <span>Sign in</span>
        </DropdownMenu.Item>

        <DropdownMenu.Separator className="my-1 h-px bg-stone-200/80" />
      </>
    );
  }

  const displayName = getUserDisplayName(user);
  const emailAddress = user.primaryEmailAddress?.emailAddress;

  return (
    <>
      <div className="flex items-center gap-3 rounded-[14px] px-3 py-2">
        <img src={user.imageUrl} alt="" className="h-8 w-8 rounded-full bg-stone-100 object-cover" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-stone-700">{displayName}</div>
          <div className="truncate text-xs text-stone-400">{emailAddress || "Signed in"}</div>
        </div>
        <UserButton
          afterSignOutUrl="/scratchpad"
          appearance={{
            elements: {
              userButtonAvatarBox: "h-8 w-8",
            },
          }}
        />
      </div>

      <DropdownMenu.Separator className="my-1 h-px bg-stone-200/80" />
    </>
  );
}
```

Expected: component renders nothing while Clerk loads, a sign-in menu item when signed out, and avatar/name/UserButton when signed in.

- [ ] **Step 2: Run lint for the new file**

Run:

```sh
pnpm lint
```

Expected: Biome passes. If import ordering fails, run `pnpm format` and inspect that only intended formatting changed.

- [ ] **Step 3: Commit account menu component**

Run:

```sh
git add src/features/scratchpad/components/scratchpad-account-menu-section.tsx
git commit -m "feat(scratchpad): add Clerk account menu section"
```

Expected: commit succeeds with only the new component.

---

### Task 4: Mount Account Section In Scratchpad Toolbar

**Files:**
- Modify: `src/features/scratchpad/components/scratchpad-toolbar.tsx`

- [ ] **Step 1: Import the account menu section**

In `src/features/scratchpad/components/scratchpad-toolbar.tsx`, add:

```tsx
import { ScratchpadAccountMenuSection } from "./scratchpad-account-menu-section";
```

Place it with the other local/component imports.

- [ ] **Step 2: Render it inside the existing Memos dropdown**

In `ScratchpadToolbar`, find:

```tsx
<DropdownMenu.Content
  className="z-50 min-w-[220px] rounded-[18px] border border-white/70 bg-[#fffdf8]/96 p-1.5 shadow-[0_18px_52px_rgba(103,87,64,0.14)] backdrop-blur"
  sideOffset={5}
  align="end"
>
  <DropdownMenu.Item
    className="flex cursor-pointer items-center space-x-2 rounded-[14px] px-3 py-2 text-sm text-stone-600 outline-none hover:bg-stone-100/80"
    onSelect={onOpenInstanceSettings}
  >
```

Insert `<ScratchpadAccountMenuSection />` immediately after the opening `DropdownMenu.Content` tag:

```tsx
<DropdownMenu.Content
  className="z-50 min-w-[220px] rounded-[18px] border border-white/70 bg-[#fffdf8]/96 p-1.5 shadow-[0_18px_52px_rgba(103,87,64,0.14)] backdrop-blur"
  sideOffset={5}
  align="end"
>
  <ScratchpadAccountMenuSection />

  <DropdownMenu.Item
    className="flex cursor-pointer items-center space-x-2 rounded-[14px] px-3 py-2 text-sm text-stone-600 outline-none hover:bg-stone-100/80"
    onSelect={onOpenInstanceSettings}
  >
```

Expected: account UI appears at the top of the existing Memos dropdown. No always-visible account control is added outside the dropdown.

- [ ] **Step 3: Run lint and build**

Run:

```sh
pnpm lint
pnpm build
```

Expected: both commands pass.

- [ ] **Step 4: Commit toolbar wiring**

Run:

```sh
git add src/features/scratchpad/components/scratchpad-toolbar.tsx
git commit -m "feat(scratchpad): show account state in menu"
```

Expected: commit succeeds with only toolbar wiring.

---

### Task 5: Manual Auth And Anonymous Behavior Verification

**Files:**
- No source changes expected.

- [ ] **Step 1: Start dev server**

Run:

```sh
pnpm dev
```

Expected: dev server starts on `http://localhost:3000`.

- [ ] **Step 2: Verify anonymous scratchpad**

Open `http://localhost:3000/scratchpad`.

Expected:

- Scratchpad loads without redirect.
- Existing local cards render if local browser storage has cards.
- Existing Memos instance settings still appear in the Memos menu.
- The Memos dropdown contains `Sign in`.
- Creating/editing/deleting cards works without signing in.

- [ ] **Step 3: Verify sign-in flow**

In the Memos dropdown, select `Sign in`.

Expected:

- Clerk sign-in opens.
- Successful sign-in returns to usable `/scratchpad`.
- The dropdown shows avatar and the best available display label using username, full name, email, or `Account`.
- Clerk `UserButton` opens account controls.

- [ ] **Step 4: Verify sign-out flow**

Use Clerk account controls to sign out.

Expected:

- User returns to `/scratchpad`.
- Scratchpad still loads.
- Memos dropdown returns to `Sign in`.
- Existing local scratchpad cards and instance settings remain available.

- [ ] **Step 5: Stop dev server**

Stop the running `pnpm dev` process with `Ctrl-C`.

Expected: server exits cleanly.

---

### Task 6: Cloudflare/OpenNext Verification

**Files:**
- No source changes expected unless verification reveals a Clerk/OpenNext issue.

- [ ] **Step 1: Run Cloudflare preview build**

Run:

```sh
pnpm run preview
```

Expected: OpenNext builds and starts the local Workers preview, usually on `http://localhost:8788`.

- [ ] **Step 2: Verify scratchpad in preview**

Open the preview URL at `/scratchpad`.

Expected:

- Anonymous scratchpad loads without redirect.
- Memos dropdown account area behaves the same as local dev.
- Sign-in flow works with the Clerk environment configured for the preview origin.

- [ ] **Step 3: Handle preview failures**

If preview fails because the Clerk preview origin is not configured, configure the Clerk dashboard and deployment environment, then rerun `pnpm run preview`.

If preview fails because source code must change, stop this plan and write a short failure note with the command output and the suspected file. Do not make an unplanned source fix inside this task.

---

### Task 7: Final Review

**Files:**
- Review all changed source files.

- [ ] **Step 1: Check final diff**

Run:

```sh
git status --short
git log --oneline -5
git diff --stat HEAD~4..HEAD
```

Expected:

- Working tree is clean, except for intentional uncommitted environment files that must not be committed.
- Recent commits correspond to dependency install, app shell wiring, account menu component, and toolbar wiring.

- [ ] **Step 2: Confirm non-goals stayed untouched**

Inspect the diff:

```sh
git diff HEAD~4..HEAD -- src/features/scratchpad/lib/storage.ts src/features/scratchpad/lib/indexeddb.ts src/features/scratchpad/hooks/use-scratchpad.ts
```

Expected: no diff for storage/editor persistence files.

- [ ] **Step 3: Record verification results**

Prepare a final implementation summary that includes:

- `pnpm lint` result.
- `pnpm build` result.
- `pnpm run preview` result.
- Manual signed-out and signed-in scratchpad checks.
- Confirmation that `/scratchpad` remains public and no database was added.

Expected: summary is ready for the user or PR description.
