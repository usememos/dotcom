// Canonical product copy from usememos/.github@6fe87bfcd881e6ffd977e1041b8835cae9efc56d.
// Change upstream BRAND.md first, then propagate these strings verbatim.
export const BRAND_TAGLINE_LINES = ["Seconds to write.", "Yours to keep."] as const;
export const BRAND_TAGLINE = BRAND_TAGLINE_LINES.join(" ");
export const BRAND_TITLE = `Memos - ${BRAND_TAGLINE}`;
/** BRAND.md One-liner: repository descriptions and page metadata. */
export const BRAND_DESCRIPTION = "A timeline for your thoughts. Just type. It stays yours.";
/** BRAND.md Short: website and README product description. */
export const BRAND_SHORT =
  "Memos is a place for every quick thought. No title, no folder, nothing to pick: type, and the thought is kept on the day you wrote it. Your memos stay where you decide, yours alone until you share one with family and friends.";
/** BRAND.md Standard: documentation introduction and store listings. */
export const BRAND_STANDARD =
  "Memos is an open-source timeline for your quick thoughts. It asks nothing first: no title to invent, no folder to pick, no place to put it. Type, and the thought is kept before it goes. Every memo keeps the day it was written, so any day can be found again: by scrolling, by calendar, by tag, or by word. Your memos live where you decide, report to no one, and leave as plain Markdown whenever you like. They are yours alone until you share one with family or friends, who write their own memos and see only what you choose to show.";
export const BRAND_SOCIAL_DESCRIPTION = BRAND_DESCRIPTION;
