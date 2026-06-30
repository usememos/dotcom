"use client";

import { useUser } from "@clerk/nextjs";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { HomeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/features/account/components/theme-toggle";
import { menuItemClassName, menuSeparatorClassName } from "@/features/account/lib/menu-styles";
import { ScratchpadAccountMenuSection } from "./scratchpad-account-menu-section";

function ScratchpadMenuTriggerImage() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (isLoaded && isSignedIn && user?.imageUrl) {
    return <img src={user.imageUrl} alt="" className="h-full w-full rounded-full object-cover" />;
  }

  return <Image src="/logo.png" alt="Memos" width={32} height={32} className="h-full w-full rounded-full object-cover" />;
}

export function ScratchpadToolbar() {
  return (
    <div className="absolute top-4 right-4 z-10">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-stone-200/80 bg-white/88 text-stone-500 shadow-sm transition hover:bg-white hover:text-stone-900 dark:border-white/10 dark:bg-stone-900/88 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100"
            title="Memos menu"
          >
            <ScratchpadMenuTriggerImage />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="z-50 w-56 rounded-md border border-stone-200 bg-white p-1.5 shadow-md shadow-stone-900/10 dark:border-stone-800 dark:bg-stone-950 dark:shadow-black/40"
            sideOffset={8}
            align="end"
          >
            <ScratchpadAccountMenuSection />

            <DropdownMenu.Item className={menuItemClassName} asChild>
              <Link href="/">
                <HomeIcon className="h-4 w-4" />
                <span>Back to Main Site</span>
              </Link>
            </DropdownMenu.Item>

            <DropdownMenu.Separator className={menuSeparatorClassName} />

            <ThemeToggle />
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}
