import assert from "node:assert/strict";
import test from "node:test";
import nextConfig from "../next.config.mjs";

function headersBySource(entries, source) {
  const entry = entries.find((item) => item.source === source);

  assert.ok(entry, `${source} header rule should exist`);

  return new Map(entry.headers.map((header) => [header.key.toLowerCase(), header.value]));
}

test("all Next responses allow cross-origin reads from any domain", async () => {
  const headers = headersBySource(await nextConfig.headers(), "/:path*");

  assert.equal(headers.get("access-control-allow-origin"), "*");
  assert.equal(headers.get("access-control-allow-methods"), "GET, HEAD, OPTIONS");
});
