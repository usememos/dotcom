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
    render(<DashboardHeader user={{ fullName: "Ada Lovelace" }} secondary="memos.example.com · v1" onManageConnection={vi.fn()} />);

    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByText("memos.example.com · v1")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Account and connection" })).toBeInTheDocument();
  });

  it("calls onManageConnection (deferred) when the menu item is selected", async () => {
    const onManageConnection = vi.fn();
    const user = userEvent.setup();

    render(<DashboardHeader user={null} secondary="Not connected" onManageConnection={onManageConnection} />);

    await user.click(screen.getByRole("button", { name: "Account and connection" }));
    await user.click(await screen.findByText("Manage connection"));

    // onSelect defers via setTimeout(_, 0) so the dropdown unmounts before the dialog.
    await waitFor(() => expect(onManageConnection).toHaveBeenCalledTimes(1));
  });
});
