import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const srcRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const docsRoot = join(srcRoot, "app", "(public)", "docs");

const docsPages = [
  join(docsRoot, "(prose)", "page.tsx"),
  join(docsRoot, "(prose)", "[...slug]", "page.tsx"),
  join(docsRoot, "api", "[version]", "[[...slug]]", "page.tsx"),
];

describe("Docs Carbon placement", () => {
  it.each(docsPages)("keeps one xl main-content placement after prose in %s", (file) => {
    const source = readFileSync(file, "utf8");
    const placement = '<MainContentAds breakpoint="xl" />';

    expect(source.match(new RegExp(placement.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"))).toHaveLength(1);
    expect(source.indexOf(placement)).toBeGreaterThan(source.indexOf("</DocsArticleBody>"));
  });

  it("uses the matching xl sidebar placement in the desktop TOC rail", () => {
    const source = readFileSync(join(srcRoot, "features", "docs", "components", "toc-footer.tsx"), "utf8");
    expect(source).toContain('<SidebarAds breakpoint="xl" />');
  });
});
