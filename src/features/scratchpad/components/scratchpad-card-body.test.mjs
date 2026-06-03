import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const cardBodySource = readFileSync(new URL("./scratchpad-card-body.tsx", import.meta.url), "utf8");
const cardItemSource = readFileSync(new URL("./card-item.tsx", import.meta.url), "utf8");
const scratchpadLayoutSource = readFileSync(new URL("../../../app/(tools)/scratchpad/layout.tsx", import.meta.url), "utf8");

test("scratchpad card copy consistently refers to cards", () => {
  assert.match(cardBodySource, /Any thoughts\.\.\./);
  assert.match(cardItemSource, /Click to edit card/);
  assert.match(cardItemSource, /Edit card/);
  assert.match(cardItemSource, /Select card\. Press Enter to edit\./);
  assert.match(scratchpadLayoutSource, /quick cards/);
  assert.match(scratchpadLayoutSource, /visual cards/);
  assert.doesNotMatch(cardBodySource, /create card/i);
  assert.doesNotMatch(cardItemSource, /create card/i);
  assert.doesNotMatch(cardBodySource, /Double-click to add a card/);
  assert.doesNotMatch(cardItemSource, /Double-click to add a card/);
  assert.doesNotMatch(cardItemSource, /Press Enter to add a card/);
  assert.doesNotMatch(cardItemSource, new RegExp("\\bno" + "te\\b", "i"));
  assert.doesNotMatch(scratchpadLayoutSource, new RegExp("\\bno" + "tes\\b", "i"));
});
