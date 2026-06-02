import type { ScratchpadCardTone, ScratchpadItem } from "../types";
import { getScratchpadCardTone } from "./item-model";

export const SCRATCHPAD_CARD_TONE_CLASS_NAMES: Record<ScratchpadCardTone, string> = {
  yellow: "border-[#e5d57d] bg-[#fff2a8] text-[#6e5d23]",
  pink: "border-rose-200 bg-rose-100 text-rose-950",
  blue: "border-sky-200 bg-sky-100 text-sky-950",
  green: "border-emerald-200 bg-emerald-100 text-emerald-950",
  purple: "border-violet-200 bg-violet-100 text-violet-950",
};

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
  return "";
}

export function getCardToneClassNames(item: ScratchpadItem): string {
  return SCRATCHPAD_CARD_TONE_CLASS_NAMES[getScratchpadCardTone(item)];
}

export const CARD_TEXT_CLASS_NAME = "font-sans text-[14px] leading-6 tracking-normal";
