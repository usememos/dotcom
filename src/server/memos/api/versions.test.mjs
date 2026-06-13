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

const { resolveAdapter } = await import("./versions.ts");

const BASE = {
  name: "users/1",
  totalMemoCount: 3,
  tagCount: { a: 1, b: 2 },
  memoTypeStats: { linkCount: 1, codeCount: 2, todoCount: 3, undoCount: 4 },
};
const TS = ["2025-01-01T00:00:00Z", "2025-01-02T00:00:00Z", "2025-01-03T00:00:00Z"];

const FIXTURES = {
  "0.26.2": { ...BASE, memoDisplayTimestamps: TS },
  "0.27.1": { ...BASE, memoDisplayTimestamps: TS },
  "0.28.0": { ...BASE, memoCreatedTimestamps: TS },
  "0.29.1": { ...BASE, memoCreatedTimestamps: TS, memoUpdatedTimestamps: TS },
  latest: { ...BASE, memoCreatedTimestamps: TS, memoUpdatedTimestamps: TS },
};

const EXPECTED = {
  totalMemoCount: 3,
  tagCount: 2,
  memoTypeStats: { link: 1, code: 2, todo: 3, undo: 4 },
  createdTimestamps: TS,
};

test("every documented version normalizes to identical output", () => {
  for (const [version, raw] of Object.entries(FIXTURES)) {
    const adapter = resolveAdapter(version);
    assert.deepEqual(adapter.normalizeStats(raw), EXPECTED, version);
  }
});

test("resolveAdapter maps versions to the right generation", () => {
  assert.equal(resolveAdapter("0.26.2").id, "gen-a");
  assert.equal(resolveAdapter("0.27.1").id, "gen-a");
  assert.equal(resolveAdapter("0.28.0").id, "gen-b");
  assert.equal(resolveAdapter("0.29.1").id, "gen-b");
  assert.equal(resolveAdapter("0.30.0").id, "gen-b");
  assert.equal(resolveAdapter("v0.29.1").id, "gen-b");
});

test("unparseable / missing / below-26 versions fall back, and the fallback reads either timestamp field", () => {
  assert.equal(resolveAdapter("").id, "fallback");
  assert.equal(resolveAdapter("nightly").id, "fallback");
  assert.equal(resolveAdapter("0.25.0").id, "fallback");
  const fallback = resolveAdapter("");
  assert.deepEqual(fallback.normalizeStats({ ...BASE, memoCreatedTimestamps: TS }).createdTimestamps, TS);
  assert.deepEqual(fallback.normalizeStats({ ...BASE, memoDisplayTimestamps: TS }).createdTimestamps, TS);
});

test("all adapters target the same stats path", () => {
  for (const version of ["0.26.2", "0.28.0", ""]) {
    assert.equal(resolveAdapter(version).statsPath("42"), "/api/v1/users/42:getStats");
  }
});
