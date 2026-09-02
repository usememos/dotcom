// @vitest-environment node

import { describe, expect, it } from "vitest";
import nextConfig from "../../../../next.config.mjs";

const guideSlugs = ["bullet-journal", "getting-things-done", "zettelkasten"] as const;

describe("guide documentation redirects", () => {
  it.each(guideSlugs)("redirects the former Usage route for %s", async (slug) => {
    const redirects = (await nextConfig.redirects?.()) ?? [];

    expect(redirects).toContainEqual({
      source: `/docs/usage/${slug}`,
      destination: `/docs/guides/${slug}`,
      permanent: true,
    });
  });
});
