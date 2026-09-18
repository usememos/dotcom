import { fireEvent, render, screen, within } from "@testing-library/react";
import { act } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { buildHomeCalendar, HOME_MEMOS, HOME_TAGS } from "@/features/marketing/data/home-memos";
import { MemoHeroCalendar } from "./memo-hero-calendar";
import { MemoHeroContent } from "./memo-hero-content";
import { MemoHeroMock } from "./memo-hero-mock";

vi.mock("@/shared/ui/carbon-ad-card", () => ({
  CarbonAdCard: () => <aside data-testid="carbon-ad" />,
}));

// Calendar arithmetic uses local calendar days, including month/year rollovers.
describe("homepage calendar", () => {
  it.each([
    [2026, 8, 13, "September 2026", 35],
    [2026, 7, 23, "August 2026", 42],
    [2028, 1, 29, "February 2028", 35],
    [2027, 0, 1, "January 2027", 42],
  ])("lays out %s/%s/%s in whole Sunday-start weeks", (year, month, day, label, length) => {
    const calendar = buildHomeCalendar(new Date(Number(year), Number(month), Number(day)));
    expect(calendar.label).toBe(label);
    expect(calendar.days).toHaveLength(length);
    expect(new Date(`${calendar.days[0].key}T12:00:00`).getDay()).toBe(0);
    expect(calendar.days.filter((item) => item.today)).toHaveLength(1);
    expect(calendar.days.find((item) => item.today)?.label).toBe(day);
    for (const item of calendar.days) {
      if (item.count > 0) {
        expect(item.outside).toBe(false);
        expect(item.key <= (calendar.days.find((cell) => cell.today)?.key ?? "")).toBe(true);
      }
    }
  });

  it("counts only this month's example memos across a year boundary", () => {
    const calendar = buildHomeCalendar(new Date(2027, 0, 2));
    expect(calendar.days.reduce((total, day) => total + day.count, 0)).toBe(2);
  });

  afterEach(() => vi.useRealTimers());

  it("uses the computer's local date and advances at midnight", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 30, 23, 59, 59));
    const { container, unmount } = render(<MemoHeroCalendar />);
    expect(screen.getByText("September 2026")).toBeInTheDocument();
    expect(container.querySelector('[aria-current="date"]')).toHaveAttribute("data-date", "2026-09-30");
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByText("October 2026")).toBeInTheDocument();
    expect(container.querySelector('[aria-current="date"]')).toHaveAttribute("data-date", "2026-10-01");
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});

describe("homepage example memos", () => {
  it("keeps priority order chronological and references resolvable", () => {
    expect(HOME_MEMOS.map((memo) => memo.daysAgo)).toEqual([...HOME_MEMOS.map((memo) => memo.daysAgo)].sort((a, b) => a - b));
    for (const memo of HOME_MEMOS) {
      expect(memo.daysAgo).toBeGreaterThanOrEqual(0);
      if (memo.referenceId) expect(HOME_MEMOS.some((target) => target.id === memo.referenceId)).toBe(true);
    }
  });

  it("derives parent and nested tag counts from the actual examples", () => {
    for (const item of HOME_TAGS) {
      expect(item.count).toBe(
        HOME_MEMOS.filter((memo) => memo.tags.some((tag) => tag === item.tag || tag.startsWith(`${item.tag}/`))).length,
      );
      expect(item.count).toBeGreaterThan(0);
    }
    expect(HOME_TAGS.find((item) => item.tag === "dev")?.count).toBe(2);
    expect(HOME_TAGS.find((item) => item.tag === "weekly")?.count).toBe(2);
    expect(HOME_TAGS.some((item) => item.tag === "dev/git")).toBe(true);
  });

  it("exposes the scrollable examples to keyboard and screen-reader users", () => {
    render(<MemoHeroMock />);
    const feed = screen.getByRole("region", { name: "Example memos — scroll to explore" });
    expect(feed).toHaveAttribute("tabindex", "0");
    expect(feed.closest('[aria-hidden="true"]')).toBeNull();
    expect(feed).toContainElement(screen.getByText("A small thought worth keeping…"));
    expect(feed).toContainElement(screen.getByTestId("memo-feed"));
    expect(screen.getAllByRole("article")).toHaveLength(HOME_MEMOS.length);
    const reference = screen.getByRole("link", { name: "Linked: Git TIL" });
    expect(document.querySelector(reference.getAttribute("href") ?? "")).not.toBeNull();
    const thirdMemo = screen.getAllByRole("article")[2];
    expect(within(thirdMemo).getByRole("heading", { name: "A view for unfinished work" })).toBeInTheDocument();
    expect(within(thirdMemo).getByText("has_incomplete_tasks")).toBeInTheDocument();
    expect(thirdMemo.querySelector("img")).toBeNull();
  });

  it("renders sponsorship as the fourth memo with the same metadata and one Carbon slot", () => {
    render(<MemoHeroMock />);
    const articles = screen.getAllByRole("article");
    expect(articles[2]).toHaveAttribute("id", `home-memo-${HOME_MEMOS[2].id}`);
    const sponsor = screen.getByRole("article", { name: "Built with their support" });
    expect(articles[3]).toBe(sponsor);
    expect(sponsor).toHaveAttribute("id", `home-memo-${HOME_MEMOS[3].id}`);
    expect(within(sponsor).getByText("2 days ago")).toBeInTheDocument();
    expect(within(sponsor).queryByText("#memos/sponsors")).not.toBeInTheDocument();
    expect(articles[4]).toHaveAttribute("id", `home-memo-${HOME_MEMOS[4].id}`);
    expect(screen.getAllByTestId("carbon-ad")).toHaveLength(1);
    expect(HOME_TAGS.some((item) => item.tag === "memos/sponsors")).toBe(false);
    const calendar = buildHomeCalendar(new Date(2026, 8, 15));
    expect(calendar.days.find((day) => day.key === "2026-09-13")?.count).toBe(2);
  });
});

describe("homepage content scrollbar", () => {
  afterEach(() => vi.useRealTimers());

  it("appears on scroll and hides on scrollend", () => {
    vi.useFakeTimers();
    const { unmount } = render(<MemoHeroContent>Example content</MemoHeroContent>);
    const content = screen.getByTestId("memo-content");
    expect(content).toHaveAttribute("data-scrolling", "false");
    fireEvent.scroll(content);
    expect(content).toHaveAttribute("data-scrolling", "true");
    // No debounce timer is armed when the browser reports scroll end itself.
    expect(vi.getTimerCount()).toBe(0);
    act(() => vi.advanceTimersByTime(2000));
    expect(content).toHaveAttribute("data-scrolling", "true");
    fireEvent(content, new Event("scrollend", { bubbles: true }));
    expect(content).toHaveAttribute("data-scrolling", "false");
    unmount();
  });

  it("falls back to a debounce timer when scrollend is unsupported", () => {
    vi.useFakeTimers();
    // Unsupported browsers have no `onscrollend` property at all (reads as undefined).
    const original = Object.getOwnPropertyDescriptor(window, "onscrollend");
    Object.defineProperty(window, "onscrollend", { value: undefined, configurable: true });
    const { unmount } = render(<MemoHeroContent>Example content</MemoHeroContent>);
    const content = screen.getByTestId("memo-content");
    expect(content).toHaveAttribute("data-scrolling", "false");
    fireEvent.mouseEnter(content);
    expect(content).toHaveAttribute("data-scrolling", "false");
    fireEvent.scroll(content);
    expect(content).toHaveAttribute("data-scrolling", "true");
    act(() => vi.advanceTimersByTime(500));
    fireEvent.scroll(content);
    act(() => vi.advanceTimersByTime(500));
    expect(content).toHaveAttribute("data-scrolling", "true");
    act(() => vi.advanceTimersByTime(200));
    expect(content).toHaveAttribute("data-scrolling", "false");
    fireEvent.scroll(content);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
    if (original) {
      Object.defineProperty(window, "onscrollend", original);
    } else {
      delete (window as { onscrollend?: unknown }).onscrollend;
    }
  });
});
