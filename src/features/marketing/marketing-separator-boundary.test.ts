import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const dir = dirname(fileURLToPath(import.meta.url));
const srcRoot = join(dir, "..", "..");

const reviewedPageFiles = [
  join(srcRoot, "app", "(public)", "(site)", "page.tsx"),
  join(srcRoot, "app", "(public)", "(site)", "pricing", "page.tsx"),
  join(srcRoot, "app", "(public)", "(site)", "privacy", "page.tsx"),
  join(srcRoot, "app", "(public)", "(site)", "web-clipper", "page.tsx"),
  join(srcRoot, "app", "(public)", "(site)", "features", "page.tsx"),
  join(srcRoot, "app", "(public)", "(site)", "features", "[slug]", "page.tsx"),
];

const separatorUtility = /\b(?:border-(?:b|t|y)|divide-[xy])\b/;

describe("marketing separator boundary", () => {
  it("does not turn separators into automatic page-level section chrome", () => {
    for (const file of reviewedPageFiles) {
      const source = readFileSync(file, "utf8");
      const sectionOpenings = source.match(/<section\b[^>]*>/g) ?? [];
      const separatedSections = sectionOpenings.filter((opening) => separatorUtility.test(opening));

      expect(separatedSections.length, file).toBeLessThan(sectionOpenings.length);
    }
  });

  it("lets each SEO page's signature artifact own its separators", () => {
    for (const file of reviewedPageFiles.slice(1, 3)) {
      const source = readFileSync(file, "utf8");

      expect(source, file).toContain("<MarketingSummaryBand items={SUMMARY} separators={false} />");
      expect(source, file).toMatch(/<MarketingFaqSection[\s\S]*?separators=\{false\}[\s\S]*?\/>/);
      expect(source, file).not.toMatch(/<MarketingCtaSection\s+borderTop/);
    }
  });
});
