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

test("the signed-in menu links to the dashboard and offers sign out", () => {
  assert.match(accountMenuSource, /href="\/dashboard"/);
  assert.match(accountMenuSource, /SignOutItem/);
});

test("connection and account management are delegated to the dashboard", () => {
  assert.doesNotMatch(accountMenuSource, /connectionMenuLabel/);
  assert.doesNotMatch(accountMenuSource, /Connect Memos instance/);
  assert.doesNotMatch(accountMenuSource, /Manage account/);
  assert.doesNotMatch(accountMenuSource, /AccountActionItems/);
  assert.doesNotMatch(accountMenuSource, /PlugIcon/);
});

test("the toolbar no longer mounts the connection dialog", () => {
  assert.doesNotMatch(toolbarSource, /useMemosConnection/);
  assert.doesNotMatch(toolbarSource, /connection\.dialog/);
  assert.doesNotMatch(accountMenuSource, /MemosConnectionDialog/);
});
