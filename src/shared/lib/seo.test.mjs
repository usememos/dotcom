import assert from "node:assert/strict";
import test from "node:test";
import { SITE_NAV_ITEMS } from "./seo.ts";

test("primary site navigation prioritizes product paths over the blog", () => {
  assert.deepEqual(
    SITE_NAV_ITEMS.map((item) => [item.name, item.href]),
    [
      ["Features", "/features"],
      ["Docs", "/docs"],
      ["Scratchpad", "/scratchpad"],
      ["Changelog", "/changelog"],
    ],
  );
  assert.equal(
    SITE_NAV_ITEMS.some((item) => item.href === "/blog"),
    false,
  );
});

test("buildBreadcrumbItems always prepends home", async () => {
  const { buildBreadcrumbItems } = await import("./seo.ts");

  assert.deepEqual(buildBreadcrumbItems([{ href: "/docs", name: "Docs" }]), [
    { href: "/", name: "Home" },
    { href: "/docs", name: "Docs" },
  ]);
});

test("absoluteUrl preserves absolute URLs and expands site paths", async () => {
  const { absoluteUrl } = await import("./seo.ts");

  assert.equal(absoluteUrl("/docs"), "https://usememos.com/docs");
  assert.equal(absoluteUrl("https://demo.usememos.com/"), "https://demo.usememos.com/");
});
