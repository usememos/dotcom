import { describe, expect, it } from "vitest";
import { isRecord, toSafeMemosSettings } from "./memos-settings";

describe("memos-settings", () => {
  it("isRecord accepts plain objects and rejects everything else", () => {
    expect(isRecord({})).toBe(true);
    expect(isRecord({ a: 1 })).toBe(true);
    expect(isRecord([])).toBe(false);
    expect(isRecord(null)).toBe(false);
    expect(isRecord(undefined)).toBe(false);
    expect(isRecord("nope")).toBe(false);
  });

  it("toSafeMemosSettings maps stored settings to the safe shape without the token", () => {
    const safe = toSafeMemosSettings({ instanceUrl: "https://memos.example.com", accessToken: "secret" });
    expect(safe).toEqual({ instanceUrl: "https://memos.example.com", hasAccessToken: true });
    expect(JSON.stringify(safe).includes("secret")).toBe(false);
  });

  it("toSafeMemosSettings returns the empty shape for missing or malformed data", () => {
    const empty = { instanceUrl: null, hasAccessToken: false };
    expect(toSafeMemosSettings(undefined)).toEqual(empty);
    expect(toSafeMemosSettings(null)).toEqual(empty);
    expect(toSafeMemosSettings("nope")).toEqual(empty);
    expect(toSafeMemosSettings([])).toEqual(empty);
    expect(toSafeMemosSettings({ instanceUrl: "", accessToken: "" })).toEqual(empty);
  });
});
