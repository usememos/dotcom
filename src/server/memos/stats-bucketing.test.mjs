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

const { bucketByUtcDay, ACTIVITY_WINDOW_DAYS } = await import("./stats-bucketing.ts");

const NOW = new Date("2025-06-13T12:00:00Z");

test("counts timestamps per UTC day and sorts ascending", () => {
  const days = bucketByUtcDay(["2025-06-10T01:00:00Z", "2025-06-10T23:00:00Z", "2025-06-12T08:00:00Z"], NOW);
  assert.deepEqual(days, [
    { date: "2025-06-10", count: 2 },
    { date: "2025-06-12", count: 1 },
  ]);
});

test("uses UTC day boundaries, not local time", () => {
  const days = bucketByUtcDay(["2025-06-12T23:30:00Z"], NOW);
  assert.deepEqual(days, [{ date: "2025-06-12", count: 1 }]);
});

test("drops timestamps outside the trailing window and in the future", () => {
  const tooOld = new Date(NOW.getTime() - (ACTIVITY_WINDOW_DAYS + 5) * 86400000).toISOString();
  const future = "2025-06-20T00:00:00Z";
  const days = bucketByUtcDay([tooOld, future, "2025-06-13T00:00:00Z"], NOW);
  assert.deepEqual(days, [{ date: "2025-06-13", count: 1 }]);
});

test("ignores unparseable timestamps and returns empty for no input", () => {
  assert.deepEqual(bucketByUtcDay(["not-a-date"], NOW), []);
  assert.deepEqual(bucketByUtcDay([], NOW), []);
});
