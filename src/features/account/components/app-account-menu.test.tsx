import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  account: {
    isLoaded: true,
    isSignedIn: true,
    user: {
      fullName: "Ada Lovelace",
      imageUrl: null,
      primaryEmailAddress: { emailAddress: "ada@example.com" },
    } as {
      fullName: string;
      imageUrl: string | null;
      primaryEmailAddress: { emailAddress: string };
    } | null,
    signIn: vi.fn(),
  },
}));

vi.mock("@/features/account/hooks/use-account-actions", () => ({
  useAccountActions: () => mocks.account,
}));
vi.mock("@/features/account/components/sign-out-item", () => ({
  SignOutItem: () => <div data-testid="sign-out-item" />,
}));
vi.mock("@/features/account/components/theme-toggle", () => ({
  ThemeToggle: () => <div data-testid="theme-toggle" />,
}));

import { AppAccountMenu } from "./app-account-menu";

describe("AppAccountMenu", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.account.isLoaded = true;
    mocks.account.isSignedIn = true;
    mocks.account.user = {
      fullName: "Ada Lovelace",
      imageUrl: null,
      primaryEmailAddress: { emailAddress: "ada@example.com" },
    };
  });

  it("uses the signed-in identity as the sidebar menu trigger", async () => {
    const user = userEvent.setup();
    render(<AppAccountMenu />);

    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByText("ada@example.com")).toBeInTheDocument();

    const trigger = screen.getByRole("button", { name: "Account menu" });
    expect(trigger).toHaveClass("h-11");

    await user.click(trigger);
    expect(await screen.findByTestId("sign-out-item")).toBeInTheDocument();
    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "usememos.com" })).toHaveAttribute("href", "/");
    expect(trigger).toHaveClass("h-11");
  });

  it("offers sign in when there is no account", async () => {
    mocks.account.isSignedIn = false;
    mocks.account.user = null;
    const user = userEvent.setup();
    render(<AppAccountMenu />);

    await user.click(screen.getByRole("button", { name: "Sign in" }));
    expect(mocks.account.signIn).toHaveBeenCalledTimes(1);
  });
});
