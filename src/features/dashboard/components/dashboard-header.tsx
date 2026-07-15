"use client";

import { PlugIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";
import type { ComponentProps } from "react";
import { SignOutItem } from "@/features/account/components/sign-out-item";
import { ThemeToggle } from "@/features/account/components/theme-toggle";
import { UserIdentity } from "@/features/account/components/user-identity";
import { CONNECTIONS_SETTINGS_PATH } from "@/shared/routes";
import { Button } from "@/shared/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/ui/dropdown-menu";

type DashboardHeaderProps = {
  user: ComponentProps<typeof UserIdentity>["user"];
  secondary: ComponentProps<typeof UserIdentity>["secondary"];
};

/** Account and workspace controls shown for any authenticated dashboard state. */
export function DashboardHeader({ user, secondary }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <UserIdentity user={user} size="md" secondary={secondary} />
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" size="icon" aria-label="Account and settings" />}>
          <SettingsIcon className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" sideOffset={8} align="end">
          <DropdownMenuItem render={<Link href={CONNECTIONS_SETTINGS_PATH} />}>
            <PlugIcon className="h-4 w-4" />
            <span>Connections</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <SignOutItem signOutRedirectUrl="/" />
          <DropdownMenuSeparator />
          <ThemeToggle />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
