import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const carbonAdCardSource = readFileSync(new URL("./carbon-ad-card.tsx", import.meta.url), "utf8");

test("default sponsor fallback uses content-driven spacing", () => {
  assert.match(carbonAdCardSource, /default:\s*"w-full\b[^"]*\bpy-2\b/);
  assert.match(carbonAdCardSource, /default:\s*\n\s*"[^"]*\bleading-5\b/);
  assert.match(carbonAdCardSource, /className=\{FALLBACK_STYLES\.default\}>\s*Support Memos\s*<\/a>/);
  assert.doesNotMatch(carbonAdCardSource, /default:\s*"h-\d+/);
});
