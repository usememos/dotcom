import { readFileSync } from "node:fs";
// @vitest-environment node
import { describe, expect, it } from "vitest";
import { BRAND_DESCRIPTION, BRAND_FULL_INTRODUCTION, BRAND_HEADLINE, BRAND_TITLE } from "./branding";
import { buildDefaultOpenGraphImages } from "./seo";

describe("product branding", () => {
  it("keeps the approved copy from BRAND.md", () => {
    expect(BRAND_HEADLINE).toBe("Simple note-taking for your everyday thoughts.");
    expect(BRAND_DESCRIPTION).toBe(
      "Memos is an open-source, self-hosted note-taking app that brings your everyday thoughts together in a personal timeline. Your data stays yours, and you choose what to keep private or share.",
    );
    expect(BRAND_FULL_INTRODUCTION.split("\n\n")).toHaveLength(3);
    expect(readFileSync("content/docs/index.mdx", "utf8")).toContain(BRAND_FULL_INTRODUCTION);
    expect(readFileSync("content/docs/faq.mdx", "utf8")).toContain(BRAND_DESCRIPTION);
    expect(buildDefaultOpenGraphImages()[0].alt).toBe(BRAND_TITLE);
  });
});
