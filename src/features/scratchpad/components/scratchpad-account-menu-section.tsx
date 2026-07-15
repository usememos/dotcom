"use client";

import { ExternalLinkIcon, LayoutDashboardIcon, LogInIcon, ShieldCheckIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { SignOutItem } from "@/features/account/components/sign-out-item";
import { UserIdentity } from "@/features/account/components/user-identity";
import { useAccountActions } from "@/features/account/hooks/use-account-actions";
import { menuItemClassName, menuSeparatorClassName } from "@/features/account/lib/menu-styles";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/shared/ui/dropdown-menu";

const scratchpadFeedbackUrl = "https://github.com/usememos/dotcom/issues";

// Wrapper only to satisfy Biome's lint/a11y/useAnchorContent — a bare `<a />` in a
// Base UI `render` prop looks empty to the linter even though content is injected.
function MenuAnchor({ children, ...props }: ComponentProps<"a">) {
  return <a {...props}>{children}</a>;
}

export function ScratchpadAccountMenuSection() {
  const { isLoaded, isSignedIn, user, signIn } = useAccountActions();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn || !user) {
    return (
      <>
        <DropdownMenuItem
          className={menuItemClassName}
          onClick={(event) => {
            event.preventDefault();
            signIn();
          }}
        >
          <LogInIcon className="h-4 w-4" />
          <span>Sign in</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className={menuSeparatorClassName} />
      </>
    );
  }

  const emailAddress = user.primaryEmailAddress?.emailAddress;

  return (
    <>
      <div className="px-2.5 py-2.5">
        <UserIdentity user={user} size="sm" secondary={emailAddress || "Signed in"} />
      </div>

      <DropdownMenuSeparator className={menuSeparatorClassName} />

      <div className="my-1.5 w-full rounded-md border border-teal-200/80 bg-teal-50/80 px-2.5 py-2.5 dark:border-teal-900/60 dark:bg-teal-950/35">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-teal-700 shadow-sm shadow-teal-950/5 dark:bg-teal-900/60 dark:text-teal-200 dark:shadow-black/20">
            <ShieldCheckIcon className="h-3.5 w-3.5" />
          </span>
          <div className="text-sm font-semibold leading-5 text-stone-800 dark:text-stone-100">Always Local-only</div>
        </div>
        <p className="mt-1.5 text-xs leading-4 text-stone-600 dark:text-stone-400">
          Your cards stay on this device and are not uploaded to the cloud.
        </p>
        <DropdownMenuItem
          className="mt-1 inline-flex h-6 w-fit items-center gap-1 rounded-sm text-xs font-medium text-teal-700 outline-none data-[highlighted]:text-teal-900 dark:text-teal-300 dark:data-[highlighted]:text-teal-100"
          render={<MenuAnchor href={scratchpadFeedbackUrl} target="_blank" rel="noreferrer" />}
        >
          <span>Any other thoughts?</span>
          <ExternalLinkIcon className="h-3 w-3" />
        </DropdownMenuItem>
      </div>

      <DropdownMenuSeparator className={menuSeparatorClassName} />

      <DropdownMenuItem className={menuItemClassName} render={<MenuAnchor href="/dashboard" />}>
        <LayoutDashboardIcon className="h-4 w-4" />
        <span>Dashboard</span>
      </DropdownMenuItem>

      <SignOutItem signOutRedirectUrl="/scratchpad" className={menuItemClassName} />

      <DropdownMenuSeparator className={menuSeparatorClassName} />
    </>
  );
}
