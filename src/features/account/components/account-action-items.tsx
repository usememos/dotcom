"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { LogOutIcon, UserCogIcon } from "lucide-react";
import { useAccountActions } from "../hooks/use-account-actions";
import { menuItemClassName } from "../lib/menu-styles";

/** Sign-out DropdownMenu.Item. Render inside DropdownMenu.Content. */
export function SignOutItem({ signOutRedirectUrl }: { signOutRedirectUrl: string }) {
  const { signOut } = useAccountActions({ signOutRedirectUrl });

  return (
    <DropdownMenu.Item
      className={menuItemClassName}
      onSelect={(event) => {
        event.preventDefault();
        signOut();
      }}
    >
      <LogOutIcon className="h-4 w-4" />
      <span>Sign out</span>
    </DropdownMenu.Item>
  );
}

/** Manage account + Sign out items. Render inside DropdownMenu.Content. */
export function AccountActionItems({ signOutRedirectUrl }: { signOutRedirectUrl: string }) {
  const { manageAccount } = useAccountActions();

  return (
    <>
      <DropdownMenu.Item
        className={menuItemClassName}
        onSelect={(event) => {
          event.preventDefault();
          manageAccount();
        }}
      >
        <UserCogIcon className="h-4 w-4" />
        <span>Manage account</span>
      </DropdownMenu.Item>

      <SignOutItem signOutRedirectUrl={signOutRedirectUrl} />
    </>
  );
}
