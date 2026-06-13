"use client";

import { useUser } from "@clerk/nextjs";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import type { SafeMemosSettings } from "@/shared/settings/memos-settings";
import { getMemosSettings } from "@/shared/settings/memos-settings-client";
import { MemosConnectionDialog } from "../components/memos-connection-dialog";

type UseMemosConnectionOptions = {
  /** Called after settings are saved/disconnected via the dialog. */
  onSettingsChange?: (settings: SafeMemosSettings) => void;
};

type UseMemosConnection = {
  settings: SafeMemosSettings | null;
  isConnected: boolean;
  /** Opens the connection dialog (raw; callers opening from a Radix dropdown should defer with setTimeout). */
  open: () => void;
  /** Pre-wired <MemosConnectionDialog>; render once in the consuming tree. */
  dialog: ReactNode;
};

/** Owns the Memos connection settings load, dialog open state, and a ready-to-render dialog. */
export function useMemosConnection(options: UseMemosConnectionOptions = {}): UseMemosConnection {
  const { isSignedIn } = useUser();
  const { onSettingsChange } = options;
  const [settings, setSettings] = useState<SafeMemosSettings | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isSignedIn || settings !== null) {
      return;
    }
    let cancelled = false;
    getMemosSettings()
      .then((loaded) => {
        if (!cancelled) {
          setSettings(loaded);
        }
      })
      .catch(() => {
        // Falls back to the disconnected label; the dialog surfaces errors.
      });
    return () => {
      cancelled = true;
    };
  }, [isSignedIn, settings]);

  const handleSettingsChange = useCallback(
    (next: SafeMemosSettings) => {
      setSettings(next);
      onSettingsChange?.(next);
    },
    [onSettingsChange],
  );

  const dialog: ReactNode = (
    <MemosConnectionDialog open={isOpen} onOpenChange={setIsOpen} settings={settings} onSettingsChange={handleSettingsChange} />
  );

  return {
    settings,
    isConnected: settings?.hasAccessToken === true,
    open: useCallback(() => setIsOpen(true), []),
    dialog,
  };
}
