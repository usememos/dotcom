"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { HomeIcon, MonitorIcon, MoonIcon, SaveIcon, SettingsIcon, SunIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import type { MemoInstance } from "@/lib/scratch/types";

interface ScratchpadToolbarProps {
  defaultInstance: MemoInstance | null;
  defaultInstanceStatusLabel: string;
  defaultInstanceVersion: string;
  selectedCount: number;
  selectedSaveTitle: string;
  saveDisabled: boolean;
  onDeleteSelected: () => void;
  onOpenInstanceSettings: () => void;
  onSaveSelected: () => void;
}

export function ScratchpadToolbar({
  defaultInstance,
  defaultInstanceStatusLabel,
  defaultInstanceVersion,
  selectedCount,
  selectedSaveTitle,
  saveDisabled,
  onDeleteSelected,
  onOpenInstanceSettings,
  onSaveSelected,
}: ScratchpadToolbarProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
      {selectedCount > 0 && (
        <div className="flex items-center space-x-2 rounded-full border border-white/70 bg-white/76 px-3 py-1.5 shadow-[0_10px_26px_rgba(109,92,68,0.1)] backdrop-blur-sm">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">{selectedCount} selected</span>
          <div className="h-4 w-px bg-stone-200" />
          <button
            type="button"
            onClick={onSaveSelected}
            disabled={saveDisabled}
            className="rounded-full p-1.5 text-[#5c8e86] transition hover:bg-[#edf5f3] disabled:cursor-not-allowed disabled:opacity-50"
            title={selectedSaveTitle}
          >
            <SaveIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onDeleteSelected}
            className="rounded-full p-1.5 text-[#bf6f5d] transition hover:bg-[#fbefea]"
            title="Delete selected"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      )}

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/78 text-[#5c8e86] shadow-[0_10px_26px_rgba(109,92,68,0.1)] transition hover:bg-white"
            title="Memos menu"
          >
            <Image src="/logo.png" alt="Memos" width={28} height={28} />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="z-50 min-w-[220px] rounded-[18px] border border-white/70 bg-[#fffdf8]/96 p-1.5 shadow-[0_18px_52px_rgba(103,87,64,0.14)] backdrop-blur"
            sideOffset={5}
            align="end"
          >
            <DropdownMenu.Item
              className="flex cursor-pointer items-center space-x-2 rounded-[14px] px-3 py-2 text-sm text-stone-600 outline-none hover:bg-stone-100/80"
              onSelect={onOpenInstanceSettings}
            >
              <SettingsIcon className="h-4 w-4" />
              <span>Instance Settings</span>
            </DropdownMenu.Item>

            <div className="px-3 py-2 text-xs text-stone-400">
              <div className="font-semibold uppercase tracking-[0.16em] text-stone-500">
                {defaultInstance?.name || "No instance connected"}
              </div>
              {defaultInstance && (
                <>
                  <div>{defaultInstanceStatusLabel}</div>
                  <div>{defaultInstanceVersion}</div>
                </>
              )}
            </div>

            <DropdownMenu.Separator className="my-1 h-px bg-stone-200/80" />

            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger className="flex cursor-pointer items-center space-x-2 rounded-[14px] px-3 py-2 text-sm text-stone-600 outline-none hover:bg-stone-100/80">
                {mounted && theme === "light" && <SunIcon className="h-4 w-4" />}
                {mounted && theme === "dark" && <MoonIcon className="h-4 w-4" />}
                {mounted && theme === "system" && <MonitorIcon className="h-4 w-4" />}
                {!mounted && <MonitorIcon className="h-4 w-4" />}
                <span>Theme</span>
              </DropdownMenu.SubTrigger>
              <DropdownMenu.Portal>
                <DropdownMenu.SubContent className="z-50 min-w-[160px] rounded-[16px] border border-white/70 bg-[#fffdf8]/96 p-1.5 shadow-[0_18px_52px_rgba(103,87,64,0.14)] backdrop-blur">
                  <DropdownMenu.Item
                    className="flex cursor-pointer items-center space-x-2 rounded-[12px] px-3 py-2 text-sm text-stone-600 outline-none hover:bg-stone-100/80"
                    onSelect={() => setTheme("light")}
                  >
                    <SunIcon className="h-4 w-4" />
                    <span>Light</span>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    className="flex cursor-pointer items-center space-x-2 rounded-[12px] px-3 py-2 text-sm text-stone-600 outline-none hover:bg-stone-100/80"
                    onSelect={() => setTheme("dark")}
                  >
                    <MoonIcon className="h-4 w-4" />
                    <span>Dark</span>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    className="flex cursor-pointer items-center space-x-2 rounded-[12px] px-3 py-2 text-sm text-stone-600 outline-none hover:bg-stone-100/80"
                    onSelect={() => setTheme("system")}
                  >
                    <MonitorIcon className="h-4 w-4" />
                    <span>System</span>
                  </DropdownMenu.Item>
                </DropdownMenu.SubContent>
              </DropdownMenu.Portal>
            </DropdownMenu.Sub>

            <DropdownMenu.Separator className="my-1 h-px bg-stone-200/80" />

            <DropdownMenu.Item
              className="flex cursor-pointer items-center space-x-2 rounded-[14px] px-3 py-2 text-sm text-stone-600 outline-none hover:bg-stone-100/80"
              asChild
            >
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
