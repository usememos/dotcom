import { describe, expect, it } from "vitest";
import { absoluteUrl, buildBreadcrumbItems, SITE_NAV_ITEMS } from "./seo";

describe("seo", () => {
  it("primary site navigation prioritizes product paths over the blog", () => {
    expect(SITE_NAV_ITEMS.map((item) => [item.name, item.href])).toEqual([
      ["Features", "/features"],
      ["Docs", "/docs"],
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
});
