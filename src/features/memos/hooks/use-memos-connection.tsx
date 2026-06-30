"use client";

import { useUser } from "@clerk/nextjs";
import { type ReactNode, useCallback, useMemo, useState } from "react";
import type { MemosCredentials } from "@/shared/memos/instance-client";
import { isRecord } from "@/shared/settings/memos-settings";
import { MemosConnectionDialog } from "../components/memos-connection-dialog";

type UseMemosConnection = {
  /** The saved connection (instanceUrl + token), or null when not connected. */
  credentials: MemosCredentials | null;
  isConnected: boolean;
  /** Clerk has finished loading the user. */
  isLoaded: boolean;
  isSignedIn: boolean;
  instanceUrl: string | null;
  /** Opens the connection dialog (callers opening from a Radix dropdown should defer with setTimeout). */
  open: () => void;
  /** Pre-wired <MemosConnectionDialog>; render once in the consuming tree. */
  dialog: ReactNode;
};

/** Reads the stored Memos connection from Clerk `unsafeMetadata.memos`. */
function readCredentials(metadata: unknown): MemosCredentials | null {
  const memos = isRecord(metadata) ? metadata.memos : null;
  if (!isRecord(memos)) {
    return null;
  }
  const { instanceUrl, accessToken } = memos;
  if (typeof instanceUrl === "string" && instanceUrl.length > 0 && typeof accessToken === "string" && accessToken.length > 0) {
    return { instanceUrl, accessToken };
  }
  return null;
}

/**
 * Owns the Memos connection, stored in Clerk `unsafeMetadata` and read/written
 * directly from the browser. Also owns the dialog open state and a ready-to-render
 * dialog wired to save/disconnect.
 */
export function useMemosConnection(): UseMemosConnection {
  const { user, isLoaded, isSignedIn } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const credentials = useMemo(() => readCredentials(user?.unsafeMetadata), [user?.unsafeMetadata]);

  const save = useCallback(
    async (creds: MemosCredentials) => {
      if (!user) {
        return;
      }
      await user.update({ unsafeMetadata: { ...user.unsafeMetadata, memos: creds } });
    },
    [user],
  );

  const disconnect = useCallback(async () => {
    if (!user) {
      return;
    }
    const next = { ...(user.unsafeMetadata as Record<string, unknown>) };
    delete next.memos;
    await user.update({ unsafeMetadata: next });
  }, [user]);

  const dialog: ReactNode = (
    <MemosConnectionDialog
      open={isOpen}
      onOpenChange={setIsOpen}
      instanceUrl={credentials?.instanceUrl ?? null}
      connected={credentials !== null}
      onSave={save}
      onDisconnect={disconnect}
    />
  );

  return {
    credentials,
    isConnected: credentials !== null,
    isLoaded,
    isSignedIn: isSignedIn ?? false,
    instanceUrl: credentials?.instanceUrl ?? null,
    open: useCallback(() => setIsOpen(true), []),
    dialog,
  };
}
