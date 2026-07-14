"use client";

import { PlugIcon } from "lucide-react";
import type { MemosCredentials } from "@/shared/memos/instance-client";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/shared/ui/dialog";
import { MemosConnectionForm } from "./memos-connection-form";

type MemosConnectionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The saved instance URL to prefill, or null. */
  instanceUrl: string | null;
  /** Whether a token is already saved (drives the disconnect action + hint). */
  connected: boolean;
  onSave: (credentials: MemosCredentials) => Promise<void>;
  onDisconnect: () => Promise<void>;
};

export function MemosConnectionDialog({ open, onOpenChange, instanceUrl, connected, onSave, onDisconnect }: MemosConnectionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(calc(100vw-2rem),26rem)] gap-0 rounded-lg border border-stone-200 bg-white p-5 shadow-lg shadow-stone-900/10 dark:border-stone-800 dark:bg-stone-950 dark:shadow-black/40 sm:max-w-none">
        <div>
          <span className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400">
            <PlugIcon className="h-5 w-5" />
          </span>
          <DialogTitle className="text-base font-semibold text-stone-900 dark:text-stone-100">Connect your Memos instance</DialogTitle>
          <DialogDescription className="mt-1 text-xs leading-5 text-stone-500 dark:text-stone-400">
            Link your self-hosted instance to power your activity heatmap and writing stats.
          </DialogDescription>
        </div>

        <div className="mt-4">
          <MemosConnectionForm
            instanceUrl={instanceUrl}
            connected={connected}
            onSave={onSave}
            onDisconnect={onDisconnect}
            onDone={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
