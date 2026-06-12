import assert from "node:assert/strict";
import test from "node:test";

const { isRecord, toSafeMemosSettings } = await import("./memos-settings.ts");

test("isRecord accepts plain objects and rejects everything else", () => {
  assert.equal(isRecord({}), true);
  assert.equal(isRecord({ a: 1 }), true);
  assert.equal(isRecord([]), false);
  assert.equal(isRecord(null), false);
  assert.equal(isRecord(undefined), false);
  assert.equal(isRecord("nope"), false);
});

test("toSafeMemosSettings maps stored settings to the safe shape without the token", () => {
  const safe = toSafeMemosSettings({ instanceUrl: "https://memos.example.com", accessToken: "secret" });
  assert.deepEqual(safe, { instanceUrl: "https://memos.example.com", hasAccessToken: true });
  assert.equal(JSON.stringify(safe).includes("secret"), false);
});

test("toSafeMemosSettings returns the empty shape for missing or malformed data", () => {
  const empty = { instanceUrl: null, hasAccessToken: false };
  assert.deepEqual(toSafeMemosSettings(undefined), empty);
  assert.deepEqual(toSafeMemosSettings(null), empty);
  assert.deepEqual(toSafeMemosSettings("nope"), empty);
  assert.deepEqual(toSafeMemosSettings([]), empty);
  assert.deepEqual(toSafeMemosSettings({ instanceUrl: "", accessToken: "" }), empty);
});
