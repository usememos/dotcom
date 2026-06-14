"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { PlugIcon, SettingsIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { AccountActionItems } from "@/features/account/components/account-action-items";
import { ThemeMenuItems } from "@/features/account/components/theme-menu-items";
import { UserIdentity } from "@/features/account/components/user-identity";
import { menuItemClassName, menuSeparatorClassName } from "@/features/account/lib/menu-styles";

const iconButtonClassName =
  "inline-flex h-8 w-8 items-center justify-center rounded-md border border-stone-300 bg-white text-stone-600 transition hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300 dark:hover:bg-stone-800";
const menuContentClassName =
  "z-50 w-56 rounded-md border border-stone-200 bg-white p-1.5 shadow-md shadow-stone-900/10 dark:border-stone-800 dark:bg-stone-950 dark:shadow-black/40";

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
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button type="button" className={iconButtonClassName} aria-label="Account and connection">
            <SettingsIcon className="h-4 w-4" />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className={menuContentClassName} sideOffset={8} align="end">
            <DropdownMenu.Item
              className={menuItemClassName}
              onSelect={() => {
                // Defer so the dropdown layer unmounts before the dialog mounts.
                setTimeout(onManageConnection, 0);
              }}
            >
              <PlugIcon className="h-4 w-4" />
              <span>Manage connection</span>
            </DropdownMenu.Item>
            <DropdownMenu.Separator className={menuSeparatorClassName} />
            <AccountActionItems signOutRedirectUrl="/" />
            <DropdownMenu.Separator className={menuSeparatorClassName} />
            <ThemeMenuItems />
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}
