import { describe, expect, it } from "vitest";
import { absoluteUrl, buildBreadcrumbItems, buildFaqJsonLd, SITE_NAV_ITEMS } from "./seo";

describe("seo", () => {
  it("primary site navigation prioritizes product paths over the blog", () => {
    expect(SITE_NAV_ITEMS.map((item) => [item.name, item.href])).toEqual([
      ["Features", "/features"],
      ["Docs", "/docs"],
      ["Web Clipper", "/web-clipper"],
      ["Scratchpad", "/scratchpad"],
      ["Changelog", "/changelog"],
    ]);
    expect(SITE_NAV_ITEMS.some((item) => item.href === "/blog")).toBe(false);
  });

  it("buildBreadcrumbItems always prepends home", () => {
    expect(buildBreadcrumbItems([{ href: "/docs", name: "Docs" }])).toEqual([
      { href: "/", name: "Home" },
      { href: "/docs", name: "Docs" },
    ]);
  });

  it("absoluteUrl preserves absolute URLs and expands site paths", () => {
    expect(absoluteUrl("/docs")).toBe("https://usememos.com/docs");
    expect(absoluteUrl("https://demo.usememos.com/")).toBe("https://demo.usememos.com/");
  });

  it("buildFaqJsonLd emits a FAQPage with one Question per item", () => {
    const jsonLd = buildFaqJsonLd([{ question: "Is Memos free?", answer: "Yes, it is open source." }]);

    expect(jsonLd["@type"]).toBe("FAQPage");
    expect(jsonLd.mainEntity).toEqual([
      {
        "@type": "Question",
        name: "Is Memos free?",
        acceptedAnswer: { "@type": "Answer", text: "Yes, it is open source." },
      },
    ]);
  });
});
