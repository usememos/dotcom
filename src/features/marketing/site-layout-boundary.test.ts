import { readdirSync, readFileSync } from "node:fs";
import { dirname, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const dir = dirname(fileURLToPath(import.meta.url));
const srcRoot = join(dir, "..", "..");

function listSourceFiles(directory: string): string[] {
  return readdirSync(directory, { recursive: true, encoding: "utf8" })
    .filter((entry) => [".ts", ".tsx"].includes(extname(entry)) && !entry.includes(".test."))
    .map((entry) => join(directory, entry));
}

describe("public site layout boundary", () => {
  it("defines one shared site container", () => {
    const globalCss = readFileSync(join(srcRoot, "app", "global.css"), "utf8");

    // `@utility` (not a bare `.site-container` rule) keeps the container in
    // Tailwind's utilities layer so composed padding/width utilities can win.
    expect(globalCss).toMatch(/@utility site-container/);
    expect(globalCss).not.toMatch(/^\.site-container/m);
    expect(globalCss).toMatch(/max-width: var\(--site-layout-width\)/);
    expect(globalCss).toMatch(/padding-inline: 1rem/);
  });

  it("uses the shared container in the site chrome and page shells", () => {
    const shellFiles = [
      join(srcRoot, "features", "marketing", "components", "site-header.tsx"),
      join(srcRoot, "features", "marketing", "components", "footer.tsx"),
      join(srcRoot, "features", "marketing", "components", "hero-section.tsx"),
      join(srcRoot, "features", "marketing", "components", "marketing-page.tsx"),
      join(srcRoot, "features", "editorial", "components", "editorial-index.tsx"),
    ];

    for (const file of shellFiles) {
      expect(readFileSync(file, "utf8"), relative(srcRoot, file)).toMatch(/site-container/);
    }
  });

  it("does not reintroduce legacy outer widths in public site features", () => {
    const roots = [
      join(srcRoot, "app", "(public)", "(site)"),
      join(srcRoot, "features", "marketing"),
      join(srcRoot, "features", "editorial"),
    ];
    const legacyWidth = /max-w-(?:5xl|6xl)|max-w-\(--site-layout-width\)/;
    const violations = roots
      .flatMap(listSourceFiles)
      .filter((file) => legacyWidth.test(readFileSync(file, "utf8")))
      .map((file) => relative(srcRoot, file));

    expect(violations).toEqual([]);
  });

  it("keeps marketing heroes content-sized instead of viewport-sized", () => {
    const heroFiles = [
      join(srcRoot, "features", "marketing", "components", "hero-section.tsx"),
      join(srcRoot, "app", "(public)", "(site)", "web-clipper", "page.tsx"),
    ];
    const viewportHeight = /(?:min-)?h-(?:screen|\[[^\]]*100(?:s|d)?vh[^\]]*\])/;
    const violations = heroFiles.filter((file) => viewportHeight.test(readFileSync(file, "utf8"))).map((file) => relative(srcRoot, file));

    expect(violations).toEqual([]);
  });
});
