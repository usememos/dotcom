# Dashboard Test Suite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add comprehensive co-located Vitest tests for every dashboard file (libs, components, page) plus the marketing scratchpad section, using the project's existing test conventions.

**Architecture:** Pure libs are tested directly with deterministic inputs (a fixed `now: Date`). Components are tested with React Testing Library + user-event; the orchestrating `Dashboard` component isolates its state machine by mocking its hooks and presentational children. No new dependencies — this plan uses only what `package.json` already provides.

**Tech Stack:** Vitest 3, jsdom, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`, `vi.mock` module mocks.

---

## Conventions (read before starting)

This is plan 1 of 3 (Dashboard → Scratchpad logic → Scratchpad UI). It targets `src/features/dashboard/**`, `src/app/(app)/dashboard/page.tsx`, and `src/features/marketing/components/home-scratchpad-section.tsx`.

**On "TDD" for already-written code.** The dashboard implementation already exists and is believed correct, so a test for correct code passes on first run — that is expected and fine; the test is a characterization/regression net. Genuine red-green only happens when a test surfaces a real bug. So in each task:

- Write the test.
- Run it. **If it passes**, the behavior is pinned — move on. **If it fails**, you have either (a) found a real bug → fix the implementation (this is the red-green case; note the fix in the commit), or (b) written a wrong assertion → fix the test. Decide which by reading the code.

**Established patterns to follow** (from `connect-onboarding.test.tsx`, `connect-prompt.test.tsx`):

- Vitest globals are **off**: always `import { describe, expect, it, vi, beforeEach } from "vitest"`.
- Declare `vi.mock(...)` calls **before** importing the unit under test (mocks are hoisted, but keep imports of the unit after them for readability).
- `beforeEach(() => vi.clearAllMocks())` in suites that use mocks.
- Co-locate tests as `<name>.test.ts` / `<name>.test.tsx` beside the source.
- Use a **fixed `now`** (e.g. `new Date("2026-06-14T12:00:00Z")`) for any date-dependent code — never the real clock.

**Run a single test file:** `pnpm exec vitest run src/features/dashboard/lib/stats.test.ts`
**Run everything:** `pnpm test`

---

## File Structure

| File | Responsibility |
|------|----------------|
| `src/features/dashboard/lib/stats.test.ts` | Unit tests for stat math + error/classification helpers |
| `src/features/dashboard/lib/heatmap.test.ts` | Unit tests for grid building, intensity bucketing, month labels |
| `src/features/dashboard/lib/sample-stats.test.ts` | Determinism + shape of blurred teaser data |
| `src/features/dashboard/lib/stats-cache.test.ts` | localStorage read/write/clear + validation/error branches |
| `src/features/dashboard/components/stat-tiles.test.tsx` | RTL render of the four tiles |
| `src/features/dashboard/components/dashboard-header.test.tsx` | RTL identity + manage-connection action |
| `src/features/dashboard/components/activity-heatmap.test.tsx` | RTL caption, cells, legend |
| `src/features/dashboard/components/dashboard.test.tsx` | RTL state machine across all dashboard states |
| `src/app/(app)/dashboard/page.test.tsx` | Renders `<Dashboard/>`; metadata/dynamic exports |
| `src/features/marketing/components/home-scratchpad-section.test.tsx` | RTL static content + link |

---

## Task 1: `lib/stats.ts` tests

**Files:**
- Test: `src/features/dashboard/lib/stats.test.ts`
- Under test: `src/features/dashboard/lib/stats.ts` (read it; do not modify unless a test finds a bug)

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { MemosSettingsRequestError } from "@/shared/settings/memos-settings-client";
import type { MemosActivityDay } from "@/shared/settings/memos-stats";
import {
  classifyStatsFailure,
  connectedHeaderLabel,
  countDaysActive,
  currentStreak,
  describeStatsError,
  sumActivity,
} from "./stats";

const days = (entries: Array<[string, number]>): MemosActivityDay[] => entries.map(([date, count]) => ({ date, count }));

describe("countDaysActive", () => {
  it("counts only days with a positive count", () => {
    expect(countDaysActive(days([["2026-06-10", 0], ["2026-06-11", 3], ["2026-06-12", 1]]))).toBe(2);
  });
  it("returns 0 for no days", () => {
    expect(countDaysActive([])).toBe(0);
  });
});

describe("sumActivity", () => {
  it("sums counts across all days", () => {
    expect(sumActivity(days([["2026-06-11", 3], ["2026-06-12", 4]]))).toBe(7);
  });
});

describe("currentStreak", () => {
  const now = new Date("2026-06-14T12:00:00Z");
  it("counts consecutive active days ending today", () => {
    expect(currentStreak(days([["2026-06-12", 1], ["2026-06-13", 2], ["2026-06-14", 1]]), now)).toBe(3);
  });
  it("counts the streak ending yesterday when today is empty", () => {
    expect(currentStreak(days([["2026-06-12", 1], ["2026-06-13", 2]]), now)).toBe(2);
  });
  it("breaks the streak on a gap", () => {
    expect(currentStreak(days([["2026-06-10", 5], ["2026-06-13", 2], ["2026-06-14", 1]]), now)).toBe(2);
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
```

- [ ] **Step 2: Run the test**

Run: `pnpm exec vitest run src/features/dashboard/lib/stats.test.ts`
Expected: PASS (implementation already exists). If any case FAILS, read `stats.ts`, decide bug-vs-test, and fix.

- [ ] **Step 3: Commit**

```bash
git add src/features/dashboard/lib/stats.test.ts
git commit -m "test(dashboard): cover stats lib helpers"
```

---

## Task 2: `lib/heatmap.ts` tests

**Files:**
- Test: `src/features/dashboard/lib/heatmap.test.ts`
- Under test: `src/features/dashboard/lib/heatmap.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import {
  buildHeatmapGrid,
  computeIntensityThresholds,
  HEATMAP_WEEKS,
  intensityForCount,
  monthColumnLabel,
} from "./heatmap";

const now = new Date("2026-06-14T12:00:00Z"); // Sunday

describe("buildHeatmapGrid", () => {
  it("builds a HEATMAP_WEEKS x 7 grid", () => {
    const grid = buildHeatmapGrid([], now);
    expect(grid).toHaveLength(HEATMAP_WEEKS);
    for (const week of grid) {
      expect(week).toHaveLength(7);
    }
  });

  it("ends on the week containing now and maps counts onto matching cells", () => {
    const grid = buildHeatmapGrid([{ date: "2026-06-14", count: 5 }], now);
    const lastWeek = grid[grid.length - 1];
    const todayCell = lastWeek.find((cell) => cell.date === "2026-06-14");
    expect(todayCell).toEqual({ date: "2026-06-14", count: 5 });
  });

  it("leaves unmatched cells at 0", () => {
    const grid = buildHeatmapGrid([], now);
    expect(grid.every((week) => week.every((cell) => cell.count === 0))).toBe(true);
  });
});

describe("computeIntensityThresholds", () => {
  it("returns [] when there are no positive counts", () => {
    expect(computeIntensityThresholds([0, 0])).toEqual([]);
  });
  it("returns three ascending quartile boundaries over positive counts", () => {
    const thresholds = computeIntensityThresholds([1, 2, 3, 4, 0, 5, 6, 7, 8]);
    expect(thresholds).toHaveLength(3);
    expect(thresholds[0]).toBeLessThanOrEqual(thresholds[1]);
    expect(thresholds[1]).toBeLessThanOrEqual(thresholds[2]);
  });
});

describe("intensityForCount", () => {
  it("returns 0 for non-positive counts", () => {
    expect(intensityForCount(0, [2, 4, 6])).toBe(0);
    expect(intensityForCount(-1, [2, 4, 6])).toBe(0);
  });
  it("returns at least 1 for any positive count", () => {
    expect(intensityForCount(1, [2, 4, 6])).toBe(1);
  });
  it("climbs with the thresholds and caps at 4", () => {
    expect(intensityForCount(5, [2, 4, 6])).toBe(3);
    expect(intensityForCount(100, [2, 4, 6])).toBe(4);
  });
});

describe("monthColumnLabel", () => {
  it("shows month + 2-digit year for the first column", () => {
    expect(monthColumnLabel("2026-01-04", null)).toBe("Jan '26");
  });
  it("returns empty string when the month is unchanged", () => {
    expect(monthColumnLabel("2026-01-11", "2026-01-04")).toBe("");
  });
  it("shows the bare month on a same-year month change", () => {
    expect(monthColumnLabel("2026-02-01", "2026-01-25")).toBe("Feb");
  });
  it("shows month + year on a year change", () => {
    expect(monthColumnLabel("2026-01-04", "2025-12-28")).toBe("Jan '26");
  });
});
```

- [ ] **Step 2: Run the test**

Run: `pnpm exec vitest run src/features/dashboard/lib/heatmap.test.ts`
Expected: PASS. Investigate any failure as bug-vs-test.

- [ ] **Step 3: Commit**

```bash
git add src/features/dashboard/lib/heatmap.test.ts
git commit -m "test(dashboard): cover heatmap grid + intensity helpers"
```

---

## Task 3: `lib/sample-stats.ts` tests

**Files:**
- Test: `src/features/dashboard/lib/sample-stats.test.ts`
- Under test: `src/features/dashboard/lib/sample-stats.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { buildSampleStats } from "./sample-stats";

const now = new Date("2026-06-14T12:00:00Z");

describe("buildSampleStats", () => {
  it("is deterministic for the same now", () => {
    expect(buildSampleStats(now)).toEqual(buildSampleStats(now));
  });

  it("returns the expected shape with fixed tag/type stats", () => {
    const stats = buildSampleStats(now);
    expect(stats.tagCount).toBe(42);
    expect(stats.memoTypeStats).toEqual({ link: 180, code: 96, todo: 64, undo: 12 });
    expect(Array.isArray(stats.days)).toBe(true);
  });

  it("only includes days with a positive count and sums them into totalMemoCount", () => {
    const stats = buildSampleStats(now);
    expect(stats.days.every((day) => day.count > 0)).toBe(true);
    expect(stats.totalMemoCount).toBe(stats.days.reduce((sum, day) => sum + day.count, 0));
  });

  it("keeps days within the trailing ~year window and ascending by date", () => {
    const stats = buildSampleStats(now);
    const keys = stats.days.map((day) => day.date);
    expect([...keys].sort()).toEqual(keys);
    expect(keys[0] >= "2025-06-16").toBe(true);
    expect(keys[keys.length - 1] <= "2026-06-14").toBe(true);
  });
});
```

- [ ] **Step 2: Run the test**

Run: `pnpm exec vitest run src/features/dashboard/lib/sample-stats.test.ts`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/features/dashboard/lib/sample-stats.test.ts
git commit -m "test(dashboard): cover deterministic sample stats"
```

---

## Task 4: `lib/stats-cache.ts` tests

**Files:**
- Test: `src/features/dashboard/lib/stats-cache.test.ts`
- Under test: `src/features/dashboard/lib/stats-cache.ts` (uses `window.localStorage`, available in jsdom)

- [ ] **Step 1: Write the failing test**

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { CachedDashboardStats } from "./stats-cache";
import { clearDashboardStatsCache, readDashboardStatsCache, writeDashboardStatsCache } from "./stats-cache";

const STORAGE_KEY = "memos:dashboard-stats:v1";

const validCache: CachedDashboardStats = {
  userId: "7",
  version: "1.2.3",
  fetchedAt: 1_700_000_000_000,
  stats: { totalMemoCount: 3, tagCount: 1, memoTypeStats: { link: 1, code: 1, todo: 1, undo: 0 }, days: [{ date: "2026-06-14", count: 3 }] },
};

beforeEach(() => {
  window.localStorage.clear();
});
afterEach(() => {
  vi.restoreAllMocks();
});

describe("writeDashboardStatsCache / readDashboardStatsCache", () => {
  it("round-trips a valid cache", () => {
    writeDashboardStatsCache(validCache);
    expect(readDashboardStatsCache()).toEqual(validCache);
  });

  it("returns null when nothing is stored", () => {
    expect(readDashboardStatsCache()).toBeNull();
  });

  it("returns null for malformed JSON", () => {
    window.localStorage.setItem(STORAGE_KEY, "{not json");
    expect(readDashboardStatsCache()).toBeNull();
  });

  it("returns null when the shape fails validation", () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ userId: 7, version: null, fetchedAt: 0, stats: {} }));
    expect(readDashboardStatsCache()).toBeNull();
  });

  it("accepts a null version", () => {
    const withNullVersion = { ...validCache, version: null };
    writeDashboardStatsCache(withNullVersion);
    expect(readDashboardStatsCache()).toEqual(withNullVersion);
  });

  it("swallows quota errors on write", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceeded");
    });
    expect(() => writeDashboardStatsCache(validCache)).not.toThrow();
  });
});

describe("clearDashboardStatsCache", () => {
  it("removes the stored cache", () => {
    writeDashboardStatsCache(validCache);
    clearDashboardStatsCache();
    expect(readDashboardStatsCache()).toBeNull();
  });
});
```

- [ ] **Step 2: Run the test**

Run: `pnpm exec vitest run src/features/dashboard/lib/stats-cache.test.ts`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/features/dashboard/lib/stats-cache.test.ts
git commit -m "test(dashboard): cover stats cache read/write/clear branches"
```

---

## Task 5: `components/stat-tiles.tsx` tests

**Files:**
- Test: `src/features/dashboard/components/stat-tiles.test.tsx`
- Under test: `src/features/dashboard/components/stat-tiles.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { MemosStatsData } from "@/shared/settings/memos-stats";
import { StatTiles } from "./stat-tiles";

const now = new Date("2026-06-14T12:00:00Z");

const stats: MemosStatsData = {
  totalMemoCount: 1234,
  tagCount: 42,
  memoTypeStats: { link: 1, code: 1, todo: 1, undo: 0 },
  days: [
    { date: "2026-06-13", count: 2 },
    { date: "2026-06-14", count: 1 },
  ],
};

describe("StatTiles", () => {
  it("renders the four labelled tiles with formatted values", () => {
    render(<StatTiles stats={stats} now={now} />);

    expect(screen.getByText("Total memos")).toBeInTheDocument();
    expect(screen.getByText("1,234")).toBeInTheDocument(); // localeString formatting
    expect(screen.getByText("Tags")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("Days active")).toBeInTheDocument();
    expect(screen.getByText("Current streak")).toBeInTheDocument();
    // 2 active days, streak of 2 ending today.
    expect(screen.getAllByText("2")).not.toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run the test**

Run: `pnpm exec vitest run src/features/dashboard/components/stat-tiles.test.tsx`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/features/dashboard/components/stat-tiles.test.tsx
git commit -m "test(dashboard): cover stat tiles render"
```

---

## Task 6: `components/dashboard-header.tsx` tests

**Files:**
- Test: `src/features/dashboard/components/dashboard-header.test.tsx`
- Under test: `src/features/dashboard/components/dashboard-header.tsx`

Note: the header's dropdown content renders `AccountActionItems` and `ThemeMenuItems`, which depend on Clerk. Mock those two child modules so the menu opens without a ClerkProvider; `UserIdentity` is pure and stays real.

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/account/components/account-action-items", () => ({
  AccountActionItems: () => <div data-testid="account-actions" />,
}));
vi.mock("@/features/account/components/theme-menu-items", () => ({
  ThemeMenuItems: () => <div data-testid="theme-items" />,
}));

import { DashboardHeader } from "./dashboard-header";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("DashboardHeader", () => {
  it("renders the user identity and secondary label", () => {
    // resolveUserDisplayName reads fullName/username/email — NOT firstName.
    render(<DashboardHeader user={{ fullName: "Ada Lovelace" }} secondary="memos.example.com · v1" onManageConnection={vi.fn()} />);

    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByText("memos.example.com · v1")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Account and connection" })).toBeInTheDocument();
  });

  it("calls onManageConnection (deferred) when the menu item is selected", async () => {
    // Real timers: fake timers + Radix dropdown interaction deadlocks. The
    // onSelect defers via setTimeout(_, 0); waitFor polls until it fires.
    const onManageConnection = vi.fn();
    const user = userEvent.setup();

    render(<DashboardHeader user={null} secondary="Not connected" onManageConnection={onManageConnection} />);

    await user.click(screen.getByRole("button", { name: "Account and connection" }));
    await user.click(await screen.findByText("Manage connection"));

    await waitFor(() => expect(onManageConnection).toHaveBeenCalledTimes(1));
  });
});
```

- [ ] **Step 2: Run the test**

Run: `pnpm exec vitest run src/features/dashboard/components/dashboard-header.test.tsx`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/features/dashboard/components/dashboard-header.test.tsx
git commit -m "test(dashboard): cover header identity + manage-connection action"
```

---

## Task 7: `components/activity-heatmap.tsx` tests

**Files:**
- Test: `src/features/dashboard/components/activity-heatmap.test.tsx`
- Under test: `src/features/dashboard/components/activity-heatmap.tsx`

Note: the component reads `scrollRef.current.scrollWidth` in an effect; jsdom returns 0, which is harmless. No polyfill needed for `window.addEventListener("resize")` (jsdom provides it).

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { MemosActivityDay } from "@/shared/settings/memos-stats";
import { ActivityHeatmap } from "./activity-heatmap";

const now = new Date("2026-06-14T12:00:00Z");

describe("ActivityHeatmap", () => {
  it("renders a caption summing the activity", () => {
    const days: MemosActivityDay[] = [
      { date: "2026-06-13", count: 2 },
      { date: "2026-06-14", count: 3 },
    ];
    render(<ActivityHeatmap days={days} now={now} />);
    expect(screen.getByText("5 memos in the last year")).toBeInTheDocument();
  });

  it("uses singular 'memo' for a total of one", () => {
    render(<ActivityHeatmap days={[{ date: "2026-06-14", count: 1 }]} now={now} />);
    expect(screen.getByText("1 memo in the last year")).toBeInTheDocument();
  });

  it("renders a titled cell for an active day and the Less/More legend", () => {
    render(<ActivityHeatmap days={[{ date: "2026-06-14", count: 3 }]} now={now} />);
    expect(screen.getByTitle(/3 memos on/)).toBeInTheDocument();
    expect(screen.getByText("Less")).toBeInTheDocument();
    expect(screen.getByText("More")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test**

Run: `pnpm exec vitest run src/features/dashboard/components/activity-heatmap.test.tsx`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/features/dashboard/components/activity-heatmap.test.tsx
git commit -m "test(dashboard): cover activity heatmap render"
```

---

## Task 8: `components/dashboard.tsx` state-machine tests

**Files:**
- Test: `src/features/dashboard/components/dashboard.test.tsx`
- Under test: `src/features/dashboard/components/dashboard.tsx`

This is the orchestrator. Mock its hooks, the stats fetch, the cache, and the presentational children so the test asserts which branch renders per outcome.

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// vi.mock factories are hoisted above module-level declarations, so the shared
// mock state they reference must be created with vi.hoisted (also hoisted).
const mocks = vi.hoisted(() => {
  class MemosSettingsRequestError extends Error {
    status: number;
    constructor(message: string, status: number) {
      super(message);
      this.status = status;
    }
  }
  return {
    notFoundMock: vi.fn(() => {
      throw new Error("NEXT_NOT_FOUND");
    }),
    useIsClerkConfigured: vi.fn(() => true),
    signIn: vi.fn(),
    connectionOpen: vi.fn(),
    getMemosStats: vi.fn(),
    MemosSettingsRequestError,
  };
});

vi.mock("next/navigation", () => ({ notFound: mocks.notFoundMock }));
vi.mock("@/shared/auth/clerk-config", () => ({ useIsClerkConfigured: mocks.useIsClerkConfigured }));
vi.mock("@/features/account/hooks/use-account-actions", () => ({
  useAccountActions: () => ({ user: { fullName: "Ada Lovelace" }, signIn: mocks.signIn }),
}));
vi.mock("@/features/memos/hooks/use-memos-connection", () => ({
  useMemosConnection: () => ({
    settings: { instanceUrl: "https://memos.example.com", hasAccessToken: true },
    isConnected: true,
    open: mocks.connectionOpen,
    dialog: null,
  }),
}));
vi.mock("@/shared/settings/memos-settings-client", () => ({
  getMemosStats: mocks.getMemosStats,
  MemosSettingsRequestError: mocks.MemosSettingsRequestError,
}));

vi.mock("../lib/stats-cache", () => ({
  readDashboardStatsCache: vi.fn(() => null),
  writeDashboardStatsCache: vi.fn(),
  clearDashboardStatsCache: vi.fn(),
}));

vi.mock("./dashboard-header", () => ({ DashboardHeader: ({ secondary }: { secondary: string }) => <div data-testid="header">{secondary}</div> }));
vi.mock("./stat-tiles", () => ({ StatTiles: () => <div data-testid="stat-tiles" /> }));
vi.mock("./activity-heatmap", () => ({ ActivityHeatmap: () => <div data-testid="heatmap" /> }));
vi.mock("./connect-prompt", () => ({ ConnectPrompt: () => <div data-testid="connect-prompt" /> }));

import { Dashboard } from "./dashboard";

const okResult = {
  status: "ok" as const,
  instanceVersion: "1.2.3",
  user: { name: "users/7" },
  stats: { totalMemoCount: 3, tagCount: 1, memoTypeStats: { link: 1, code: 1, todo: 1, undo: 0 }, days: [] },
};

beforeEach(() => {
  vi.clearAllMocks();
  mocks.useIsClerkConfigured.mockReturnValue(true);
});
afterEach(() => {
  window.localStorage.clear();
});

describe("Dashboard", () => {
  it("calls notFound when Clerk is not configured", () => {
    mocks.useIsClerkConfigured.mockReturnValue(false);
    expect(() => render(<Dashboard />)).toThrow("NEXT_NOT_FOUND");
    expect(mocks.notFoundMock).toHaveBeenCalled();
  });

  it("renders the live dashboard on an ok result", async () => {
    mocks.getMemosStats.mockResolvedValue(okResult);
    render(<Dashboard />);
    expect(await screen.findByTestId("stat-tiles")).toBeInTheDocument();
    expect(screen.getByTestId("heatmap")).toBeInTheDocument();
    expect(screen.getByTestId("header")).toBeInTheDocument();
  });

  it("shows the connect prompt when not connected", async () => {
    mocks.getMemosStats.mockResolvedValue({ status: "not-connected" });
    render(<Dashboard />);
    expect(await screen.findByTestId("connect-prompt")).toBeInTheDocument();
  });

  it("shows a reason-specific error for an error result", async () => {
    mocks.getMemosStats.mockResolvedValue({ status: "error", reason: "unreachable" });
    render(<Dashboard />);
    expect(await screen.findByText("Couldn't reach your Memos instance.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });

  it("shows the signed-out card when the fetch rejects with a 401", async () => {
    mocks.getMemosStats.mockRejectedValue(new mocks.MemosSettingsRequestError("unauthorized", 401));
    render(<Dashboard />);
    expect(await screen.findByRole("button", { name: "Sign in" })).toBeInTheDocument();
  });

  it("shows a generic failure for an unknown rejection", async () => {
    mocks.getMemosStats.mockRejectedValue(new Error("boom"));
    render(<Dashboard />);
    expect(await screen.findByText("Couldn't load your stats. Try again.")).toBeInTheDocument();
  });

  it("renders the skeleton until the fetch resolves", () => {
    mocks.getMemosStats.mockReturnValue(new Promise(() => {})); // never resolves
    const { container } = render(<Dashboard />);
    expect(container.querySelector(".animate-pulse")).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run the test**

Run: `pnpm exec vitest run src/features/dashboard/components/dashboard.test.tsx`
Expected: PASS. A common gotcha: if React warns about an unhandled rejection, ensure each rejecting mock is awaited via `findBy*`. Adjust assertions to the real text in `dashboard.tsx` if any string differs.

- [ ] **Step 3: Commit**

```bash
git add src/features/dashboard/components/dashboard.test.tsx
git commit -m "test(dashboard): cover dashboard state machine across all states"
```

---

## Task 9: `dashboard/page.tsx` tests

**Files:**
- Test: `src/app/(app)/dashboard/page.test.tsx`
- Under test: `src/app/(app)/dashboard/page.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/dashboard/components/dashboard", () => ({
  Dashboard: () => <div data-testid="dashboard" />,
}));

import DashboardPage, { dynamic, metadata } from "./page";

describe("DashboardPage", () => {
  it("renders the Dashboard feature component", () => {
    render(<DashboardPage />);
    expect(screen.getByTestId("dashboard")).toBeInTheDocument();
  });

  it("exports force-dynamic and a title", () => {
    expect(dynamic).toBe("force-dynamic");
    expect(metadata.title).toBe("Dashboard");
  });
});
```

- [ ] **Step 2: Run the test**

Run: `pnpm exec vitest run "src/app/(app)/dashboard/page.test.tsx"`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add "src/app/(app)/dashboard/page.test.tsx"
git commit -m "test(dashboard): cover dashboard page wiring + metadata"
```

---

## Task 10: `home-scratchpad-section.tsx` tests

**Files:**
- Test: `src/features/marketing/components/home-scratchpad-section.test.tsx`
- Under test: `src/features/marketing/components/home-scratchpad-section.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomeScratchpadSection } from "./home-scratchpad-section";

describe("HomeScratchpadSection", () => {
  it("renders the heading and the feature list", () => {
    render(<HomeScratchpadSection />);
    expect(screen.getByRole("heading", { name: "Type. Save. Done." })).toBeInTheDocument();
    expect(screen.getByText("Works entirely in your browser—no account needed")).toBeInTheDocument();
    expect(screen.getByText("Drag-and-drop interface for quick organization")).toBeInTheDocument();
    expect(screen.getByText("Supports text notes and file attachments")).toBeInTheDocument();
    expect(screen.getByText("Optional sync to your self-hosted Memos instance")).toBeInTheDocument();
  });

  it("links to the scratchpad", () => {
    render(<HomeScratchpadSection />);
    expect(screen.getByRole("link", { name: /Launch Scratchpad/ })).toHaveAttribute("href", "/scratchpad");
  });
});
```

- [ ] **Step 2: Run the test**

Run: `pnpm exec vitest run src/features/marketing/components/home-scratchpad-section.test.tsx`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/features/marketing/components/home-scratchpad-section.test.tsx
git commit -m "test(marketing): cover home scratchpad section"
```

---

## Final verification

- [ ] Run the whole suite: `pnpm test` — expect all green (the three pre-existing tests plus the 10 new files).
- [ ] Run `pnpm lint` — expect pass (Biome may reformat new files; commit any formatting).
- [ ] If any implementation bug was fixed during a task, confirm it is captured in that task's commit message.

---

## Self-review notes

- **Spec coverage:** Dashboard libs (Tasks 1-4), dashboard components incl. orchestrator (Tasks 5-8), dashboard page (Task 9), marketing section (Task 10). `connect-prompt`/`connect-onboarding` already covered by existing tests — intentionally not re-done (gap-fill only, none found). Scratchpad layers are Plans 2 and 3.
- **No new dependencies:** confirmed — this plan needs no `fake-indexeddb` or polyfills (those land in Plan 2).
- **Type consistency:** `MemosStatsData`, `MemosActivityDay`, `MemosStatsResult`, `SafeMemosSettings`, `CachedDashboardStats`, and `MemosSettingsRequestError(message, status)` are used with the signatures verified in source.
