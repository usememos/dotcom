"use client";

import { useUser } from "@clerk/nextjs";
import { useCallback, useMemo, useRef } from "react";
import type { MemosCredentials } from "@/shared/memos/instance-client";
import { MemosConnectionConflictError, readMemosCredentials, sameMemosCredentials } from "@/shared/settings/memos-settings";

type UseMemosConnection = {
  credentials: MemosCredentials | null;
  isConnected: boolean;
  isLoaded: boolean;
  isSignedIn: boolean;
  instanceUrl: string | null;
  save: (credentials: MemosCredentials) => Promise<void>;
  disconnect: () => Promise<void>;
};

/**
 * Reads and mutates the account-level Memos connection in Clerk unsafe metadata.
 * Writes first reload the user and compare the last-seen connection so another
 * settings page cannot be silently overwritten, then reload again so consumers
 * see the written state without their own refresh.
 */
export function useMemosConnection(): UseMemosConnection {
  const { user, isLoaded, isSignedIn } = useUser();
  // Clerk hands out a new metadata reference on every user refresh; keep the
  // credentials object identity stable while its values are unchanged so
  // effects keyed on it don't refire (and refetch) spuriously.
  const credentialsRef = useRef<MemosCredentials | null>(null);
  const credentials = useMemo(() => {
    const next = readMemosCredentials(user?.unsafeMetadata);
    if (!sameMemosCredentials(next, credentialsRef.current)) {
      credentialsRef.current = next;
    }
    return credentialsRef.current;
  }, [user?.unsafeMetadata]);

  const assertUnchanged = useCallback(
    async (expected: MemosCredentials | null) => {
      if (!user) {
        throw new Error("Sign in before changing the connection.");
      }
      const latest = await user.reload();
      if (!sameMemosCredentials(readMemosCredentials(latest.unsafeMetadata), expected)) {
        throw new MemosConnectionConflictError();
      }
      return latest;
    },
    [user],
  );

  const save = useCallback(
    async (next: MemosCredentials) => {
      const latest = await assertUnchanged(credentials);
      await latest.updateMetadata({ unsafeMetadata: { memos: next } });
      await latest.reload();
    },
    [assertUnchanged, credentials],
  );

  const disconnect = useCallback(async () => {
    const latest = await assertUnchanged(credentials);
    await latest.updateMetadata({ unsafeMetadata: { memos: null } });
    await latest.reload();
  }, [assertUnchanged, credentials]);

  return {
    credentials,
    isConnected: credentials !== null,
    isLoaded,
    isSignedIn: isSignedIn ?? false,
    instanceUrl: credentials?.instanceUrl ?? null,
    save,
    disconnect,
  };
}
