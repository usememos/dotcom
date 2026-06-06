import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const configSource = readFileSync(new URL("../open-next.config.ts", import.meta.url), "utf8");

test("OpenNext does not CDN-cache prerendered HTML/RSC responses", () => {
  assert.doesNotMatch(configSource, /enableCacheInterception\s*:\s*true/);
});
