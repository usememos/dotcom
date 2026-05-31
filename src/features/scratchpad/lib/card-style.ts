import type { ScratchpadItem } from "../types";

function hashString(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

export function getCardRotation(item: ScratchpadItem): number {
  const rotationBucket = (hashString(item.id) % 7) - 3;
  return rotationBucket * 0.65;
}

export function getCardRingClass(item: ScratchpadItem, isSelected?: boolean): string {
  if (isSelected) return "ring-2 ring-[#d0b449]/55 shadow-[0_30px_70px_rgba(145,120,41,0.2)]";
  if (item.sync.status === "error") return "ring-2 ring-red-300/80 shadow-[0_24px_60px_rgba(148,67,49,0.18)]";
  if (item.sync.status === "saving") return "ring-2 ring-amber-300/80 shadow-[0_24px_60px_rgba(163,116,38,0.18)]";
  if (item.sync.status === "synced") return "ring-2 ring-emerald-200/80 shadow-[0_24px_60px_rgba(108,125,87,0.14)]";
  return "";
}

export const CARD_TEXT_CLASS_NAME = "font-serif text-[14px] leading-7 text-[#6e5d23]";
