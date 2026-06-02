"use client";

import { useUser } from "@clerk/nextjs";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CheckIcon, HomeIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useIsClerkConfigured } from "@/shared/auth/clerk-config";
import { ScratchpadAccountMenuSection } from "./scratchpad-account-menu-section";

const menuItemClassName =
  "flex h-8 cursor-default select-none items-center gap-2 rounded-sm px-2 text-sm text-stone-700 outline-none data-[highlighted]:bg-stone-100 data-[highlighted]:text-stone-950 dark:text-stone-300 dark:data-[highlighted]:bg-stone-800 dark:data-[highlighted]:text-stone-50";

const menuLabelClassName = "px-2 py-1.5 text-xs font-medium text-stone-500 dark:text-stone-500";

const menuSeparatorClassName = "my-1 h-px bg-stone-200 dark:bg-white/10";

const menuRadioItemClassName =
  "relative flex h-8 cursor-default select-none items-center gap-2 rounded-sm py-1 pr-2 pl-7 text-sm text-stone-700 outline-none data-[highlighted]:bg-stone-100 data-[highlighted]:text-stone-950 dark:text-stone-300 dark:data-[highlighted]:bg-stone-800 dark:data-[highlighted]:text-stone-50";

function ScratchpadMenuTriggerImage() {
  const isClerkConfigured = useIsClerkConfigured();

  if (!isClerkConfigured) {
    return <Image src="/logo.png" alt="Memos" width={32} height={32} className="h-full w-full rounded-full object-cover" />;
  }

  return <ClerkScratchpadMenuTriggerImage />;
}

function ClerkScratchpadMenuTriggerImage() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (isLoaded && isSignedIn && user?.imageUrl) {
    return <img src={user.imageUrl} alt="" className="h-full w-full rounded-full object-cover" />;
  }

  return <Image src="/logo.png" alt="Memos" width={32} height={32} className="h-full w-full rounded-full object-cover" />;
}

export function ScratchpadToolbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

            <DropdownMenu.Label className={menuLabelClassName}>Theme</DropdownMenu.Label>
            <DropdownMenu.RadioGroup value={mounted ? theme : "system"} onValueChange={setTheme}>
              <DropdownMenu.RadioItem className={menuRadioItemClassName} value="light">
                <DropdownMenu.ItemIndicator className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                  <CheckIcon className="h-3.5 w-3.5" />
                </DropdownMenu.ItemIndicator>
                <SunIcon className="h-4 w-4 text-stone-500 dark:text-stone-400" />
                <span>Light</span>
              </DropdownMenu.RadioItem>
              <DropdownMenu.RadioItem className={menuRadioItemClassName} value="dark">
                <DropdownMenu.ItemIndicator className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                  <CheckIcon className="h-3.5 w-3.5" />
                </DropdownMenu.ItemIndicator>
                <MoonIcon className="h-4 w-4 text-stone-500 dark:text-stone-400" />
                <span>Dark</span>
              </DropdownMenu.RadioItem>
              <DropdownMenu.RadioItem className={menuRadioItemClassName} value="system">
                <DropdownMenu.ItemIndicator className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                  <CheckIcon className="h-3.5 w-3.5" />
                </DropdownMenu.ItemIndicator>
                <MonitorIcon className="h-4 w-4 text-stone-500 dark:text-stone-400" />
                <span>System</span>
              </DropdownMenu.RadioItem>
            </DropdownMenu.RadioGroup>

            <DropdownMenu.Separator className={menuSeparatorClassName} />

            <DropdownMenu.Item className={menuItemClassName} asChild>
              <Link href="/">
                <HomeIcon className="h-4 w-4" />
                <span>Back to Main Site</span>
              </Link>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}
