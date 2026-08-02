import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ConnectPrompt } from "./connect-prompt";

describe("ConnectPrompt", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows a focused connection empty state without sample overview data", () => {
    render(<ConnectPrompt />);

    expect(screen.getByRole("heading", { name: "Connect your Memos instance" })).toBeInTheDocument();
    expect(screen.getByText(/Your notes stay on your server/)).toBeInTheDocument();
    expect(screen.getByText("Activity")).toBeInTheDocument();
    expect(screen.queryByText("Total memos")).not.toBeInTheDocument();
    expect(screen.queryByText("Browser extension")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Connect your Memos instance" }).parentElement).toHaveClass("border", "border-border");
  });

  it("links setup to the canonical connections page", () => {
    render(<ConnectPrompt />);
    expect(screen.getByRole("link", { name: "Connect instance" })).toHaveAttribute("href", "/settings/connections");
  });
});
