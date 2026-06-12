import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import test from "node:test";

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith(".") && !specifier.match(/\.[cm]?[jt]sx?$/)) {
      try {
        return nextResolve(`${specifier}.ts`, context);
      } catch {
        return nextResolve(specifier, context);
      }
    }

    return nextResolve(specifier, context);
  },
});

const { canSubmitConnectionForm, connectionMenuLabel, describeSaveError, describeTestResult } = await import("./memos-connection.ts");
const { MemosSettingsRequestError } = await import("../../../shared/settings/memos-settings-client.ts");

test("canSubmitConnectionForm requires both fields and an idle form", () => {
  assert.equal(canSubmitConnectionForm({ instanceUrl: "https://memos.example.com", accessToken: "token" }, false), true);
  assert.equal(canSubmitConnectionForm({ instanceUrl: "https://memos.example.com", accessToken: "token" }, true), false);
  assert.equal(canSubmitConnectionForm({ instanceUrl: "  ", accessToken: "token" }, false), false);
  assert.equal(canSubmitConnectionForm({ instanceUrl: "https://memos.example.com", accessToken: "  " }, false), false);
});

test("connectionMenuLabel reflects the connection state", () => {
  assert.equal(connectionMenuLabel(false), "Connect Memos instance");
  assert.equal(connectionMenuLabel(true), "Memos instance");
});

test("describeTestResult maps every outcome to a friendly message", () => {
  assert.deepEqual(describeTestResult({ ok: true, user: { name: "Steven" } }), { tone: "success", message: "Connected as Steven" });
  assert.deepEqual(describeTestResult({ ok: false, reason: "unauthorized" }), {
    tone: "error",
    message: "Token was rejected by the instance.",
  });
  assert.deepEqual(describeTestResult({ ok: false, reason: "timeout" }), { tone: "error", message: "Connection timed out." });
  assert.deepEqual(describeTestResult({ ok: false, reason: "redirected" }), {
    tone: "error",
    message: "The instance redirected — use the URL it redirects to.",
  });
  assert.deepEqual(describeTestResult({ ok: false, reason: "invalid-response" }), {
    tone: "error",
    message: "The URL doesn't look like a Memos instance.",
  });
  assert.deepEqual(describeTestResult({ ok: false, reason: "unreachable" }), { tone: "error", message: "Instance couldn't be reached." });
});

test("describeSaveError maps 400 field errors to per-field messages", () => {
  const error = new MemosSettingsRequestError("Invalid settings.", 400, {
    instanceUrl: ["Instance URL must be a valid http(s) URL."],
    accessToken: ["Access token is required."],
  });
  assert.deepEqual(describeSaveError(error), {
    instanceUrl: "Instance URL must be a valid http(s) URL.",
    accessToken: "Access token is required.",
  });
});

test("describeSaveError falls back to a generic form error otherwise", () => {
  const generic = { form: "Couldn't save settings. Try again." };
  assert.deepEqual(describeSaveError(new MemosSettingsRequestError("Failed to save settings.", 502)), generic);
  assert.deepEqual(describeSaveError(new MemosSettingsRequestError("Invalid settings.", 400, {})), generic);
  assert.deepEqual(describeSaveError(new Error("network down")), generic);
  assert.deepEqual(describeSaveError(undefined), generic);
});

test("describeSaveError uses the caller's fallback message when provided", () => {
  assert.deepEqual(describeSaveError(new Error("network down"), "Couldn't test the connection. Try again."), {
    form: "Couldn't test the connection. Try again.",
  });
});
