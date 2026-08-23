import { describe, expect, it } from "vitest";
import { CALENDAR_DAYS, CALENDAR_LABEL, SIDEBAR_TAGS } from "./memo-hero-mock";

/**
 * The hero mock is a frozen reconstruction of the Memos app, and DESIGN_SYSTEM.md section 14
 * requires the data inside it to stay plausible and internally consistent. These are the
 * parts of that rule a machine can check, so moving `MOCK_TODAY` forward fails loudly here
 * instead of silently misaligning the calendar or orphaning a tag.
 */
describe("MemoHeroMock calendar data", () => {
  const today = CALENDAR_DAYS.find((day) => day.today);

  it("fills the app's fixed six-week, Sunday-start grid", () => {
    expect(CALENDAR_DAYS).toHaveLength(42);
    expect(CALENDAR_DAYS[0].key.endsWith("-26")).toBe(true);
    expect(new Date(`${CALENDAR_DAYS[0].key}T00:00:00Z`).getUTCDay()).toBe(0);
  });

  it("marks exactly one day as today, inside the visible month", () => {
    expect(CALENDAR_DAYS.filter((day) => day.today)).toHaveLength(1);
    expect(today?.outside).toBe(false);
  });

  it("labels the month the marked day belongs to", () => {
    expect(CALENDAR_LABEL).toBe("August 2026");
    expect(today?.key.startsWith("2026-08")).toBe(true);
  });

  it("never shows activity after today, which the app cannot do", () => {
    const active = CALENDAR_DAYS.filter((day) => day.intensity !== undefined);

    expect(active.length).toBeGreaterThan(0);
    for (const day of active) {
      expect(day.outside).toBe(false);
      expect(day.key <= (today?.key ?? "")).toBe(true);
    }
  });
});

describe("MemoHeroMock sidebar tags", () => {
  it("advertises only tags the feed below it actually carries", () => {
    // Mirrors the tags rendered on the two memo cards in `Timeline`.
    expect(SIDEBAR_TAGS.map((item) => item.tag)).toEqual(["books", "reading", "dev", "cheatsheet"]);
  });
});
