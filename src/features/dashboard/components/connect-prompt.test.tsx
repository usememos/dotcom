import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/shared/settings/memos-settings-client", () => ({
  saveMemosSettings: vi.fn(),
  testMemosConnection: vi.fn(),
  getMemosSettings: vi.fn(),
  deleteMemosSettings: vi.fn(),
  MemosSettingsRequestError: class MemosSettingsRequestError extends Error {},
}));

import { ConnectPrompt } from "./connect-prompt";

const notConnected = { instanceUrl: null, hasAccessToken: false };

describe("ConnectPrompt", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows the setup notice over blurred sample stats", () => {
    render(<ConnectPrompt settings={notConnected} onComplete={vi.fn()} />);

    expect(screen.getByText("Set up your Memos instance")).toBeInTheDocument();
    // Sample stat tiles render behind the blur.
    expect(screen.getByText("Total memos")).toBeInTheDocument();
  });

  it("opens the guide from the notice and returns via Maybe later", async () => {
    const user = userEvent.setup();
    render(<ConnectPrompt settings={notConnected} onComplete={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Set up instance" }));
    expect(screen.getByText("Welcome to your dashboard")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Maybe later" }));
    expect(screen.getByText("Set up your Memos instance")).toBeInTheDocument();
  });
});
