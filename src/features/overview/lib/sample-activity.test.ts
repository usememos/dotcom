import { describe, expect, it } from "vitest";
import { buildSampleActivity } from "./sample-activity";

const now = new Date("2026-07-21T12:00:00Z");

describe("buildSampleActivity", () => {
  it("builds a stable, ascending year preview", () => {
    const days = buildSampleActivity(now);

    expect(days).toEqual(buildSampleActivity(now));
    expect(days.length).toBeGreaterThan(100);
    expect(days.every((day) => day.count > 0)).toBe(true);
    expect(days.map((day) => day.date)).toEqual(days.map((day) => day.date).toSorted());
    expect(days[0]?.date >= "2025-07-23").toBe(true);
    expect(days.at(-1)?.date <= "2026-07-21").toBe(true);
  });
});
