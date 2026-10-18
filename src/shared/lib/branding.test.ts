import { readFileSync } from "node:fs";
// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  BRAND_DESCRIPTION,
  BRAND_SHORT,
  BRAND_SOCIAL_DESCRIPTION,
  BRAND_STANDARD,
  BRAND_TAGLINE,
  BRAND_TAGLINE_LINES,
  BRAND_TITLE,
} from "./branding";
import { buildDefaultOpenGraphImages } from "./seo";

describe("product branding", () => {
  it("keeps the approved copy from BRAND.md", () => {
    expect(BRAND_TAGLINE).toBe("Seconds to write. Yours to keep.");
    expect(BRAND_TAGLINE_LINES.join(" ")).toBe(BRAND_TAGLINE);
    expect(BRAND_DESCRIPTION).toBe("A timeline for your thoughts. Just type. It stays yours.");
    expect(BRAND_SHORT).toContain("No title, no folder, nothing to pick:");
    expect(readFileSync("content/docs/index.mdx", "utf8")).toContain(BRAND_STANDARD);
    expect(BRAND_SOCIAL_DESCRIPTION).toBe(BRAND_DESCRIPTION);
    expect(buildDefaultOpenGraphImages()[0].alt).toBe(BRAND_TITLE);
  });
});
