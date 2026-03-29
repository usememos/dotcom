"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { HomeIcon, MonitorIcon, MoonIcon, SaveIcon, SettingsIcon, SunIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { InstanceSetupForm } from "@/components/scratch/instance-setup-form";
import { Workspace } from "@/components/scratch/workspace";
import { useScratchpad } from "@/hooks/use-scratchpad";

export default function ScratchPage() {
  const {
    defaultInstance,
    defaultInstanceStatusLabel,
    defaultInstanceVersion,
    handleCreateTextItem,
    handleDeleteItem,
    handleDeleteSelected,
    handleFileUpload,
    handleInstanceSave,
    handleSaveSelected,
    handleSelectItem,
    handleUpdateItem,
    isClient,
    items,
    selectedItemIds,
    selectedSaveBlockReason,
    selectedSaveTitle,
    saveItemsToStorage,
    setShowInstanceForm,
    showInstanceForm,
  } = useScratchpad();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="relative h-screen bg-gray-50 dark:bg-gray-900">
      <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
        {selectedItemIds.length > 0 && (
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">{selectedItemIds.length} selected</span>
            <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
            <button
              type="button"
              onClick={handleSaveSelected}
              disabled={Boolean(defaultInstance && selectedSaveBlockReason)}
              className="p-1.5 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
              title={selectedSaveTitle}
            >
              <SaveIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleDeleteSelected}
              className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
              title="Delete selected"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        )}

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              className="flex items-center justify-center w-8 h-8 bg-white dark:bg-gray-800 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-lg border border-gray-200 contain-content dark:border-gray-700 transition shadow-sm"
              title="Memos menu"
            >
              <Image src="/logo.png" alt="Memos" width={32} height={32} />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="min-w-[200px] bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg p-1 z-50"
              sideOffset={5}
              align="end"
            >
              <DropdownMenu.Item
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer outline-none"
                onSelect={() => setShowInstanceForm(true)}
              >
                <SettingsIcon className="w-4 h-4" />
                <span>Instance Settings</span>
              </DropdownMenu.Item>

              <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400">
                <div className="font-medium text-gray-700 dark:text-gray-300">{defaultInstance?.name || "No instance connected"}</div>
                {defaultInstance && (
                  <>
                    <div>{defaultInstanceStatusLabel}</div>
                    <div>{defaultInstanceVersion}</div>
                  </>
                )}
              </div>

              <DropdownMenu.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-1" />

              <DropdownMenu.Sub>
                <DropdownMenu.SubTrigger className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer outline-none">
                  {mounted && theme === "light" && <SunIcon className="w-4 h-4" />}
                  {mounted && theme === "dark" && <MoonIcon className="w-4 h-4" />}
                  {mounted && theme === "system" && <MonitorIcon className="w-4 h-4" />}
                  {!mounted && <MonitorIcon className="w-4 h-4" />}
                  <span>Theme</span>
                </DropdownMenu.SubTrigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.SubContent className="min-w-[160px] bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg p-1 z-50">
                    <DropdownMenu.Item
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer outline-none"
                      onSelect={() => setTheme("light")}
                    >
                      <SunIcon className="w-4 h-4" />
                      <span>Light</span>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer outline-none"
                      onSelect={() => setTheme("dark")}
                    >
                      <MoonIcon className="w-4 h-4" />
                      <span>Dark</span>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer outline-none"
                      onSelect={() => setTheme("system")}
                    >
                      <MonitorIcon className="w-4 h-4" />
                      <span>System</span>
                    </DropdownMenu.Item>
                  </DropdownMenu.SubContent>
                </DropdownMenu.Portal>
              </DropdownMenu.Sub>

              <DropdownMenu.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-1" />

              <DropdownMenu.Item
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer outline-none"
                asChild
              >
                <Link href="/">
                  <HomeIcon className="w-4 h-4" />
                  <span>Back to Main Site</span>
                </Link>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      <div className="h-screen">
        <Workspace
          items={items}
          onUpdateItem={handleUpdateItem}
          onDeleteItem={handleDeleteItem}
          onCreateTextItem={handleCreateTextItem}
          onFileUpload={handleFileUpload}
          selectedItemIds={selectedItemIds}
          onSelectItem={handleSelectItem}
          onDragComplete={saveItemsToStorage}
        />
      </div>

      <InstanceSetupForm open={showInstanceForm} onSave={handleInstanceSave} onCancel={() => setShowInstanceForm(false)} />
    </div>
  );
}
