import { describe, expect, it } from "vitest";
import { normalizeUserStats } from "./normalize";

describe("normalize", () => {
  it("reads totals, distinct tag count, memo type stats, and the first present timestamp field", () => {
    const raw = {
      name: "users/1",
      totalMemoCount: 5,
      tagCount: { work: 3, life: 2 },
      memoTypeStats: { linkCount: 1, codeCount: 2, todoCount: 3, undoCount: 4 },
      memoCreatedTimestamps: ["2025-01-01T00:00:00Z", "2025-01-02T00:00:00Z"],
    };
    const result = normalizeUserStats(raw, ["memoCreatedTimestamps", "memoDisplayTimestamps"]);
    expect(result).toEqual({
      totalMemoCount: 5,
      tagCount: 2,
      memoTypeStats: { link: 1, code: 2, todo: 3, undo: 4 },
      createdTimestamps: ["2025-01-01T00:00:00Z", "2025-01-02T00:00:00Z"],
    });
  });

  it("falls back to the second timestamp field when the first is absent", () => {
    const raw = { memoDisplayTimestamps: ["2025-03-01T00:00:00Z"] };
    const result = normalizeUserStats(raw, ["memoCreatedTimestamps", "memoDisplayTimestamps"]);
    expect(result?.createdTimestamps).toEqual(["2025-03-01T00:00:00Z"]);
  });

  it("defaults missing numeric fields to 0 and missing collections to empty", () => {
    const result = normalizeUserStats({}, ["memoCreatedTimestamps"]);
    expect(result).toEqual({
      totalMemoCount: 0,
      tagCount: 0,
      memoTypeStats: { link: 0, code: 0, todo: 0, undo: 0 },
      createdTimestamps: [],
    });
  });

  it("ignores non-string timestamp entries", () => {
    const raw = { memoCreatedTimestamps: ["2025-01-01T00:00:00Z", 42, null, "2025-01-03T00:00:00Z"] };
    const result = normalizeUserStats(raw, ["memoCreatedTimestamps"]);
    expect(result?.createdTimestamps).toEqual(["2025-01-01T00:00:00Z", "2025-01-03T00:00:00Z"]);
  });

  it("returns null when the payload is not an object", () => {
    expect(normalizeUserStats("nope", ["memoCreatedTimestamps"])).toBeNull();
    expect(normalizeUserStats(null, ["memoCreatedTimestamps"])).toBeNull();
    expect(normalizeUserStats([1, 2], ["memoCreatedTimestamps"])).toBeNull();
  });
});
