import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/account/components/sign-out-item", () => ({
  SignOutItem: () => <div data-testid="sign-out-item" />,
}));
vi.mock("@/features/account/components/theme-toggle", () => ({
  ThemeToggle: () => <div data-testid="theme-items" />,
}));

import { DashboardHeader } from "./dashboard-header";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("DashboardHeader", () => {
  it("renders the user identity and secondary label", () => {
    render(<DashboardHeader user={{ fullName: "Ada Lovelace" }} secondary="memos.example.com · v1" />);

    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByText("memos.example.com · v1")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Account and settings" })).toBeInTheDocument();
  });

  it("links Connections to the canonical settings page", async () => {
    const user = userEvent.setup();

    render(<DashboardHeader user={null} secondary="No connections yet" />);

    await user.click(screen.getByRole("button", { name: "Account and settings" }));
    expect(await screen.findByRole("menuitem", { name: "Connections" })).toHaveAttribute("href", "/settings/connections");
  });
});
