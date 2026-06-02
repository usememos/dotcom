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
