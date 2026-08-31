import { describe, expect, it } from "vitest";
import {
  absoluteUrl,
  buildBreadcrumbItems,
  buildFaqJsonLd,
  buildSiteNavigationJsonLd,
  SITE_NAV_DEMO,
  SITE_NAV_ITEMS,
  SITE_NAV_LINKS,
} from "./seo";

describe("seo", () => {
  it("groups the primary site navigation around visitor tasks", () => {
    expect(SITE_NAV_ITEMS.map((item) => item.name)).toEqual(["Features", "Use Cases", "Docs", "Resources"]);
    expect(SITE_NAV_LINKS.map((item) => item.name)).toEqual([
      "All Features",
      "Self-Hosted",
      "Open Source",
      "Markdown Notes",
      "API & Integrations",
      "All Use Cases",
      "Personal Journaling",
      "Developers",
      "Writers",
      "Homelab & Self-Hosting",
      "Docs",
      "Changelog",
      "Blog",
      "API Reference",
    ]);
    expect(SITE_NAV_LINKS.some((item) => item.href === "/pricing")).toBe(false);
  });

  it("leads the Features and Use Cases menus with their index pages", () => {
    for (const [group, href] of [
      ["Features", "/features"],
      ["Use Cases", "/use-cases"],
    ] as const) {
      const item = SITE_NAV_ITEMS.find((navItem) => navItem.name === group);
      expect(item && "items" in item ? item.items[0]?.href : undefined).toBe(href);
    }
  });

  it("ranks Changelog above Blog in Resources", () => {
    const resources = SITE_NAV_ITEMS.find((item) => item.name === "Resources");
    const names = resources && "items" in resources ? resources.items.map((item) => item.name) : [];

    expect(names.indexOf("Changelog")).toBeLessThan(names.indexOf("Blog"));
    expect(names).toContain("API Reference");
  });

  it("keeps the live demo out of the crawlable navigation links", () => {
    expect(SITE_NAV_DEMO.external).toBe(true);
    expect(SITE_NAV_LINKS.some((item) => item.href === SITE_NAV_DEMO.href)).toBe(false);
  });

  it("emits internal navigation destinations as structured data", () => {
    const jsonLd = buildSiteNavigationJsonLd();
    const names = jsonLd.itemListElement.map((item) => item.name);

    expect(jsonLd.name).toBe("Memos site navigation");
    expect(jsonLd.numberOfItems).toBe(jsonLd.itemListElement.length);
    expect(names).toContain("Get Started");
    expect(names).not.toContain("Live Demo");
    expect(jsonLd.itemListElement.find((item) => item.name === "All Features")).toMatchObject({
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
