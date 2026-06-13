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

function makeStorage(initial = {}) {
  const store = new Map(Object.entries(initial));
  return {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
  };
}

// stats-cache reads window.localStorage at call time, so install the stub before calling.
globalThis.window = { localStorage: makeStorage() };

const { readDashboardStatsCache, writeDashboardStatsCache, clearDashboardStatsCache } = await import("./stats-cache.ts");

const VALID = {
  userId: "7",
  version: "0.29.1",
  stats: {
    totalMemoCount: 5,
    tagCount: 2,
    memoTypeStats: { link: 1, code: 0, todo: 0, undo: 0 },
    days: [{ date: "2025-06-12", count: 2 }],
  },
  fetchedAt: 1_700_000_000_000,
};

test("write then read round-trips the cached value", () => {
  globalThis.window = { localStorage: makeStorage() };
  writeDashboardStatsCache(VALID);
  assert.deepEqual(readDashboardStatsCache(), VALID);
});

test("read returns null when nothing is stored", () => {
  globalThis.window = { localStorage: makeStorage() };
  assert.equal(readDashboardStatsCache(), null);
});

test("read returns null for malformed JSON", () => {
  globalThis.window = { localStorage: makeStorage({ "memos:dashboard-stats:v1": "{not json" }) };
  assert.equal(readDashboardStatsCache(), null);
});

test("read rejects a structurally invalid object", () => {
  globalThis.window = { localStorage: makeStorage({ "memos:dashboard-stats:v1": JSON.stringify({ userId: 7 }) }) };
  assert.equal(readDashboardStatsCache(), null);
});

test("read accepts a null version", () => {
  globalThis.window = { localStorage: makeStorage() };
  writeDashboardStatsCache({ ...VALID, version: null });
  assert.equal(readDashboardStatsCache().version, null);
});

test("clear removes the cached value", () => {
  globalThis.window = { localStorage: makeStorage() };
  writeDashboardStatsCache(VALID);
  clearDashboardStatsCache();
  assert.equal(readDashboardStatsCache(), null);
});

test("read returns null when window is undefined (SSR)", () => {
  const saved = globalThis.window;
  globalThis.window = undefined;
  assert.equal(readDashboardStatsCache(), null);
  globalThis.window = saved;
});
