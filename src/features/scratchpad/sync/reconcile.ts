import { type Clock, compareClocks } from "./clock";
import { maxFieldClock } from "./mutations";
import { type Mutation, SCRATCHPAD_FIELD_GROUPS, type StoredCard } from "./types";

export function isCardDeleted(card: StoredCard): boolean {
  if (!card.deletedClock) return false;
  return compareClocks(card.deletedClock, maxFieldClock(card)) >= 0;
}

export interface ReconcileInput {
  local: StoredCard | null;
  remote: StoredCard;
  pending: Mutation[];
}

export function reconcileCard({ local, remote, pending }: ReconcileInput): StoredCard {
  if (!local) {
    return { ...remote, dirty: false };
  }

  const clocks = { ...local.clocks };
  const next: StoredCard = { ...local, clocks };

  // Field-level LWW. Note this is pure last-write-wins: a remote field edit with
  // a clock newer than a local (even pending) delete will win and the card stays
  // alive (isCardDeleted compares deletedClock against the newest field clock).
  // That is the defined single-user/multi-device semantics, not a delete-always-wins.
  for (const g of SCRATCHPAD_FIELD_GROUPS) {
    const pendingNewer = pending.some((m) => m.field === g && compareClocks(m.clock, remote.clocks[g]) > 0);
    if (pendingNewer) continue;
    if (compareClocks(remote.clocks[g], clocks[g]) > 0) {
      clocks[g] = remote.clocks[g];
      if (g === "body") next.content = { ...next.content, body: remote.content.body };
      else if (g === "attachments") next.content = { ...next.content, attachments: remote.content.attachments };
      else if (g === "layout") next.layout = remote.layout;
      else if (g === "tone") next.tone = remote.tone;
    }
  }

  if (remote.deletedClock) {
    const remoteTombstone: Clock = remote.deletedClock;
    const pendingNewerThanTombstone = pending.some((m) => m.field !== "create" && compareClocks(m.clock, remoteTombstone) > 0);
    const beatsLocal = !local.deletedClock || compareClocks(remoteTombstone, local.deletedClock) > 0;
    if (!pendingNewerThanTombstone && beatsLocal) {
      next.deletedAt = remote.deletedAt;
      next.deletedClock = remote.deletedClock;
    }
  }

  next.dirty = pending.length > 0;
  return next;
}
