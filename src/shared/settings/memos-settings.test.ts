import { describe, expect, it } from "vitest";
import { isRecord } from "./memos-settings";

describe("memos-settings", () => {
  it("isRecord accepts plain objects and rejects everything else", () => {
    expect(isRecord({})).toBe(true);
    expect(isRecord({ a: 1 })).toBe(true);
    expect(isRecord([])).toBe(false);
    expect(isRecord(null)).toBe(false);
    expect(isRecord(undefined)).toBe(false);
    expect(isRecord("nope")).toBe(false);
  });
});
