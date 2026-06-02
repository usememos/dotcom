import type { ScratchpadCardTone, ScratchpadItem } from "../types";
import { getScratchpadCardTone } from "./item-model";

export const SCRATCHPAD_CARD_TONE_CLASS_NAMES: Record<ScratchpadCardTone, string> = {
  yellow: "border-[#e3d99f] bg-[#f7f0c6] text-stone-900 dark:border-[#514b36] dark:bg-[#343126] dark:text-stone-100",
  pink: "border-rose-200 bg-rose-50 text-stone-900 dark:border-rose-900/50 dark:bg-[#35282d] dark:text-rose-50",
  blue: "border-sky-200 bg-sky-50 text-stone-900 dark:border-sky-900/50 dark:bg-[#25313a] dark:text-sky-50",
  green: "border-emerald-200 bg-emerald-50 text-stone-900 dark:border-emerald-900/50 dark:bg-[#26342d] dark:text-emerald-50",
  purple: "border-violet-200 bg-violet-50 text-stone-900 dark:border-violet-900/50 dark:bg-[#302b3b] dark:text-violet-50",
};

function hashString(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

export function getCardRotation(item: ScratchpadItem): number {
  const rotationBucket = (hashString(item.id) % 5) - 2;
  return rotationBucket * 0.35;
}

export function getCardRingClass(isSelected?: boolean): string {
  if (isSelected) return "ring-1 ring-stone-900/20 shadow-[0_18px_40px_rgba(28,25,23,0.14)] dark:ring-stone-200/30";
  return "";
}

export function getCardToneClassNames(item: ScratchpadItem): string {
  return SCRATCHPAD_CARD_TONE_CLASS_NAMES[getScratchpadCardTone(item)];
}

export function getCardChromeClassNames(): string {
  return "rounded-[6px] border shadow-[0_10px_26px_rgba(28,25,23,0.08)] dark:shadow-[0_18px_44px_rgba(0,0,0,0.28)]";
}

export function getCardResizeHandleClassNames(): string {
  return "absolute bottom-0 right-0 h-8 w-8 cursor-se-resize opacity-0 transition-opacity group-hover/card:opacity-45 group-hover:opacity-80 group-focus-within/card:opacity-60";
}

export const CARD_TEXT_CLASS_NAME = "font-sans text-[14px] leading-6 tracking-normal";
