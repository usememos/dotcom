import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AdsSectionDesktop, AdsSectionMobile } from "./ads-section";

const mocks = vi.hoisted(() => ({
  viewportWidth: 390,
}));

vi.mock("@/features/docs/hooks/use-media-query", () => ({
  useMediaQuery: (query: string) => {
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

  it.each([
    { expectedViewport: "mobile", width: 1023 },
    { expectedViewport: "mobile", width: 1024 },
    { expectedViewport: "mobile", width: 1279 },
    { expectedViewport: "desktop", width: 1280 },
  ])("uses the Docs xl breakpoint at $width px", ({ expectedViewport, width }) => {
    mocks.viewportWidth = width;

    render(
      <>
        <AdsSectionMobile breakpoint="xl" items={["carbon"]} />
        <AdsSectionDesktop breakpoint="xl" items={["carbon"]} />
      </>,
    );

    const ad = screen.getByTestId("carbon-ad");
    expect(screen.getAllByTestId("carbon-ad")).toHaveLength(1);
    expect(ad.parentElement).toHaveClass(expectedViewport === "mobile" ? "xl:!hidden" : "xl:!flex");
    expect(ad.parentElement).toHaveClass("min-h-[155px]");
  });

  it.each([
    { expectedViewport: "mobile", width: 1023 },
    { expectedViewport: "desktop", width: 1024 },
    { expectedViewport: "desktop", width: 1279 },
    { expectedViewport: "desktop", width: 1280 },
  ])("uses the editorial lg breakpoint at $width px", ({ expectedViewport, width }) => {
    mocks.viewportWidth = width;

    render(
      <>
        <AdsSectionMobile items={["carbon"]} />
        <AdsSectionDesktop items={["carbon"]} />
      </>,
    );

    const ad = screen.getByTestId("carbon-ad");
    expect(screen.getAllByTestId("carbon-ad")).toHaveLength(1);
    expect(ad.parentElement).toHaveClass(expectedViewport === "mobile" ? "lg:!hidden" : "lg:!flex");
  });

  it("renders only the requested items in their requested order", () => {
    mocks.viewportWidth = 1280;

    const { rerender } = render(<AdsSectionDesktop breakpoint="xl" items={["sponsors", "carbon"]} />);

    const combined = screen.getByTestId("carbon-ad").parentElement;
    expect(Array.from(combined?.children ?? []).map((child) => child.getAttribute("data-testid"))).toEqual(["sponsors", "carbon-ad"]);

    rerender(<AdsSectionDesktop breakpoint="xl" items={["sponsors"]} />);
    expect(screen.queryByTestId("carbon-ad")).not.toBeInTheDocument();
    expect(screen.getByTestId("sponsors")).toBeInTheDocument();
  });
});
