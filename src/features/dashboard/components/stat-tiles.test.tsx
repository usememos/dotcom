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
