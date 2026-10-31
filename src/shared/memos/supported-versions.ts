/**
 * The three Memos API versions published on the docs site, mirroring the
 * `pages` array in content/docs/api/meta.json (newest first). This publication
 * window is independent of the instance compatibility range below.
 */
export const SUPPORTED_DOC_VERSIONS = ["latest", "26-10", "0-31"] as const;

/**
 * The exact product snapshot used by the newest concrete documentation series.
 * Calendar versions (`26.10.0`) sort after the old `0.x` line through
 * compareVersion, so compare whole versions rather than minor components.
 */
export const LATEST_SUPPORTED_VERSION = "26.10.0";

/** Oldest instance release covered by the account connection and stats adapters. */
export const MINIMUM_SUPPORTED_VERSION = "0.26.0";
