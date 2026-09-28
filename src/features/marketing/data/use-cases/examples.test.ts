import { describe, expect, it } from "vitest";
import { memoTags } from "@/features/marketing/data/home-memos";
import { USE_CASE_EXAMPLES } from "./examples";
import { USE_CASE_SLUGS } from "./slugs";

describe("use case example timelines", () => {
  it("gives every use case three tagged memos in timeline order", () => {
    for (const slug of USE_CASE_SLUGS) {
      const memos = USE_CASE_EXAMPLES[slug];
      expect(memos, slug).toHaveLength(3);
      expect(memos.map((memo) => memo.daysAgo)).toEqual([...memos.map((memo) => memo.daysAgo)].sort((a, b) => a - b));
      for (const memo of memos) expect(memoTags(memo).length, memo.id).toBeGreaterThan(0);
    }
  });
});
