import { describe, expect, it } from "vitest";
import { advanceClock, type Clock, compareClocks, createClock, receiveClock } from "./clock";

const c = (ts: number, counter: number, deviceId: string): Clock => ({ ts, counter, deviceId });

describe("compareClocks", () => {
  it("orders by ts, then counter, then deviceId", () => {
    expect(compareClocks(c(1, 0, "a"), c(2, 0, "a"))).toBe(-1);
    expect(compareClocks(c(2, 0, "a"), c(2, 1, "a"))).toBe(-1);
    expect(compareClocks(c(2, 1, "a"), c(2, 1, "b"))).toBe(-1);
    expect(compareClocks(c(2, 1, "b"), c(2, 1, "b"))).toBe(0);
  });
});

describe("advanceClock", () => {
  it("bumps counter when wall time has not moved", () => {
    const start = createClock("a");
    const first = advanceClock(start, 100);
    const second = advanceClock(first, 100);
    expect(first).toEqual(c(100, 0, "a"));
    expect(second).toEqual(c(100, 1, "a"));
  });

  it("resets counter and tracks wall time when it moves forward", () => {
    const next = advanceClock(c(100, 5, "a"), 200);
    expect(next).toEqual(c(200, 0, "a"));
  });

  it("never goes backwards if the wall clock is behind", () => {
    const next = advanceClock(c(300, 0, "a"), 200);
    expect(next).toEqual(c(300, 1, "a"));
  });
});

describe("receiveClock", () => {
  it("jumps past a remote clock from the future", () => {
    const merged = receiveClock(c(100, 0, "a"), c(500, 3, "b"), 100);
    expect(merged.ts).toBe(500);
    expect(merged.counter).toBe(4);
    expect(merged.deviceId).toBe("a");
  });
});
