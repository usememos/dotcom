"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ExternalLinkIcon, LayoutDashboardIcon, LogInIcon, ShieldCheckIcon } from "lucide-react";
import { SignOutItem } from "@/features/account/components/account-action-items";
import { UserIdentity } from "@/features/account/components/user-identity";
import { useAccountActions } from "@/features/account/hooks/use-account-actions";
import { menuItemClassName, menuSeparatorClassName } from "@/features/account/lib/menu-styles";
import { useIsClerkConfigured } from "@/shared/auth/clerk-config";

const scratchpadFeedbackUrl = "https://github.com/usememos/dotcom/issues";

function ClerkAccountMenuSection() {
  const { isLoaded, isSignedIn, user, signIn } = useAccountActions();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn || !user) {
    return (
      <>
        <DropdownMenu.Item
          className={menuItemClassName}
          onSelect={(event) => {
            event.preventDefault();
            signIn();
          }}
        >
          <LogInIcon className="h-4 w-4" />
          <span>Sign in</span>
        </DropdownMenu.Item>
        <DropdownMenu.Separator className={menuSeparatorClassName} />
      </>
    );
  }

  const emailAddress = user.primaryEmailAddress?.emailAddress;

  return (
    <>
      <div className="px-2.5 py-2.5">
        <UserIdentity user={user} size="sm" secondary={emailAddress || "Signed in"} />
      </div>

      <DropdownMenu.Separator className={menuSeparatorClassName} />

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
        <DropdownMenu.Item
          className="mt-1 inline-flex h-6 w-fit items-center gap-1 rounded-sm text-xs font-medium text-teal-700 outline-none data-[highlighted]:text-teal-900 dark:text-teal-300 dark:data-[highlighted]:text-teal-100"
          asChild
        >
          <a href={scratchpadFeedbackUrl} target="_blank" rel="noreferrer">
            <span>Any other thoughts?</span>
            <ExternalLinkIcon className="h-3 w-3" />
          </a>
        </DropdownMenu.Item>
      </div>

      <DropdownMenu.Separator className={menuSeparatorClassName} />

      <DropdownMenu.Item className={menuItemClassName} asChild>
        <a href="/dashboard">
          <LayoutDashboardIcon className="h-4 w-4" />
          <span>Dashboard</span>
        </a>
      </DropdownMenu.Item>

      <SignOutItem signOutRedirectUrl="/scratchpad" />

      <DropdownMenu.Separator className={menuSeparatorClassName} />
    </>
  );
}

export function ScratchpadAccountMenuSection() {
  const isClerkConfigured = useIsClerkConfigured();

  if (!isClerkConfigured) {
    return null;
  }

  return <ClerkAccountMenuSection />;
}
