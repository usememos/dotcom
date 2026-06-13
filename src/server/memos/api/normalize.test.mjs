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

const { normalizeUserStats } = await import("./normalize.ts");

test("reads totals, distinct tag count, memo type stats, and the first present timestamp field", () => {
  const raw = {
    name: "users/1",
    totalMemoCount: 5,
    tagCount: { work: 3, life: 2 },
    memoTypeStats: { linkCount: 1, codeCount: 2, todoCount: 3, undoCount: 4 },
    memoCreatedTimestamps: ["2025-01-01T00:00:00Z", "2025-01-02T00:00:00Z"],
  };
  const result = normalizeUserStats(raw, ["memoCreatedTimestamps", "memoDisplayTimestamps"]);
  assert.deepEqual(result, {
    totalMemoCount: 5,
    tagCount: 2,
    memoTypeStats: { link: 1, code: 2, todo: 3, undo: 4 },
    createdTimestamps: ["2025-01-01T00:00:00Z", "2025-01-02T00:00:00Z"],
  });
});

test("falls back to the second timestamp field when the first is absent", () => {
  const raw = { memoDisplayTimestamps: ["2025-03-01T00:00:00Z"] };
  const result = normalizeUserStats(raw, ["memoCreatedTimestamps", "memoDisplayTimestamps"]);
  assert.deepEqual(result.createdTimestamps, ["2025-03-01T00:00:00Z"]);
});

test("defaults missing numeric fields to 0 and missing collections to empty", () => {
  const result = normalizeUserStats({}, ["memoCreatedTimestamps"]);
  assert.deepEqual(result, {
    totalMemoCount: 0,
    tagCount: 0,
    memoTypeStats: { link: 0, code: 0, todo: 0, undo: 0 },
    createdTimestamps: [],
  });
});

test("ignores non-string timestamp entries", () => {
  const raw = { memoCreatedTimestamps: ["2025-01-01T00:00:00Z", 42, null, "2025-01-03T00:00:00Z"] };
  const result = normalizeUserStats(raw, ["memoCreatedTimestamps"]);
  assert.deepEqual(result.createdTimestamps, ["2025-01-01T00:00:00Z", "2025-01-03T00:00:00Z"]);
});

test("returns null when the payload is not an object", () => {
  assert.equal(normalizeUserStats("nope", ["memoCreatedTimestamps"]), null);
  assert.equal(normalizeUserStats(null, ["memoCreatedTimestamps"]), null);
  assert.equal(normalizeUserStats([1, 2], ["memoCreatedTimestamps"]), null);
});
