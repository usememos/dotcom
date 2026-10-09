import { describe, expect, it } from "vitest";
import { compareChangelogVersions, sortChangelogPages } from "./changelog";

describe("compareChangelogVersions", () => {
  it("orders release candidates by their numeric identifier", () => {
    expect(compareChangelogVersions("Release v0.30.0-rc.2", "Release v0.30.0-rc.1")).toBeLessThan(0);
  });

  it("orders a stable release before prereleases of the same version", () => {
    expect(compareChangelogVersions("Release v0.30.0", "Release v0.30.0-rc.2")).toBeLessThan(0);
  });

  it("orders CalVer releases across months and patch versions", () => {
    expect(compareChangelogVersions("Release 26.11", "Release 26.10.1")).toBeLessThan(0);
    expect(compareChangelogVersions("Release 26.10.1", "Release 26.10")).toBeLessThan(0);
    expect(compareChangelogVersions("Release 27.01", "Release 26.12")).toBeLessThan(0);
    expect(compareChangelogVersions("Release 26.10", "Release 26.10.0")).toBe(0);
  });

  it("orders CalVer candidates numerically, behind their stable release", () => {
    expect(compareChangelogVersions("Release 26.10-rc.10", "Release 26.10-rc.2")).toBeLessThan(0);
    expect(compareChangelogVersions("Release 26.10", "Release 26.10-rc.10")).toBeLessThan(0);
    expect(compareChangelogVersions("Release 26.10.1", "Release 26.10.1-rc.1")).toBeLessThan(0);
  });
});

describe("sortChangelogPages", () => {
  it("places the new CalVer candidate ahead of historical releases", () => {
    const pages = [
      { data: { title: "Release v0.31.0" } },
      { data: { title: "Release 26.10-rc.1" } },
      { data: { title: "Release v0.31.0-rc.2" } },
    ];

    expect(sortChangelogPages(pages).map((page) => page.data.title)).toEqual([
      "Release 26.10-rc.1",
      "Release v0.31.0",
      "Release v0.31.0-rc.2",
    ]);
  });

  it("marks the newest release candidate as the first entry", () => {
    const pages = [
      { data: { title: "Release v0.30.0-rc.1" } },
      { data: { title: "Release v0.30.0-rc.2" } },
      { data: { title: "Release v0.30.0" } },
      { data: { title: "Release v0.29.1" } },
    ];

    expect(sortChangelogPages(pages).map((page) => page.data.title)).toEqual([
      "Release v0.30.0",
      "Release v0.30.0-rc.2",
      "Release v0.30.0-rc.1",
      "Release v0.29.1",
    ]);
  });
});
