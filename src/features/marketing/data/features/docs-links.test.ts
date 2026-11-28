// @vitest-environment node

import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { FEATURE_SLUGS, FEATURES } from "./index";

function hasDocsPage(href: string) {
  const base = join(process.cwd(), "content", href);
  return existsSync(`${base}.mdx`) || existsSync(join(base, "index.mdx"));
}

describe("feature documentation links", () => {
  it("point only at existing docs pages", () => {
    for (const slug of FEATURE_SLUGS) {
      for (const link of FEATURES[slug].docs ?? []) {
        expect(hasDocsPage(link.href), `${slug}: ${link.href}`).toBe(true);
      }
    }
  });

  it("do not repeat a destination within one feature", () => {
    for (const slug of FEATURE_SLUGS) {
      const hrefs = (FEATURES[slug].docs ?? []).map((link) => link.href);
      expect(new Set(hrefs).size, slug).toBe(hrefs.length);
    }
  });
});
