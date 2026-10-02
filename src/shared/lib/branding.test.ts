// @vitest-environment node
import { describe, expect, it } from "vitest";
import { BRAND_DESCRIPTION, BRAND_SOCIAL_DESCRIPTION, BRAND_TAGLINE, BRAND_TAGLINE_LINES, BRAND_TITLE } from "./branding";
import { buildDefaultOpenGraphImages } from "./seo";

describe("product branding", () => {
  it("keeps the approved copy from BRAND.md", () => {
    expect(BRAND_TAGLINE).toBe("Your thoughts, your data, shared on your terms.");
    expect(BRAND_TAGLINE_LINES.join(" ")).toBe(BRAND_TAGLINE);
    expect(BRAND_DESCRIPTION).toBe("Your own timeline for quick notes, private by default.");
    expect(BRAND_SOCIAL_DESCRIPTION).toBe(BRAND_DESCRIPTION);
    expect(buildDefaultOpenGraphImages()[0].alt).toBe(BRAND_TITLE);
  });
});
