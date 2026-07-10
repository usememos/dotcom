import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const configSource = readFileSync(new URL("../open-next.config.ts", import.meta.url), "utf8");
const wranglerSource = readFileSync(new URL("../wrangler.jsonc", import.meta.url), "utf8");

// Strip block comments and whole-line `//` comments so assertions can't be
// satisfied by commented-out (dead) configuration.
function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .split("\n")
    .filter((line) => !/^\s*\/\//.test(line))
    .join("\n");
}

test("OpenNext intercepts prerendered routes before loading NextServer", () => {
  const config = stripComments(configSource);
  assert.match(config, /incrementalCache\s*:\s*staticAssetsIncrementalCache/);
  assert.match(config, /enableCacheInterception\s*:\s*true/);
});

test("Cloudflare caches eligible responses before invoking the Worker", () => {
  // Parse the JSONC (comments stripped) so the check is robust to key order and
  // to sibling keys like `cross_version_cache`, and rejects commented-out config.
  const wrangler = JSON.parse(stripComments(wranglerSource));
  assert.equal(wrangler.cache?.enabled, true);
});
