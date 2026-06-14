"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import type { SafeMemosSettings } from "@/shared/settings/memos-settings";
import { MemosConnectionForm } from "./memos-connection-form";

type MemosConnectionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Shared settings state owned by the host; null until first loaded. */
  settings: SafeMemosSettings | null;
  onSettingsChange: (settings: SafeMemosSettings) => void;
};

export function MemosConnectionDialog({ open, onOpenChange, settings, onSettingsChange }: MemosConnectionDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-stone-950/40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[min(calc(100vw-2rem),26rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-stone-200 bg-white p-5 shadow-lg shadow-stone-900/10 focus:outline-none dark:border-stone-800 dark:bg-stone-950 dark:shadow-black/40">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-base font-semibold text-stone-900 dark:text-stone-100">Connect Memos instance</Dialog.Title>
              <Dialog.Description className="mt-1 text-xs leading-5 text-stone-500 dark:text-stone-400">
                Link your self-hosted Memos instance. Your access token is stored server-side and never sent to the browser.
              </Dialog.Description>
            </div>
            <Dialog.Close
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm text-stone-400 transition hover:text-stone-700 dark:hover:text-stone-200"
              aria-label="Close"
            >
              <XIcon className="h-4 w-4" />
            </Dialog.Close>
          </div>

          <div className="mt-4">
            <MemosConnectionForm settings={settings} onSettingsChange={onSettingsChange} onSaved={() => onOpenChange(false)} />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
