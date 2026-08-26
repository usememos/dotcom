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
  it.each(docsPages)("keeps one xl mobile ad before prose and sponsors after it in %s", (file) => {
    const source = readFileSync(file, "utf8");
    const carbonPlacement = '<AdsSectionMobile breakpoint="xl" items={["carbon"]} />';
    const sponsorPlacement = '<AdsSectionMobile breakpoint="xl" items={["sponsors"]} />';

    expect(source.match(new RegExp(carbonPlacement.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"))).toHaveLength(1);
    expect(source.match(new RegExp(sponsorPlacement.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"))).toHaveLength(1);
    expect(source.indexOf(carbonPlacement)).toBeLessThan(source.indexOf("<DocsArticleBody>"));
    expect(source.indexOf(sponsorPlacement)).toBeGreaterThan(source.indexOf("</DocsArticleBody>"));
  });

  it("uses the matching xl breakpoint and puts Carbon first in the desktop TOC rail", () => {
    const source = readFileSync(join(srcRoot, "features", "docs", "components", "toc-footer.tsx"), "utf8");
    expect(source).toContain('<AdsSectionDesktop breakpoint="xl" items={["carbon", "sponsors"]} />');
  });
});
