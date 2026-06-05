import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const layoutSource = readFileSync(new URL("./layout.tsx", import.meta.url), "utf8");

test("scratchpad layout relies on the root theme provider", () => {
  assert.doesNotMatch(layoutSource, /@\/features\/scratchpad\/components\/theme-provider/);
  assert.doesNotMatch(layoutSource, /<ThemeProvider>/);
  assert.doesNotMatch(layoutSource, /<\/ThemeProvider>/);
});

test("scratchpad layout stays static to avoid Worker SSR script transforms", () => {
  assert.match(layoutSource, /export const dynamic = "force-static";/);
  assert.doesNotMatch(layoutSource, /export const dynamic = "force-dynamic";/);
});
