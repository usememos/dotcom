// Canonical product copy. Change together with docs/brand-guidelines.md.
export const BRAND_TAGLINE_LINES = ["Catch a thought.", "Keep it yours."] as const;
export const BRAND_TAGLINE = BRAND_TAGLINE_LINES.join(" ");
export const BRAND_TITLE = `Memos - ${BRAND_TAGLINE}`;
export const BRAND_DESCRIPTION = "Write short memos without titles or folders. Find them later by search, tag, or date.";
/** The description's first sentence, for the fixed-size social image where the full line would truncate. */
export const BRAND_SOCIAL_DESCRIPTION = `${BRAND_DESCRIPTION.split(". ")[0]}.`;
export const BRAND_PROOF_POINTS = ["Private and free", "Zero telemetry", "Deploys in seconds"] as const;
