/**
 * The documented Memos API versions, mirroring the `pages` array in
 * content/docs/api/meta.json (newest first). Kept in lockstep by
 * supported-versions.test.ts: adding a docs version folder without updating
 * this constant fails the suite, which is the prompt to revisit the version
 * adapters in ./versions.ts.
 */
export const SUPPORTED_DOC_VERSIONS = ["latest", "0-29-1", "0-28-0", "0-27-1", "0-26-2"] as const;

/** The newest concrete (non-"latest") documented version, e.g. "0.29.1". */
export const LATEST_SUPPORTED_VERSION = "0.29.1";
