import { describe, expect, it } from "vitest";
import { compareChangelogVersions, sortChangelogPages } from "./changelog";

describe("compareChangelogVersions", () => {
  it("orders release candidates by their numeric identifier", () => {
    expect(compareChangelogVersions("Release v0.30.0-rc.2", "Release v0.30.0-rc.1")).toBeLessThan(0);
  });

  it("orders a stable release before prereleases of the same version", () => {
    expect(compareChangelogVersions("Release v0.30.0", "Release v0.30.0-rc.2")).toBeLessThan(0);
  });
});

describe("sortChangelogPages", () => {
  it("marks the newest release candidate as the first entry", () => {
    const pages = [
      { data: { title: "Release v0.30.0-rc.1" } },
      { data: { title: "Release v0.30.0-rc.2" } },
      { data: { title: "Release v0.29.1" } },
    ];

    expect(sortChangelogPages(pages).map((page) => page.data.title)).toEqual([
      "Release v0.30.0-rc.2",
      "Release v0.30.0-rc.1",
      "Release v0.29.1",
    ]);
  });
});
