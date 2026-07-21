import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}));
vi.mock("./app-account-menu", () => ({
  AppAccountMenu: ({ compact = false }: { compact?: boolean }) => <button type="button">{compact ? "Mobile account" : "Account"}</button>,
}));

import { AppShell } from "./app-shell";

describe("AppShell", () => {
  it("reserves a fixed sidebar row for the account menu and scrolls navigation at short heights", () => {
    render(
      <AppShell>
        <div>Page content</div>
      </AppShell>,
    );

    const sidebar = screen.getByRole("complementary");
    expect(sidebar).toHaveClass("grid-rows-[auto_auto_minmax(0,1fr)_auto]");
    expect(within(sidebar).getByRole("navigation", { name: "Workspace" }).parentElement).toHaveClass("min-h-0", "overflow-y-auto");
    expect(within(sidebar).getByRole("button", { name: "Account" }).parentElement).toHaveClass("h-11");
  });

  it("switches mobile navigation labels to screen-reader-only before narrow layouts collide", () => {
    render(
      <AppShell>
        <div>Page content</div>
      </AppShell>,
    );

    const overviewLabels = screen.getAllByText("Overview");
    expect(overviewLabels.some((label) => label.classList.contains("max-[399px]:sr-only"))).toBe(true);
  });
});
