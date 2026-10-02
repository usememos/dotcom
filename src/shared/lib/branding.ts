// Canonical product copy, copied verbatim from https://github.com/usememos/.github/blob/main/BRAND.md.
// Change BRAND.md first, then update these strings.
export const BRAND_TAGLINE_LINES = ["Your thoughts, your data,", "shared on your terms."] as const;
export const BRAND_TAGLINE = BRAND_TAGLINE_LINES.join(" ");
export const BRAND_TITLE = `Memos - ${BRAND_TAGLINE}`;
/** BRAND.md "One-liner": repository descriptions and page metadata. */
export const BRAND_DESCRIPTION = "Your own timeline for quick notes, private by default.";
/** BRAND.md "Short": paired with the tagline in the homepage hero. */
export const BRAND_SHORT =
  "Memos is a timeline for your notes, and it belongs to you. Write in Markdown, post in seconds, and choose who sees each memo: just you, the people you invite, or anyone with the link.";
/** BRAND.md "Standard": docs introduction and longer listings. */
export const BRAND_STANDARD =
  "Memos is an open-source timeline for your thoughts. Write a memo in seconds, tag it, attach files, and move on. Every memo is private by default; share one with the people you choose, or with anyone who has the link, when you want to. Your notes are yours: you keep them where you decide, nobody else reads them, and you can take them with you at any time.";
/** The fixed-size social image uses the one-liner, which fits at sharing size. */
export const BRAND_SOCIAL_DESCRIPTION = BRAND_DESCRIPTION;
export const BRAND_PROOF_POINTS = ["Private and free", "Zero telemetry", "Deploys in seconds"] as const;
