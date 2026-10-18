import assert from "node:assert/strict";
import test from "node:test";
import nextConfig from "../next.config.mjs";

test("retired comparison URLs permanently resolve to product information", async () => {
  const redirects = await nextConfig.redirects();
  assert.deepEqual(
    redirects.find((rule) => rule.source === "/compare/:path*"),
    {
      source: "/compare/:path*",
      destination: "/features",
      permanent: true,
    },
  );
});
