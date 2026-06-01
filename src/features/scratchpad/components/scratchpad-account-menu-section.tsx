"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { LogInIcon, LogOutIcon, UserCogIcon } from "lucide-react";

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
      </div>

      <DropdownMenu.Separator className="my-1 h-px bg-stone-200/80" />

      <DropdownMenu.Item
        className="flex cursor-pointer items-center space-x-2 rounded-[14px] px-3 py-2 text-sm text-stone-600 outline-none hover:bg-stone-100/80"
        onSelect={(event) => {
          event.preventDefault();
          openUserProfile();
        }}
      >
        <UserCogIcon className="h-4 w-4" />
        <span>Manage account</span>
      </DropdownMenu.Item>

      <DropdownMenu.Item
        className="flex cursor-pointer items-center space-x-2 rounded-[14px] px-3 py-2 text-sm text-stone-600 outline-none hover:bg-stone-100/80"
        onSelect={(event) => {
          event.preventDefault();
          void signOut({ redirectUrl: "/scratchpad" });
        }}
      >
        <LogOutIcon className="h-4 w-4" />
        <span>Sign out</span>
      </DropdownMenu.Item>

      <DropdownMenu.Separator className="my-1 h-px bg-stone-200/80" />
    </>
  );
}

export function ScratchpadAccountMenuSection() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return null;
  }

  return <ClerkAccountMenuSection />;
}
