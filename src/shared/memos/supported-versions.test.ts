import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { LATEST_SUPPORTED_VERSION, SUPPORTED_DOC_VERSIONS } from "./supported-versions";

describe("supported-versions", () => {
  const meta = JSON.parse(readFileSync(join(process.cwd(), "content/docs/api/meta.json"), "utf8")) as { pages: string[] };
  const versions = JSON.parse(readFileSync(join(process.cwd(), "src/features/docs/lib/api-docs-versions.json"), "utf8")) as Array<{
    isLatest?: boolean;
    slug: string;
    snapshotVersion: string;
  }>;

  it("mirrors content/docs/api/meta.json pages exactly", () => {
    expect([...SUPPORTED_DOC_VERSIONS]).toEqual(meta.pages);
  });

  it("LATEST_SUPPORTED_VERSION is the newest concrete documentation snapshot", () => {
    const newestVersion = versions.find((version) => !version.isLatest);
    expect(newestVersion).toBeDefined();
    expect(LATEST_SUPPORTED_VERSION).toBe(newestVersion?.snapshotVersion);
  });
});
