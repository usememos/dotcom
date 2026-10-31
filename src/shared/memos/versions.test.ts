import { describe, expect, it } from "vitest";
import { resolveAdapter, resolveApiBasePath } from "./versions";

describe("versions", () => {
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
    "0.30.0-rc.1": { ...BASE, memoCreatedTimestamps: TS, memoUpdatedTimestamps: TS },
    "26.10.0": { ...BASE, tagCount: undefined, tagCounts: { a: 1, b: 2 }, memoCreatedTimestamps: TS, memoUpdatedTimestamps: TS },
    latest: { ...BASE, memoCreatedTimestamps: TS, memoUpdatedTimestamps: TS },
  };

  const EXPECTED = {
    totalMemoCount: 3,
    tagCount: 2,
    memoTypeStats: { link: 1, code: 2, todo: 3, undo: 4 },
    createdTimestamps: TS,
  };

  it("every documented version normalizes to identical output", () => {
    for (const [version, raw] of Object.entries(FIXTURES)) {
      const adapter = resolveAdapter(version);
      expect(adapter.normalizeStats(raw)).toEqual(EXPECTED);
    }
  });

  it("resolveAdapter maps versions to the right generation", () => {
    expect(resolveAdapter("0.26.2").id).toBe("gen-a");
    expect(resolveAdapter("0.27.1").id).toBe("gen-a");
    expect(resolveAdapter("0.28.0").id).toBe("gen-b");
    expect(resolveAdapter("0.29.1").id).toBe("gen-b");
    expect(resolveAdapter("0.30.0").id).toBe("gen-b");
    expect(resolveAdapter("0.30.0-rc.1").id).toBe("gen-b");
    expect(resolveAdapter("v0.29.1").id).toBe("gen-b");
    expect(resolveAdapter("26.10.0").id).toBe("gen-c");
    expect(resolveAdapter("26.10.0-rc.2").id).toBe("gen-c");
    expect(resolveAdapter("27.1.0").id).toBe("gen-c");
  });

  it("unparseable / missing / below-26 versions fall back, and the fallback reads either timestamp field", () => {
    expect(resolveAdapter("").id).toBe("fallback");
    expect(resolveAdapter("nightly").id).toBe("fallback");
    expect(resolveAdapter("0.25.0").id).toBe("fallback");
    const fallback = resolveAdapter("");
    expect(fallback.normalizeStats({ ...BASE, memoCreatedTimestamps: TS }).createdTimestamps).toEqual(TS);
    expect(fallback.normalizeStats({ ...BASE, memoDisplayTimestamps: TS }).createdTimestamps).toEqual(TS);
  });

  it("0.x adapters use the /api/v1 stats path and calendar versions use /api", () => {
    for (const version of ["0.26.2", "0.28.0", ""]) {
      expect(resolveAdapter(version).basePath).toBe("/api/v1");
      expect(resolveAdapter(version).statsPath("42")).toBe("/api/v1/users/42:getStats");
    }
    expect(resolveAdapter("26.10.0").basePath).toBe("/api");
    expect(resolveAdapter("26.10.0").statsPath("42")).toBe("/api/users/42:getStats");
  });

  it("resolveApiBasePath picks the prefix from the major version", () => {
    expect(resolveApiBasePath("0.31.0")).toBe("/api/v1");
    expect(resolveApiBasePath("v0.26.2")).toBe("/api/v1");
    expect(resolveApiBasePath("26.10.0")).toBe("/api");
    expect(resolveApiBasePath("26.10-rc.1")).toBe("/api");
    expect(resolveApiBasePath("nightly")).toBeNull();
  });
});
