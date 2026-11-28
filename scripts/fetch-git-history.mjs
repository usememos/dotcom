// Docs last-modified dates (sitemap.xml and docs JSON-LD) come from Git history,
// and source.config.ts only emits them when the checkout is not shallow. Build
// hosts clone shallowly, so fetch the rest of the history before building.
//
// This step must never fail the build: without full history the site simply
// publishes no docs dates, exactly as before.
import { spawnSync } from "node:child_process";

const FETCH_TIMEOUT_MS = 120_000;

function git(args, options = {}) {
  return spawnSync("git", args, { encoding: "utf8", ...options });
}

const shallow = git(["rev-parse", "--is-shallow-repository"]);

if (shallow.error || shallow.status !== 0) {
  console.log("[git-history] Not a Git checkout; docs dates will be omitted.");
} else if (shallow.stdout.trim() !== "true") {
  console.log("[git-history] Full history already available.");
} else {
  const fetch = git(["fetch", "--unshallow", "--no-tags", "--quiet"], { timeout: FETCH_TIMEOUT_MS, stdio: "inherit" });

  if (fetch.error || fetch.status !== 0) {
    console.warn("[git-history] Could not fetch full history; docs dates will be omitted.");
  } else {
    console.log("[git-history] Fetched full history for docs dates.");
  }
}
