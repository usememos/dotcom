import assert from "node:assert/strict";
import test from "node:test";
import nextConfig from "../next.config.mjs";

function headersBySource(entries, source) {
  const entry = entries.find((item) => item.source === source);

  assert.ok(entry, `${source} header rule should exist`);

  return new Map(entry.headers.map((header) => [header.key.toLowerCase(), header.value]));
}

test("only generated Open Graph images allow cross-origin reads", async () => {
  const rules = await nextConfig.headers();
  const ogImages = headersBySource(rules, "/og/:path*");
  const allResponses = headersBySource(rules, "/:path*");

  assert.equal(ogImages.get("access-control-allow-origin"), "*");
  assert.equal(ogImages.get("access-control-allow-methods"), "GET, HEAD, OPTIONS");
  assert.equal(allResponses.has("access-control-allow-origin"), false);
  assert.equal(allResponses.has("access-control-allow-methods"), false);
});
