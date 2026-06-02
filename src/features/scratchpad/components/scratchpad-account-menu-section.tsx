"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { LogInIcon, LogOutIcon, UserCogIcon } from "lucide-react";
import { useIsClerkConfigured } from "@/shared/auth/clerk-config";

const menuItemClassName =
  "flex h-8 cursor-default select-none items-center gap-2 rounded-sm px-2 text-sm text-stone-700 outline-none data-[highlighted]:bg-stone-100 data-[highlighted]:text-stone-950 dark:text-stone-300 dark:data-[highlighted]:bg-stone-800 dark:data-[highlighted]:text-stone-50";

const menuSeparatorClassName = "my-1 h-px bg-stone-200 dark:bg-white/10";

function getUserDisplayName(user: ReturnType<typeof useUser>["user"]): string {
  if (!user) {
    return "Account";
  }

  return user.username || user.fullName || user.primaryEmailAddress?.emailAddress || "Account";
}

function ClerkAccountMenuSection() {
  const { openSignIn, openUserProfile, signOut } = useClerk();
  const { isLoaded, isSignedIn, user } = useUser();

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
            openSignIn();
          }}
        >
          <LogInIcon className="h-4 w-4" />
          <span>Sign in</span>
        </DropdownMenu.Item>
        <DropdownMenu.Separator className={menuSeparatorClassName} />
      </>
    );
  }

  const displayName = getUserDisplayName(user);
  const emailAddress = user.primaryEmailAddress?.emailAddress;

  return (
    <>
      <div className="flex items-center gap-3 rounded-md px-2.5 py-2">
        <img src={user.imageUrl} alt="" className="h-8 w-8 rounded-full bg-stone-100 object-cover dark:bg-stone-800" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-stone-700 dark:text-stone-200">{displayName}</div>
          <div className="truncate text-xs text-stone-400 dark:text-stone-500">{emailAddress || "Signed in"}</div>
        </div>
      </div>

      <DropdownMenu.Separator className={menuSeparatorClassName} />

      <DropdownMenu.Item
        className={menuItemClassName}
        onSelect={(event) => {
          event.preventDefault();
          openUserProfile();
        }}
      >
        <UserCogIcon className="h-4 w-4" />
        <span>Manage account</span>
      </DropdownMenu.Item>

      <DropdownMenu.Item
        className={menuItemClassName}
        onSelect={(event) => {
          event.preventDefault();
          void signOut({ redirectUrl: "/scratchpad" });
        }}
      >
        <LogOutIcon className="h-4 w-4" />
        <span>Sign out</span>
      </DropdownMenu.Item>

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
