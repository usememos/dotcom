import { describe, expect, it } from "vitest";
import { MemosSettingsRequestError } from "@/shared/settings/memos-settings-client";
import type { MemosActivityDay } from "@/shared/settings/memos-stats";
import { classifyStatsFailure, connectedHeaderLabel, countDaysActive, currentStreak, describeStatsError, sumActivity } from "./stats";

const days = (entries: Array<[string, number]>): MemosActivityDay[] => entries.map(([date, count]) => ({ date, count }));

describe("countDaysActive", () => {
  it("counts only days with a positive count", () => {
    expect(
      countDaysActive(
        days([
          ["2026-06-10", 0],
          ["2026-06-11", 3],
          ["2026-06-12", 1],
        ]),
      ),
    ).toBe(2);
  });
  it("returns 0 for no days", () => {
    expect(countDaysActive([])).toBe(0);
  });
});

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

describe("currentStreak", () => {
  const now = new Date("2026-06-14T12:00:00Z");
  it("counts consecutive active days ending today", () => {
    expect(
      currentStreak(
        days([
          ["2026-06-12", 1],
          ["2026-06-13", 2],
          ["2026-06-14", 1],
        ]),
        now,
      ),
    ).toBe(3);
  });
  it("counts the streak ending yesterday when today is empty", () => {
    expect(
      currentStreak(
        days([
          ["2026-06-12", 1],
          ["2026-06-13", 2],
        ]),
        now,
      ),
    ).toBe(2);
  });
  it("breaks the streak on a gap", () => {
    expect(
      currentStreak(
        days([
          ["2026-06-10", 5],
          ["2026-06-13", 2],
          ["2026-06-14", 1],
        ]),
        now,
      ),
    ).toBe(2);
  });
  it("returns 0 when there is no activity", () => {
    expect(currentStreak([], now)).toBe(0);
  });
});

describe("describeStatsError", () => {
  it("maps each failure reason to a message", () => {
    expect(describeStatsError("unauthorized")).toMatch(/rejected the saved token/);
    expect(describeStatsError("unreachable")).toBe("Couldn't reach your Memos instance.");
    expect(describeStatsError("timeout")).toMatch(/too long/);
    expect(describeStatsError("invalid-response")).toMatch(/doesn't look like/);
    expect(describeStatsError("redirected")).toMatch(/redirected/);
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

describe("classifyStatsFailure", () => {
  it("treats 401 as signed-out", () => {
    expect(classifyStatsFailure(new MemosSettingsRequestError("no", 401))).toBe("signed-out");
  });
  it("treats 503 as not-configured", () => {
    expect(classifyStatsFailure(new MemosSettingsRequestError("no", 503))).toBe("not-configured");
  });
  it("treats other request errors and unknown throwables as failed", () => {
    expect(classifyStatsFailure(new MemosSettingsRequestError("no", 500))).toBe("failed");
    expect(classifyStatsFailure(new Error("boom"))).toBe("failed");
  });
});
