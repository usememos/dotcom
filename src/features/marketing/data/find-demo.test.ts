import { describe, expect, it } from "vitest";
import { BAY_AREA_MEMOS, buildDemoCalendar, DEMO_MEMOS } from "./find-demo";

describe("Find section demo data", () => {
  it.each([
    [2026, 8, 28],
    [2026, 9, 1],
    [2027, 0, 3],
  ])("lays out five Sunday-start weeks ending with the week of %s/%s/%s", (year, month, day) => {
    const today = new Date(year, month, day);
    const calendar = buildDemoCalendar(today);
    expect(calendar.days).toHaveLength(35);
    expect(new Date(`${calendar.days[0].key}T12:00:00`).getDay()).toBe(0);
    expect(calendar.days.filter((item) => item.today)).toHaveLength(1);
    // Every demo memo from the last five weeks lands on exactly one day, never in the future.
    const placed = calendar.days.flatMap((item) => item.memos);
    expect(placed.map((memo) => memo.id).sort()).toEqual(DEMO_MEMOS.map((memo) => memo.id).sort());
    const todayIndex = calendar.days.findIndex((item) => item.today);
    expect(calendar.days.slice(todayIndex + 1).every((item) => item.memos.length === 0)).toBe(true);
  });

  it("clusters the two Bay Area memos into the map's pin", () => {
    expect(BAY_AREA_MEMOS.map((memo) => memo.author)).toEqual(["Bob", "Johnny"]);
    expect(BAY_AREA_MEMOS.every((memo) => memo.location)).toBe(true);
  });
});
