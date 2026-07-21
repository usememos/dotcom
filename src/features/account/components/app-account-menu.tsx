"use client";

import { ArrowUpRightIcon, ChevronUpIcon, LogInIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";
import { SignOutItem } from "@/features/account/components/sign-out-item";
import { ThemeToggle } from "@/features/account/components/theme-toggle";
import { UserIdentity } from "@/features/account/components/user-identity";
import { useAccountActions } from "@/features/account/hooks/use-account-actions";
import { Button } from "@/shared/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/ui/dropdown-menu";

export function AppAccountMenu({ compact = false }: { compact?: boolean }) {
  const account = useAccountActions();

  if (!account.isLoaded) {
    return <div aria-hidden="true" className={compact ? "size-7" : "h-11 w-full"} />;
  }

  if (!account.isSignedIn || !account.user) {
    return compact ? (
      <Button type="button" variant="ghost" size="icon-sm" aria-label="Sign in" onClick={() => account.signIn()}>
        <LogInIcon />
      </Button>
    ) : (
      <Button type="button" variant="ghost" className="h-11 w-full justify-start" onClick={() => account.signIn()}>
        <LogInIcon />
        Sign in
      </Button>
    );
  }

  const emailAddress = account.user.primaryEmailAddress?.emailAddress || "Signed-in account";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          compact ? (
            <Button variant="ghost" size="icon-sm" aria-label="Account menu" />
          ) : (
            <button
              type="button"
              className="flex h-11 w-full items-center gap-2 rounded-lg px-1.5 text-left outline-none hover:bg-foreground/[0.04] focus-visible:ring-2 focus-visible:ring-ring data-popup-open:bg-foreground/[0.04] dark:hover:bg-white/[0.05] dark:data-popup-open:bg-white/[0.05]"
              aria-label="Account menu"
            />
          )
        }
      >
        {compact ? (
          <SettingsIcon className="size-3.5" />
        ) : (
          <>
            <UserIdentity user={account.user} size="xs" secondary={emailAddress} />
            <ChevronUpIcon className="ml-auto size-3.5 shrink-0 text-muted-foreground" />
          </>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 data-closed:animate-none data-open:animate-none"
        side={compact ? "bottom" : "top"}
        sideOffset={8}
        align={compact ? "end" : "start"}
      >
        {compact ? (
          <>
            <div className="px-1.5 py-1.5">
              <UserIdentity user={account.user} size="xs" secondary={emailAddress} />
            </div>
            <DropdownMenuSeparator />
          </>
        ) : null}
        <DropdownMenuItem render={<Link href="/" />}>
          <ArrowUpRightIcon />
          <span>usememos.com</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <SignOutItem signOutRedirectUrl="/" />
        <DropdownMenuSeparator />
        <ThemeToggle />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
