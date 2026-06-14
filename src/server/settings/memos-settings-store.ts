import { clerkClient } from "@clerk/nextjs/server";
import type { MemosSettings } from "./memos-settings-schema";

/**
 * Persistence seam for a user's Memos connection settings.
 *
 * This is the named boundary the route handlers depend on. Today it is backed
 * by Clerk `privateMetadata`; a later implementation can back it with D1 behind
 * the same interface without touching any handler or route code.
 * See docs/architecture.md ("Data access").
 */
export interface MemosSettingsStore {
  /** Returns the raw stored `memos` object (including the token), or null. */
  read(userId: string): Promise<unknown>;
  /** Persists settings for a user, or clears them when passed null. */
  write(userId: string, settings: MemosSettings | null): Promise<void>;
}

/** The subset of the Clerk backend client this store uses. */
type ClerkClientLike = {
  users: {
    getUser(userId: string): Promise<{ privateMetadata?: { memos?: unknown } }>;
    updateUserMetadata(userId: string, params: { privateMetadata: { memos: MemosSettings | null } }): Promise<unknown>;
  };
};

/**
 * Clerk-backed Memos settings store. `getClient` is injectable for tests;
 * production defaults to Clerk's `clerkClient`. The cast adapts Clerk's broad
 * client type to the narrow surface this store actually uses.
 */
export function createClerkMemosSettingsStore(
  getClient: () => Promise<ClerkClientLike> = clerkClient as () => Promise<ClerkClientLike>,
): MemosSettingsStore {
  return {
    async read(userId) {
      const client = await getClient();
      const user = await client.users.getUser(userId);
      return user.privateMetadata?.memos ?? null;
    },
    async write(userId, settings) {
      const client = await getClient();
      await client.users.updateUserMetadata(userId, { privateMetadata: { memos: settings } });
    },
  };
}
