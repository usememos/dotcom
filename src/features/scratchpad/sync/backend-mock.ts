import type { SyncBackend } from "./backend";
import { applyMutationToCard, coalesceOutbox, mutationWins } from "./mutations";
import type { Mutation, PullRequest, PullResponse, PushRequest, PushResponse, StoredCard } from "./types";

export function createMockBackend(): SyncBackend {
  const cards = new Map<string, { card: StoredCard; version: number }>();
  const blobs = new Map<string, Blob>();
  let version = 0;

  const applyMutation = (m: Mutation): void => {
    const existing = cards.get(m.cardId)?.card ?? null;
    if (!mutationWins(existing, m)) return;
    const next = applyMutationToCard(existing, m);
    if (!next) return;
    version += 1;
    cards.set(m.cardId, { card: { ...next, dirty: false }, version });
  };

  const changesSince = (cursor: number): StoredCard[] =>
    Array.from(cards.values())
      .filter((e) => e.version > cursor)
      .sort((a, b) => a.version - b.version)
      .map((e) => e.card);

  return {
    async push({ mutations, cursor }: PushRequest): Promise<PushResponse> {
      for (const m of coalesceOutbox(mutations)) applyMutation(m);
      return { acked: mutations.map((m) => m.seq), changes: changesSince(cursor ? Number(cursor) : 0), cursor: String(version) };
    },
    async pull({ cursor }: PullRequest): Promise<PullResponse> {
      return { changes: changesSince(cursor ? Number(cursor) : 0), cursor: String(version) };
    },
    async hasBlob(hash: string): Promise<boolean> {
      return blobs.has(hash);
    },
    async putBlob(hash: string, data: Blob): Promise<void> {
      blobs.set(hash, data);
    },
    async getBlob(hash: string): Promise<Blob> {
      const blob = blobs.get(hash);
      if (!blob) throw new Error(`blob not found: ${hash}`);
      return blob;
    },
  };
}
