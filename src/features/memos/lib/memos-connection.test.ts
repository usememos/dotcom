import { describe, expect, it } from "vitest";
import { describeInstanceError } from "@/shared/memos/errors";
import { MemosSettingsRequestError } from "@/shared/settings/memos-settings-client";
import { canSubmitConnectionForm, describeSaveError, describeTestResult } from "./memos-connection";

describe("memos-connection", () => {
  it("canSubmitConnectionForm requires both fields and an idle form", () => {
    expect(canSubmitConnectionForm({ instanceUrl: "https://memos.example.com", accessToken: "token" }, false)).toBe(true);
    expect(canSubmitConnectionForm({ instanceUrl: "https://memos.example.com", accessToken: "token" }, true)).toBe(false);
    expect(canSubmitConnectionForm({ instanceUrl: "  ", accessToken: "token" }, false)).toBe(false);
    expect(canSubmitConnectionForm({ instanceUrl: "https://memos.example.com", accessToken: "  " }, false)).toBe(false);
  });

  it("describeTestResult returns a success message", () => {
    expect(describeTestResult({ ok: true, name: "Steven" })).toEqual({ tone: "success", message: "Connected as Steven" });
  });

  it("describeTestResult carries the error detail", () => {
    const detail = describeInstanceError("unauthorized");
    expect(describeTestResult({ ok: false, error: detail })).toEqual({ tone: "error", detail });
  });

  it("describeSaveError maps 400 field errors to per-field messages", () => {
    const error = new MemosSettingsRequestError("Invalid settings.", 400, {
      instanceUrl: ["Instance URL must be a valid http(s) URL."],
      accessToken: ["Access token is required."],
    });
    expect(describeSaveError(error)).toEqual({
      instanceUrl: "Instance URL must be a valid http(s) URL.",
      accessToken: "Access token is required.",
    });
  });

  it("describeSaveError falls back to a generic form error otherwise", () => {
    const generic = { form: "Couldn't save settings. Try again." };
    expect(describeSaveError(new MemosSettingsRequestError("Failed to save settings.", 502))).toEqual(generic);
    expect(describeSaveError(new MemosSettingsRequestError("Invalid settings.", 400, {}))).toEqual(generic);
    expect(describeSaveError(new Error("network down"))).toEqual(generic);
    expect(describeSaveError(undefined)).toEqual(generic);
  });

  it("describeSaveError uses the caller's fallback message when provided", () => {
    expect(describeSaveError(new Error("network down"), "Couldn't test the connection. Try again.")).toEqual({
      form: "Couldn't test the connection. Try again.",
    });
  });
});
