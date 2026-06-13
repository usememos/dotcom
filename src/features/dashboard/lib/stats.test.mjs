import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import test from "node:test";

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith(".") && !specifier.match(/\.[cm]?[jt]sx?$/)) {
      try {
        return nextResolve(`${specifier}.ts`, context);
      } catch {
        return nextResolve(specifier, context);
      }
    }
    return nextResolve(specifier, context);
  },
});

const { countDaysActive, currentStreak, describeStatsError, connectedHeaderLabel, classifyStatsFailure, sumActivity } = await import(
  "./stats.ts"
);
const { MemosSettingsRequestError } = await import("../../../shared/settings/memos-settings-client.ts");

const NOW = new Date("2025-06-13T12:00:00Z");

test("countDaysActive counts days with a positive count", () => {
  assert.equal(
    countDaysActive([
      { date: "2025-06-10", count: 2 },
      { date: "2025-06-11", count: 0 },
    ]),
    1,
  );
  assert.equal(countDaysActive([]), 0);
});

test("currentStreak counts consecutive days ending today", () => {
  const days = [
    { date: "2025-06-11", count: 1 },
    { date: "2025-06-12", count: 5 },
    { date: "2025-06-13", count: 2 },
  ];
  assert.equal(currentStreak(days, NOW), 3);
});

test("currentStreak counts a streak ending yesterday when today is empty", () => {
  const days = [
    { date: "2025-06-11", count: 1 },
    { date: "2025-06-12", count: 5 },
  ];
  assert.equal(currentStreak(days, NOW), 2);
});

test("currentStreak is 0 when the most recent active day is older than yesterday", () => {
  assert.equal(currentStreak([{ date: "2025-06-10", count: 9 }], NOW), 0);
  assert.equal(currentStreak([], NOW), 0);
});

test("describeStatsError maps every reason to a non-empty message", () => {
  for (const reason of ["unauthorized", "unreachable", "timeout", "invalid-response", "redirected"]) {
    assert.ok(describeStatsError(reason).length > 0, reason);
  }
});

test("connectedHeaderLabel shows the host and the version when known", () => {
  assert.equal(connectedHeaderLabel("https://memos.example.com", "0.29.1"), "memos.example.com · v0.29.1");
  assert.equal(connectedHeaderLabel("https://memos.example.com/path", null), "memos.example.com");
  assert.equal(connectedHeaderLabel("not a url", "0.29.1"), "Connected · v0.29.1");
});

test("classifyStatsFailure maps a 401 to signed-out", () => {
  assert.equal(classifyStatsFailure(new MemosSettingsRequestError("nope", 401)), "signed-out");
});

test("classifyStatsFailure maps a 503 to not-configured", () => {
  assert.equal(classifyStatsFailure(new MemosSettingsRequestError("nope", 503)), "not-configured");
});

test("classifyStatsFailure maps other request errors and non-errors to failed", () => {
  assert.equal(classifyStatsFailure(new MemosSettingsRequestError("boom", 502)), "failed");
  assert.equal(classifyStatsFailure(new Error("network")), "failed");
  assert.equal(classifyStatsFailure(null), "failed");
});

test("sumActivity totals the windowed day counts", () => {
  assert.equal(
    sumActivity([
      { date: "2025-06-10", count: 2 },
      { date: "2025-06-12", count: 3 },
    ]),
    5,
  );
});

test("sumActivity is 0 for no days", () => {
  assert.equal(sumActivity([]), 0);
});
