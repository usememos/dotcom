import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const accountMenuSource = readFileSync(new URL("./scratchpad-account-menu-section.tsx", import.meta.url), "utf8");
const toolbarSource = readFileSync(new URL("./scratchpad-toolbar.tsx", import.meta.url), "utf8");

test("signed-in scratchpad account menu shows a full-width local-only notice", () => {
  assert.match(accountMenuSource, /Always Local-only/);
  assert.doesNotMatch(accountMenuSource, /Signing in only verifies your account/);
  assert.match(accountMenuSource, /Your cards stay on this device and are not uploaded to the cloud/);
  assert.match(accountMenuSource, /Any other thoughts\?/);
  assert.match(accountMenuSource, /w-full rounded-md border border-teal-200/);
  assert.match(accountMenuSource, /mt-1\.5 text-xs leading-4/);
  assert.match(accountMenuSource, /mt-1 inline-flex/);
  assert.doesNotMatch(accountMenuSource, /<span className="truncate">Local-only/);
});

test("scratchpad account dropdown keeps the standard compact menu width", () => {
  assert.match(toolbarSource, /className="z-50 w-56 /);
  assert.doesNotMatch(toolbarSource, /w-\[min\(calc\(100vw-1rem\),18rem\)\]/);
});

test("the signed-in menu offers the memos connection entry with a connected indicator", () => {
  assert.match(accountMenuSource, /connectionMenuLabel/);
  assert.match(accountMenuSource, /onOpenMemosConnection/);
  assert.match(accountMenuSource, /PlugIcon/);
  assert.match(accountMenuSource, /bg-teal-500/);
});

test("the connected indicator is announced to screen readers", () => {
  // The teal dot is decorative; a visually-hidden label carries the meaning.
  assert.match(accountMenuSource, /bg-teal-500" aria-hidden="true"/);
  assert.match(accountMenuSource, /<span className="sr-only">Connected<\/span>/);
  assert.doesNotMatch(accountMenuSource, /bg-teal-500" title="Connected"/);
});

test("opening the dialog is deferred so it does not overlap the closing dropdown layer", () => {
  // A synchronous open overlaps the dropdown's and dialog's Radix DismissableLayers,
  // leaving `body { pointer-events: none }` stuck after the dialog closes. Deferring
  // to the next macrotask lets the menu's modal layer unmount first.
  assert.match(accountMenuSource, /setTimeout\(onOpenMemosConnection, 0\)/);
});

test("the toolbar owns the dialog so it survives the menu closing", () => {
  assert.match(toolbarSource, /MemosConnectionDialog/);
  assert.match(toolbarSource, /memosConnectionOpen/);
  assert.doesNotMatch(accountMenuSource, /MemosConnectionDialog/);
});
