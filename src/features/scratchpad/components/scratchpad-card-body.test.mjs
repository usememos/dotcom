import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const cardBodySource = readFileSync(new URL("./scratchpad-card-body.tsx", import.meta.url), "utf8");
const cardItemSource = readFileSync(new URL("./card-item.tsx", import.meta.url), "utf8");

test("empty scratchpad cards invite editing instead of card creation", () => {
  assert.match(cardBodySource, /Any thoughts\.\.\./);
  assert.match(cardItemSource, /Click to edit note/);
  assert.match(cardItemSource, /Select note\. Press Enter to edit\./);
  assert.doesNotMatch(cardBodySource, /create card/i);
  assert.doesNotMatch(cardItemSource, /create card/i);
  assert.doesNotMatch(cardBodySource, /Double-click to add a card/);
  assert.doesNotMatch(cardItemSource, /Double-click to add a card/);
  assert.doesNotMatch(cardItemSource, /Press Enter to add a card/);
});
