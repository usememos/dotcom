import { describe, expect, it } from "vitest";
import type { MemosActivityDay } from "@/shared/settings/memos-stats";
import { connectedHeaderLabel, sumActivity } from "./stats";

const days = (entries: Array<[string, number]>): MemosActivityDay[] => entries.map(([date, count]) => ({ date, count }));

describe("sumActivity", () => {
  it("sums counts across all days", () => {
    expect(
      sumActivity(
        days([
          ["2026-06-11", 3],
          ["2026-06-12", 4],
        ]),
      ),
    ).toBe(7);
  });
});

describe("connectedHeaderLabel", () => {
  it("uses the host and version when both are known", () => {
    expect(connectedHeaderLabel("https://memos.example.com", "1.2.3")).toBe("memos.example.com · v1.2.3");
  });
  it("drops the version when null", () => {
    expect(connectedHeaderLabel("https://memos.example.com", null)).toBe("memos.example.com");
  });
  it("falls back to 'Connected' for an unparseable URL", () => {
    expect(connectedHeaderLabel("not a url", "9")).toBe("Connected · v9");
  });
});
