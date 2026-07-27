import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SITE_NAV_LINKS } from "@/shared/lib/seo";
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
    const { container } = render(<SiteHeader />);

    expect(screen.getByRole("navigation", { name: "Main navigation" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Memos" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("button", { name: "Product" })).toHaveClass("text-primary");
    expect(screen.getByRole("button", { name: "Tools" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute("href", "/docs");
    expect(screen.getByRole("button", { name: "Resources" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Get Started" })).toHaveAttribute("href", "/docs/getting-started");
    const githubLink = screen.getByRole("link", { name: "Memos on GitHub, 60K+ stars" });
    expect(githubLink).toHaveAttribute("href", "https://github.com/usememos/memos");
    expect(within(githubLink).getByText("60K+")).toBeInTheDocument();
    expect(screen.queryByText("Theme")).not.toBeInTheDocument();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /search/i })).not.toBeInTheDocument();

    const initialLinks = Array.from(container.querySelectorAll<HTMLAnchorElement>("nav a"));
    for (const item of SITE_NAV_LINKS) {
      const link = initialLinks.find(
        (candidate) => candidate.getAttribute("href") === item.href && candidate.textContent?.includes(item.description),
      );
      expect(link, `${item.name} and its description should be in a crawlable link`).toBeDefined();
      expect(link).toHaveTextContent(item.name);
    }
  });

  it("marks the owning group active for nested routes", () => {
    mocks.pathname = "/features/self-hosted";
    render(<SiteHeader />);

    expect(screen.getByRole("button", { name: "Product" })).toHaveClass("text-primary");
    expect(screen.getByRole("link", { name: "Docs" })).not.toHaveClass("text-primary");
  });

  it("places API Reference under Resources and omits Pricing", async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);

    await user.hover(screen.getByRole("button", { name: "Resources" }));

    expect(await screen.findByRole("menuitem", { name: /API Reference/ })).toHaveAttribute("href", "/docs/api");
    expect(screen.getByRole("menu")).toHaveClass("space-y-1");
    expect(screen.queryByText("Pricing")).not.toBeInTheDocument();
  });

  it("opens on hover without letting clicks pin the menu", async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);

    const trigger = screen.getByRole("button", { name: "Product" });
    await user.hover(trigger);
    expect(await screen.findByRole("menuitem", { name: /Features/ })).toHaveAttribute("href", "/features");

    await user.click(trigger);
    await user.unhover(trigger);

    await waitFor(() => expect(screen.queryByRole("menuitem", { name: /Features/ })).not.toBeInTheDocument());
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
    expect(screen.getAllByRole("link", { name: /Docs/ })).toHaveLength(2);
    expect(screen.getByRole("link", { name: /Features/ })).toHaveAttribute("href", "/features");
    expect(screen.getByRole("link", { name: /API Reference/ })).toHaveAttribute("href", "/docs/api");

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
    mocks.pathname = "/blog";
    rerender(<SiteHeader />);

    expect(screen.getByRole("button", { name: "Open navigation menu" })).toHaveAttribute("aria-expanded", "false");
  });
});
