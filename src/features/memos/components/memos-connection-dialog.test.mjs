import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const dialogSource = readFileSync(new URL("./memos-connection-dialog.tsx", import.meta.url), "utf8");

test("the access token field is a password input that is never prefilled", () => {
  assert.match(dialogSource, /type="password"/);
  assert.match(dialogSource, /A token is already saved\. Enter it again \(or a new one\) to save changes\./);
  assert.doesNotMatch(dialogSource, /setAccessToken\(settings/);
});

test("the dialog offers test, save, and disconnect actions with the privacy note", () => {
  assert.match(dialogSource, /Test connection/);
  assert.match(dialogSource, /: "Save"/); // button label lives in a pending-state ternary
  assert.match(dialogSource, /Disconnect/);
  assert.match(dialogSource, /stored server-side and never sent to the browser/);
});

test("save errors and test results render inside the dialog (no toasts)", () => {
  assert.match(dialogSource, /describeSaveError/);
  assert.match(dialogSource, /describeTestResult/);
  assert.doesNotMatch(dialogSource, /toast/i);
});

test("fields and status messages are wired for screen readers", () => {
  // Field errors are linked back to their inputs and flip aria-invalid.
  assert.match(dialogSource, /aria-invalid=\{saveErrors\.instanceUrl/);
  assert.match(dialogSource, /aria-describedby=\{saveErrors\.instanceUrl \? "memos-instance-url-error"/);
  assert.match(dialogSource, /id="memos-instance-url-error"/);
  assert.match(dialogSource, /aria-invalid=\{saveErrors\.accessToken/);
  assert.match(dialogSource, /id="memos-access-token-error"/);
  assert.match(dialogSource, /id="memos-access-token-hint"/);
  // The test result is a polite live region; the form-level error is an alert.
  assert.match(dialogSource, /role="status"[\s\S]*?aria-live="polite"/);
  assert.match(dialogSource, /role="alert"/);
});

test("action handlers ignore results after the dialog is closed and reopened", () => {
  // An open epoch lets in-flight handlers detect a reset and skip stale setState.
  assert.match(dialogSource, /openEpochRef/);
  assert.match(dialogSource, /openEpochRef\.current \+= 1/);
  assert.match(dialogSource, /const epoch = openEpochRef\.current/);
  assert.match(dialogSource, /if \(openEpochRef\.current !== epoch\)/);
});
