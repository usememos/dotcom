import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MainContentAds, SidebarAds } from "./ads-section";

const mocks = vi.hoisted(() => ({
  viewportWidth: 390 as number | undefined,
}));

vi.mock("@/features/docs/hooks/use-media-query", () => ({
  useMediaQuery: (query: string) => {
    if (mocks.viewportWidth === undefined) return undefined;

    const minimumWidth = Number.parseInt(query.match(/min-width:\s*(\d+)px/)?.[1] ?? "0", 10);
    return mocks.viewportWidth >= minimumWidth;
  },
}));

vi.mock("@/shared/ui/carbon-ad-card", () => ({
  CarbonAdCard: () => <div data-testid="carbon-ad" />,
}));

vi.mock("@/features/docs/components/docs-sponsor-card", () => ({
  DocsSponsorCard: () => <div data-testid="sponsors" />,
}));

describe("responsive ads sections", () => {
  beforeEach(() => {
    mocks.viewportWidth = 390;
  });

  it("keeps Carbon unmounted until the viewport is known", () => {
    mocks.viewportWidth = undefined;

    render(
      <>
        <MainContentAds />
        <SidebarAds />
      </>,
    );

    expect(screen.queryByTestId("carbon-ad")).not.toBeInTheDocument();
    expect(screen.queryByTestId("sponsors")).not.toBeInTheDocument();
  });

  it.each([
    { breakpoint: "lg" as const, mainWidth: 1023, sidebarWidth: 1024 },
    { breakpoint: "xl" as const, mainWidth: 1279, sidebarWidth: 1280 },
  ])("switches from main content to sidebar at the $breakpoint breakpoint", ({ breakpoint, mainWidth, sidebarWidth }) => {
    const placements = () => (
      <>
        <MainContentAds breakpoint={breakpoint} />
        <SidebarAds breakpoint={breakpoint} />
      </>
    );

    mocks.viewportWidth = mainWidth;
    const { rerender } = render(placements());

    expectPlacement("main-content");

    mocks.viewportWidth = sidebarWidth;
    rerender(placements());

    expectPlacement("sidebar");
  });
});

function expectPlacement(placement: "main-content" | "sidebar") {
  const carbon = screen.getByTestId("carbon-ad");
  const container = carbon.parentElement;

  expect(screen.getAllByTestId("carbon-ad")).toHaveLength(1);
  expect(screen.getAllByTestId("sponsors")).toHaveLength(1);
  expect(container).toHaveAttribute("data-ads-placement", placement);
  expect(Array.from(container?.children ?? []).map((child) => child.getAttribute("data-testid"))).toEqual(["sponsors", "carbon-ad"]);
}
