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
