"use client";

import { ExternalLinkIcon, HomeIcon, LayoutDashboardIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/features/account/components/theme-toggle";
import { menuContentClassName, menuItemClassName, menuSeparatorClassName } from "@/features/account/lib/menu-styles";
import { Button } from "@/shared/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/ui/dropdown-menu";

export function ScratchpadToolbar() {
  return (
    <div className="absolute top-4 right-4 z-10">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="outline"
              size="icon"
              className="overflow-hidden rounded-full border-stone-200/80 bg-white/88 p-0 text-stone-500 shadow-sm hover:bg-white hover:text-stone-900 dark:border-white/10 dark:bg-stone-900/88 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100"
              aria-label="Memos menu"
              title="Memos menu"
            />
          }
        >
          <Image src="/logo.png" alt="Memos" width={32} height={32} className="h-full w-full rounded-full object-cover" />
        </DropdownMenuTrigger>

        <DropdownMenuContent className={menuContentClassName} sideOffset={8} align="end">
          <div className="px-2 py-1.5">
            <p className="font-serif text-[15px] font-semibold leading-5 text-stone-900 dark:text-stone-100">Scratchpad</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-[11px] leading-4 text-stone-500 dark:text-stone-400">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500" aria-hidden="true" />
              Saved on this device
            </p>
          </div>

          <DropdownMenuSeparator className={menuSeparatorClassName} />

          <DropdownMenuItem className={menuItemClassName} render={<Link href="/" />}>
            <HomeIcon className="h-4 w-4" />
            <span>Memos home</span>
          </DropdownMenuItem>

          <DropdownMenuItem className={menuItemClassName} render={<Link href="/dashboard" />}>
            <LayoutDashboardIcon className="h-4 w-4" />
            <span>Dashboard</span>
            <ExternalLinkIcon className="ml-auto h-3.5 w-3.5 text-stone-400 dark:text-stone-500" aria-hidden="true" />
          </DropdownMenuItem>

          <DropdownMenuSeparator className={menuSeparatorClassName} />

          <ThemeToggle />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
