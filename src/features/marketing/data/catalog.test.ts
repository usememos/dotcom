import { describe, expect, it } from "vitest";
import { FEATURE_SLUGS, FEATURES } from "./features";
import { USE_CASE_SLUGS, USE_CASES } from "./use-cases";

// The slug arrays drive static generation; the data objects supply each page's
// content. They must stay key-for-key aligned or a route renders empty / 404s.
describe("catalog", () => {
  it("feature slugs and feature data keys stay aligned", () => {
    expect(Object.keys(FEATURES).sort()).toEqual([...FEATURE_SLUGS].sort());
  });

  it("use case slugs and use case data keys stay aligned", () => {
    expect(Object.keys(USE_CASES).sort()).toEqual([...USE_CASE_SLUGS].sort());
  });

  it("every use case links only to real feature pages", () => {
    const featureSlugs = new Set<string>(FEATURE_SLUGS);

    for (const slug of USE_CASE_SLUGS) {
      for (const feature of USE_CASES[slug].features) {
        expect(featureSlugs, `use case "${slug}" references unknown feature "${feature.slug}"`).toContain(feature.slug);
      }
    }
  });
});
