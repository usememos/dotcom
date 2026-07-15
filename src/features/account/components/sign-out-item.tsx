"use client";

import { LogOutIcon } from "lucide-react";
import { DropdownMenuItem } from "@/shared/ui/dropdown-menu";
import { useAccountActions } from "../hooks/use-account-actions";

/** Sign-out menu item. Render inside DropdownMenuContent. */
export function SignOutItem({ signOutRedirectUrl, className }: { signOutRedirectUrl: string; className?: string }) {
  const { signOut } = useAccountActions({ signOutRedirectUrl });

  return (
    <DropdownMenuItem
      className={className}
      onClick={(event) => {
        event.preventDefault();
        signOut();
      }}
    >
      <LogOutIcon />
      <span>Sign out</span>
    </DropdownMenuItem>
  );
}
