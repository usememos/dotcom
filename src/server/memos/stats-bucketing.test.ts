import { describe, expect, it } from "vitest";
import { ACTIVITY_WINDOW_DAYS, bucketByUtcDay } from "./stats-bucketing";

describe("stats-bucketing", () => {
  const NOW = new Date("2025-06-13T12:00:00Z");

  it("counts timestamps per UTC day and sorts ascending", () => {
    const days = bucketByUtcDay(["2025-06-10T01:00:00Z", "2025-06-10T23:00:00Z", "2025-06-12T08:00:00Z"], NOW);
    expect(days).toEqual([
      { date: "2025-06-10", count: 2 },
      { date: "2025-06-12", count: 1 },
    ]);
  });

  it("uses UTC day boundaries, not local time", () => {
    const days = bucketByUtcDay(["2025-06-12T23:30:00Z"], NOW);
    expect(days).toEqual([{ date: "2025-06-12", count: 1 }]);
  });

  it("drops timestamps outside the trailing window and in the future", () => {
    const tooOld = new Date(NOW.getTime() - (ACTIVITY_WINDOW_DAYS + 5) * 86400000).toISOString();
    const future = "2025-06-20T00:00:00Z";
    const days = bucketByUtcDay([tooOld, future, "2025-06-13T00:00:00Z"], NOW);
    expect(days).toEqual([{ date: "2025-06-13", count: 1 }]);
  });

  it("ignores unparseable timestamps and returns empty for no input", () => {
    expect(bucketByUtcDay(["not-a-date"], NOW)).toEqual([]);
    expect(bucketByUtcDay([], NOW)).toEqual([]);
  });
});
