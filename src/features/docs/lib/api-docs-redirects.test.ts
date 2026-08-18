// @vitest-environment node

import { describe, expect, it } from "vitest";
import nextConfig from "../../../../next.config.mjs";
import apiDocsVersionManifest from "./api-docs-versions.json";

describe("API documentation redirects", () => {
  it("routes retired canonical and legacy slugs to the upgrade guide before the version-less fallback", async () => {
    const redirects = (await nextConfig.redirects?.()) ?? [];
    const retiredSlugs = apiDocsVersionManifest
      .filter((version) => version.archived)
      .flatMap((version) => [version.slug, ...(version.legacySlugs ?? [])]);
    const retiredRules = redirects.filter(
      (rule) => rule.source.startsWith("/docs/api/:version") && rule.destination === "/docs/operations/upgrade",
    );
    const versionlessRuleIndex = redirects.findIndex((rule) => rule.source.startsWith("/docs/api/:segment"));

    expect(retiredRules).toHaveLength(2);
    expect(retiredRules.some((rule) => rule.source.endsWith("/:rest*"))).toBe(true);
    expect(retiredRules.some((rule) => !rule.source.endsWith("/:rest*"))).toBe(true);

    for (const slug of retiredSlugs) {
      expect(retiredRules.every((rule) => rule.source.includes(slug))).toBe(true);
    }

    for (const rule of retiredRules) {
      expect(rule.permanent).toBe(true);
      expect(redirects.indexOf(rule)).toBeLessThan(versionlessRuleIndex);
    }
  });
});
