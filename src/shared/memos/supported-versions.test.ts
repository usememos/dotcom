import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { LATEST_SUPPORTED_MINOR, LATEST_SUPPORTED_VERSION, SUPPORTED_DOC_VERSIONS } from "./supported-versions";

describe("supported-versions", () => {
  const meta = JSON.parse(readFileSync(join(process.cwd(), "content/docs/api/meta.json"), "utf8")) as { pages: string[] };
  const versions = JSON.parse(readFileSync(join(process.cwd(), "src/features/docs/lib/api-docs-versions.json"), "utf8")) as Array<{
    archived?: boolean;
    isLatest?: boolean;
    slug: string;
    snapshotVersion: string;
  }>;
  const publishedVersions = versions.filter((version) => !version.archived);
  const archivedVersions = versions.filter((version) => version.archived);
  const apiContentDirectory = join(process.cwd(), "content/docs/api");
  const openApiDirectory = join(process.cwd(), "openapi");

  it("publishes exactly three versions in the generated navigation", () => {
    expect(publishedVersions).toHaveLength(3);
    expect(publishedVersions.map((version) => version.slug)).toEqual(meta.pages);
    expect([...SUPPORTED_DOC_VERSIONS]).toEqual(meta.pages);
  });

  it("retains OpenAPI snapshots for archived documentation versions", () => {
    expect(archivedVersions.length).toBeGreaterThan(0);
    for (const version of archivedVersions) {
      expect(existsSync(join(openApiDirectory, `${version.slug}.yaml`))).toBe(true);
    }
  });

  it("tracks every OpenAPI snapshot exactly once in the manifest", () => {
    const manifestSlugs = versions.map((version) => version.slug);
    const snapshotSlugs = readdirSync(openApiDirectory)
      .filter((file) => file.endsWith(".yaml"))
      .map((file) => file.replace(/\.yaml$/, ""));

    expect(new Set(manifestSlugs).size).toBe(manifestSlugs.length);
    expect(snapshotSlugs.sort()).toEqual(manifestSlugs.sort());
  });

  it("generates content directories only for published versions", () => {
    const generatedVersionDirectories = readdirSync(apiContentDirectory, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);

    expect(generatedVersionDirectories.sort()).toEqual(meta.pages.toSorted());
  });

  it("LATEST_SUPPORTED_VERSION is the newest concrete documentation snapshot", () => {
    const newestVersion = publishedVersions.find((version) => !version.isLatest);
    expect(newestVersion).toBeDefined();
    expect(LATEST_SUPPORTED_VERSION).toBe(newestVersion?.snapshotVersion);
  });

  it("LATEST_SUPPORTED_MINOR is parsed from LATEST_SUPPORTED_VERSION", () => {
    expect(LATEST_SUPPORTED_MINOR).toBe(Number(LATEST_SUPPORTED_VERSION.split(".")[1]));
  });
});
