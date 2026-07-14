"use client";

import { PlugIcon, SettingsIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { AccountActionItems } from "@/features/account/components/account-action-items";
import { ThemeToggle } from "@/features/account/components/theme-toggle";
import { UserIdentity } from "@/features/account/components/user-identity";
import { menuContentClassName, menuItemClassName, menuSeparatorClassName } from "@/features/account/lib/menu-styles";
import { Button } from "@/shared/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/ui/dropdown-menu";

type DashboardHeaderProps = {
  user: ComponentProps<typeof UserIdentity>["user"];
  secondary: ComponentProps<typeof UserIdentity>["secondary"];
  /** Opens the connection dialog (raw; this component defers it for the dropdown). */
  onManageConnection: () => void;
};

/** Account + connection header shown for any authed dashboard state. */
export function DashboardHeader({ user, secondary, onManageConnection }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <UserIdentity user={user} size="md" secondary={secondary} />
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" size="icon" aria-label="Account and connection" />}>
          <SettingsIcon className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className={menuContentClassName} sideOffset={8} align="end">
          <DropdownMenuItem
            className={menuItemClassName}
            onClick={() => {
              // Defer so the dropdown layer unmounts before the dialog mounts.
              setTimeout(onManageConnection, 0);
            }}
          >
            <PlugIcon className="h-4 w-4" />
            <span>Manage connection</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className={menuSeparatorClassName} />
          <AccountActionItems signOutRedirectUrl="/" />
          <DropdownMenuSeparator className={menuSeparatorClassName} />
          <ThemeToggle />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
