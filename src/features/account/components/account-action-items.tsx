"use client";

import { LogOutIcon, UserCogIcon } from "lucide-react";
import { DropdownMenuItem } from "@/shared/ui/dropdown-menu";
import { useAccountActions } from "../hooks/use-account-actions";
import { menuItemClassName } from "../lib/menu-styles";

/** Sign-out menu item. Render inside DropdownMenuContent. */
export function SignOutItem({ signOutRedirectUrl }: { signOutRedirectUrl: string }) {
  const { signOut } = useAccountActions({ signOutRedirectUrl });

  return (
    <DropdownMenuItem
      className={menuItemClassName}
      onClick={(event) => {
        event.preventDefault();
        signOut();
      }}
    >
      <LogOutIcon className="h-4 w-4" />
      <span>Sign out</span>
    </DropdownMenuItem>
  );
}

/** Manage account + Sign out items. Render inside DropdownMenuContent. */
export function AccountActionItems({ signOutRedirectUrl }: { signOutRedirectUrl: string }) {
  const { manageAccount } = useAccountActions();

  return (
    <>
      <DropdownMenuItem
        className={menuItemClassName}
        onClick={(event) => {
          event.preventDefault();
          manageAccount();
        }}
      >
        <UserCogIcon className="h-4 w-4" />
        <span>Manage account</span>
      </DropdownMenuItem>

      <SignOutItem signOutRedirectUrl={signOutRedirectUrl} />
    </>
  );
}
