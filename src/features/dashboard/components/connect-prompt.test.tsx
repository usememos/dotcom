import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ConnectPrompt } from "./connect-prompt";

describe("ConnectPrompt", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows the setup notice over blurred sample stats", () => {
    render(<ConnectPrompt />);

    expect(screen.getByText("Connect Memos to your account")).toBeInTheDocument();
    // Sample stat tiles render behind the blur.
    expect(screen.getByText("Total memos")).toBeInTheDocument();
  });

  it("links setup to the canonical connections page", () => {
    render(<ConnectPrompt />);
    expect(screen.getByRole("link", { name: "Connect instance" })).toHaveAttribute("href", "/settings/connections");
  });

  it("previews the upcoming browser extension as a secondary capability", () => {
    render(<ConnectPrompt />);
    expect(screen.getByText("Browser extension")).toBeInTheDocument();
    expect(screen.getByText("Coming soon")).toBeInTheDocument();
    expect(screen.getByText("Save pages to Memos from your browser.")).toBeInTheDocument();
  });
});
