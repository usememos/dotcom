// @vitest-environment node
import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import {
  BRAND_DESCRIPTION,
  BRAND_PROOF_POINTS,
  BRAND_SOCIAL_DESCRIPTION,
  BRAND_TAGLINE,
  BRAND_TAGLINE_LINES,
  BRAND_TITLE,
} from "./branding";
import { buildDefaultOpenGraphImages } from "./seo";

describe("product branding", () => {
  it("keeps rendered brand copy aligned with the authoritative guidelines", async () => {
    const guidelines = await readFile("docs/brand-guidelines.md", "utf8");
    expect(guidelines).toContain(`**${BRAND_TAGLINE}**`);
    expect(guidelines).toContain(BRAND_DESCRIPTION);
    expect(BRAND_SOCIAL_DESCRIPTION).toBe("Write short memos without titles or folders.");
    for (const point of BRAND_PROOF_POINTS) {
      expect(guidelines).toContain(`| **${point}** |`);
    }
    expect(BRAND_TAGLINE_LINES.join(" ")).toBe("Catch a thought. Keep it yours.");
    expect(buildDefaultOpenGraphImages()[0].alt).toBe(BRAND_TITLE);
  });
});
