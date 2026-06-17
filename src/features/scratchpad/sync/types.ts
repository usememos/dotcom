import type { ScratchpadAttachmentRef, ScratchpadCardTone, ScratchpadItem, ScratchpadItemLayout } from "../types";
import type { Clock } from "./clock";

export type ScratchpadFieldGroup = "body" | "layout" | "tone" | "attachments";

export const SCRATCHPAD_FIELD_GROUPS: ScratchpadFieldGroup[] = ["body", "layout", "tone", "attachments"];

/** A card plus its sync metadata. Persisted in the `cards` store. */
export interface StoredCard extends ScratchpadItem {
  clocks: Record<ScratchpadFieldGroup, Clock>;
  deletedAt: number | null;
  deletedClock: Clock | null;
  dirty: boolean;
}

export type Mutation =
  | { seq: number; cardId: string; clock: Clock; field: "create"; value: ScratchpadItem }
  | { seq: number; cardId: string; clock: Clock; field: "body"; value: string }
  | { seq: number; cardId: string; clock: Clock; field: "layout"; value: ScratchpadItemLayout }
  | { seq: number; cardId: string; clock: Clock; field: "tone"; value: ScratchpadCardTone }
  | { seq: number; cardId: string; clock: Clock; field: "attachments"; value: ScratchpadAttachmentRef[] }
  | { seq: number; cardId: string; clock: Clock; field: "delete"; value: null };

export type MutationDraft = Omit<Mutation, "seq">;

export interface PushRequest {
  mutations: Mutation[];
  cursor: string | null;
}
export interface PushResponse {
  acked: number[];
  changes: StoredCard[];
  cursor: string;
}
export interface PullRequest {
  cursor: string | null;
}
export interface PullResponse {
  changes: StoredCard[];
  cursor: string;
}
