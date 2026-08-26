import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const srcRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const siteRoot = join(srcRoot, "app", "(public)", "(site)");

const articlePages = [join(siteRoot, "blog", "[slug]", "page.tsx"), join(siteRoot, "changelog", "[slug]", "page.tsx")];

describe("editorial Carbon placement", () => {
  it.each(articlePages)("keeps Carbon in the intro and direct sponsors after the article in %s", (file) => {
    const source = readFileSync(file, "utf8");
    const mobileCarbon = '<AdsSectionMobile items={["carbon"]}';
    const desktopCarbon = '<AdsSectionDesktop items={["carbon"]} />';
    const mobileSponsors = '<AdsSectionMobile items={["sponsors"]} />';
    const desktopSponsors = '<AdsSectionDesktop items={["sponsors"]} />';
    const articleBody = source.indexOf("<EditorialArticleBody");

    expect(source.split(mobileCarbon)).toHaveLength(2);
    expect(source.split(desktopCarbon)).toHaveLength(2);
    expect(source.split(mobileSponsors)).toHaveLength(2);
    expect(source.split(desktopSponsors)).toHaveLength(2);
    expect(source.indexOf(mobileCarbon)).toBeLessThan(articleBody);
    expect(source.indexOf(desktopCarbon)).toBeLessThan(articleBody);
    expect(source.indexOf(mobileSponsors)).toBeGreaterThan(articleBody);
    expect(source.indexOf(desktopSponsors)).toBeGreaterThan(articleBody);
  });

  it("lets a blog hero deliver its evidence before the mobile ad", () => {
    const source = readFileSync(articlePages[0], "utf8");
    expect(source.indexOf('<AdsSectionMobile items={["carbon"]}')).toBeGreaterThan(source.indexOf("<BlogPostHeroImage"));
  });
});
