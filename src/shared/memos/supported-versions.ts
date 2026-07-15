import { parseMinor } from "./versions";

/**
 * The documented Memos API versions, mirroring the `pages` array in
 * content/docs/api/meta.json (newest first). Kept in lockstep by
 * supported-versions.test.ts: adding a docs version folder without updating
 * this constant fails the suite, which is the prompt to revisit the version
 * adapters in ./versions.ts.
 */
export const SUPPORTED_DOC_VERSIONS = ["latest", "0-30", "0-29", "0-28", "0-27", "0-26"] as const;

/** The exact product snapshot used by the newest concrete documentation series. */
export const LATEST_SUPPORTED_VERSION = "0.30.0-rc.1";

const latestSupportedMinor = parseMinor(LATEST_SUPPORTED_VERSION);
if (latestSupportedMinor === null) {
  throw new Error(`LATEST_SUPPORTED_VERSION is not a parseable version: ${LATEST_SUPPORTED_VERSION}`);
}
/** Minor component of LATEST_SUPPORTED_VERSION, parsed once so release bumps can't drift. */
export const LATEST_SUPPORTED_MINOR: number = latestSupportedMinor;

/** Oldest instance release covered by the account connection and stats adapters. */
export const MINIMUM_SUPPORTED_VERSION = "0.26.0";
