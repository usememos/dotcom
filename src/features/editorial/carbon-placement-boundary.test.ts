import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const srcRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const siteRoot = join(srcRoot, "app", "(public)", "(site)");

const articlePages = [join(siteRoot, "blog", "[slug]", "page.tsx"), join(siteRoot, "changelog", "[slug]", "page.tsx")];

describe("editorial Carbon placement", () => {
  it.each(articlePages)("uses main-content and sidebar placements in %s", (file) => {
    const source = readFileSync(file, "utf8");
    const mainContentPlacement = "<MainContentAds />";
    const sidebarPlacement = "<SidebarAds />";
    const articleBody = source.indexOf("<EditorialArticleBody");
    const stickyRail = source.indexOf('<div className="sticky top-24 space-y-8">');
    const toc = source.indexOf("<TOCSidebar");

    expect(source.split(mainContentPlacement)).toHaveLength(2);
    expect(source.split(sidebarPlacement)).toHaveLength(2);
    expect(articleBody).toBeGreaterThan(-1);
    expect(stickyRail).toBeGreaterThan(-1);
    expect(toc).toBeGreaterThan(stickyRail);
    expect(source.indexOf(mainContentPlacement)).toBeGreaterThan(articleBody);
    expect(source.indexOf(sidebarPlacement)).toBeGreaterThan(toc);
  });
});
