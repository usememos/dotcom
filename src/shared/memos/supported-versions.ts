/**
 * The documented Memos API versions, mirroring the `pages` array in
 * content/docs/api/meta.json (newest first). Kept in lockstep by
 * supported-versions.test.ts: adding a docs version folder without updating
 * this constant fails the suite, which is the prompt to revisit the version
 * adapters in ./versions.ts.
 */
export const SUPPORTED_DOC_VERSIONS = ["latest", "0-29", "0-28", "0-27", "0-26"] as const;

/** The exact product snapshot used by the newest concrete documentation series. */
export const LATEST_SUPPORTED_VERSION = "0.29.1";
