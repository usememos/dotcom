import type { ScratchpadItem } from "../types";
import { type Clock, compareClocks } from "./clock";
import { type Mutation, SCRATCHPAD_FIELD_GROUPS, type ScratchpadFieldGroup, type StoredCard } from "./types";

function initialClocks(clock: Clock): Record<ScratchpadFieldGroup, Clock> {
  return Object.fromEntries(SCRATCHPAD_FIELD_GROUPS.map((g) => [g, clock])) as Record<ScratchpadFieldGroup, Clock>;
}

export function createStoredCard(item: ScratchpadItem, clock: Clock): StoredCard {
  return {
    ...item,
    clocks: initialClocks(clock),
    deletedAt: null,
    deletedClock: null,
    dirty: true,
  };
}

export function maxFieldClock(card: StoredCard): Clock {
  return SCRATCHPAD_FIELD_GROUPS.reduce<Clock>(
    (max, g) => (compareClocks(card.clocks[g], max) > 0 ? card.clocks[g] : max),
    card.clocks.body,
  );
}

export function applyMutationToCard(card: StoredCard | null, mutation: Mutation): StoredCard | null {
  if (mutation.field === "create") {
    return card ?? createStoredCard(mutation.value, mutation.clock);
  }
  if (!card) return card;
  switch (mutation.field) {
    case "body":
      return { ...card, content: { ...card.content, body: mutation.value }, clocks: { ...card.clocks, body: mutation.clock } };
    case "layout":
      return { ...card, layout: mutation.value, clocks: { ...card.clocks, layout: mutation.clock } };
    case "tone":
      return { ...card, tone: mutation.value, clocks: { ...card.clocks, tone: mutation.clock } };
    case "attachments":
      return {
        ...card,
        content: { ...card.content, attachments: mutation.value },
        clocks: { ...card.clocks, attachments: mutation.clock },
      };
    case "delete":
      return { ...card, deletedAt: mutation.clock.ts, deletedClock: mutation.clock };
  }
}

export function mutationWins(card: StoredCard | null, mutation: Mutation): boolean {
  if (mutation.field === "create") return !card;
  if (!card) return false;
  if (mutation.field === "delete") {
    const against = card.deletedClock ?? maxFieldClock(card);
    return compareClocks(mutation.clock, against) > 0;
  }
  return compareClocks(mutation.clock, card.clocks[mutation.field]) > 0;
}

export function coalesceOutbox(mutations: Mutation[]): Mutation[] {
  const latest = new Map<string, Mutation>();
  for (const m of mutations) {
    const key = `${m.cardId}::${m.field}`;
    const existing = latest.get(key);
    if (!existing || m.seq > existing.seq) latest.set(key, m);
  }
  return Array.from(latest.values()).sort((a, b) => a.seq - b.seq);
}
