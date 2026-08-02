import { describe, expect, it } from "vitest";
import { absoluteUrl, buildBreadcrumbItems, buildFaqJsonLd, buildSiteNavigationJsonLd, SITE_NAV_ITEMS, SITE_NAV_LINKS } from "./seo";

describe("seo", () => {
  it("groups the primary site navigation around visitor tasks", () => {
    expect(SITE_NAV_ITEMS.map((item) => item.name)).toEqual(["Product", "Tools", "Docs", "Resources"]);
    expect(SITE_NAV_LINKS.map((item) => item.name)).toEqual([
      "Features",
      "Use Cases",
      "Compare",
      "Web Clipper",
      "Live Demo",
      "Docs",
      "API Reference",
      "Blog",
      "Changelog",
    ]);
    expect(SITE_NAV_LINKS.some((item) => item.href === "/pricing")).toBe(false);
  });

  it("keeps the API reference in Resources", () => {
    const resources = SITE_NAV_ITEMS.find((item) => item.name === "Resources");
    const tools = SITE_NAV_ITEMS.find((item) => item.name === "Tools");

    expect(resources && "items" in resources ? resources.items.map((item) => item.name) : []).toContain("API Reference");
    expect(tools && "items" in tools ? tools.items.map((item) => item.name) : []).not.toContain("API Reference");
  });

  it("emits internal navigation destinations as structured data", () => {
    const jsonLd = buildSiteNavigationJsonLd();
    const names = jsonLd.itemListElement.map((item) => item.name);

    expect(jsonLd.name).toBe("Memos site navigation");
    expect(jsonLd.numberOfItems).toBe(jsonLd.itemListElement.length);
    expect(names).toContain("Get Started");
    expect(names).not.toContain("Live Demo");
    expect(jsonLd.itemListElement.find((item) => item.name === "Features")).toMatchObject({
      description: "Explore self-hosted note-taking features",
      url: "https://usememos.com/features",
    });
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
