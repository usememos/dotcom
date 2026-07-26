import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SiteHeader } from "./site-header";

const mocks = vi.hoisted(() => ({
  pathname: "/features",
}));

vi.mock("next/navigation", () => ({
  usePathname: () => mocks.pathname,
}));

vi.mock("@/features/marketing/hooks/use-github-star-count", () => ({
  useGithubStarCount: () => "60K+",
}));

describe("SiteHeader", () => {
  beforeEach(() => {
    mocks.pathname = "/features";
  });

  it("renders the owned site navigation without a search entry", () => {
    render(<SiteHeader />);

    expect(screen.getByRole("navigation", { name: "Main navigation" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Memos" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Features" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute("href", "/docs");
    const githubLink = screen.getByRole("link", { name: "Memos on GitHub, 60K+ stars" });
    expect(githubLink).toHaveAttribute("href", "https://github.com/usememos/memos");
    expect(within(githubLink).getByText("60K+")).toBeInTheDocument();
    expect(screen.queryByText("Theme")).not.toBeInTheDocument();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /search/i })).not.toBeInTheDocument();
  });

  it("marks only the exact route as the current page", () => {
    mocks.pathname = "/features/self-hosted";
    render(<SiteHeader />);

    const featuresLink = screen.getByRole("link", { name: "Features" });
    // The section keeps its active styling, but a link to a different URL must
    // not be announced as the current page.
    expect(featuresLink).not.toHaveAttribute("aria-current");
    expect(featuresLink.className).toContain("text-primary");
  });

  it("keeps the mobile panel referenced by aria-controls while collapsed", () => {
    render(<SiteHeader />);

    const trigger = screen.getByRole("button", { name: "Open navigation menu" });
    const panelId = trigger.getAttribute("aria-controls");

    expect(panelId).toBe("site-mobile-navigation");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    // The panel must exist even when closed, or aria-controls dangles.
    expect(document.getElementById(String(panelId))).toBeInTheDocument();
    expect(document.getElementById(String(panelId))).toHaveAttribute("hidden");
  });

  it("opens and closes the mobile navigation", () => {
    render(<SiteHeader />);

    fireEvent.click(screen.getByRole("button", { name: "Open navigation menu" }));

    expect(screen.getByRole("button", { name: "Close navigation menu" })).toHaveAttribute("aria-expanded", "true");
    expect(document.querySelector("#site-mobile-navigation")).not.toHaveAttribute("hidden");
    expect(screen.getAllByRole("link", { name: "Docs" })).toHaveLength(2);

    fireEvent.click(screen.getByRole("button", { name: "Close navigation menu" }));
    expect(screen.getByRole("button", { name: "Open navigation menu" })).toHaveAttribute("aria-expanded", "false");
  });

  it("keeps the mobile navigation inside the navigation landmark", () => {
    render(<SiteHeader />);

    fireEvent.click(screen.getByRole("button", { name: "Open navigation menu" }));

    const panel = document.querySelector("#site-mobile-navigation");
    expect(panel?.closest("nav")).toHaveAttribute("aria-label", "Main navigation");
  });

  it("dismisses the mobile navigation on Escape and returns focus to the toggle", () => {
    render(<SiteHeader />);

    const trigger = screen.getByRole("button", { name: "Open navigation menu" });
    fireEvent.click(trigger);
    fireEvent.keyDown(document, { key: "Escape" });

    const collapsed = screen.getByRole("button", { name: "Open navigation menu" });
    expect(collapsed).toHaveAttribute("aria-expanded", "false");
    expect(collapsed).toHaveFocus();
  });

  it("dismisses the mobile navigation on a pointer press outside the header", () => {
    render(<SiteHeader />);

    fireEvent.click(screen.getByRole("button", { name: "Open navigation menu" }));
    fireEvent.pointerDown(document.body);

    expect(screen.getByRole("button", { name: "Open navigation menu" })).toHaveAttribute("aria-expanded", "false");
  });

  it("dismisses the mobile navigation when the route changes", () => {
    const { rerender } = render(<SiteHeader />);

    fireEvent.click(screen.getByRole("button", { name: "Open navigation menu" }));
    expect(screen.getByRole("button", { name: "Close navigation menu" })).toHaveAttribute("aria-expanded", "true");

    // SiteHeader lives in the persistent (site) layout, so a navigation must
    // close the panel explicitly — it never unmounts between routes.
    mocks.pathname = "/pricing";
    rerender(<SiteHeader />);

    expect(screen.getByRole("button", { name: "Open navigation menu" })).toHaveAttribute("aria-expanded", "false");
  });
});
