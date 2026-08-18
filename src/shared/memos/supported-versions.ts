import { parseMinor } from "./versions";

/**
 * The three Memos API versions published on the docs site, mirroring the
 * `pages` array in content/docs/api/meta.json (newest first). This publication
 * window is independent of the instance compatibility range below.
 */
export const SUPPORTED_DOC_VERSIONS = ["latest", "0-30", "0-29"] as const;

/** The exact product snapshot used by the newest concrete documentation series. */
export const LATEST_SUPPORTED_VERSION = "0.30.0";

const latestSupportedMinor = parseMinor(LATEST_SUPPORTED_VERSION);
if (latestSupportedMinor === null) {
  throw new Error(`LATEST_SUPPORTED_VERSION is not a parseable version: ${LATEST_SUPPORTED_VERSION}`);
}
/** Minor component of LATEST_SUPPORTED_VERSION, parsed once so release bumps can't drift. */
export const LATEST_SUPPORTED_MINOR: number = latestSupportedMinor;

/** Oldest instance release covered by the account connection and stats adapters. */
export const MINIMUM_SUPPORTED_VERSION = "0.26.0";
