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

import { saveMemosSettings } from "@/shared/settings/memos-settings-client";
import { MemosConnectionForm } from "./memos-connection-form";

const notConnected = { instanceUrl: null, hasAccessToken: false };

describe("MemosConnectionForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("saves the entered URL + token and reports the saved settings via onSaved", async () => {
    const saved = { instanceUrl: "https://memos.example.com", hasAccessToken: true };
    vi.mocked(saveMemosSettings).mockResolvedValue(saved);
    const onSaved = vi.fn();
    const onSettingsChange = vi.fn();
    const user = userEvent.setup();

    render(<MemosConnectionForm settings={notConnected} onSettingsChange={onSettingsChange} onSaved={onSaved} />);

    await user.type(screen.getByLabelText("Instance URL"), "https://memos.example.com");
    await user.type(screen.getByLabelText("Access token"), "tok_123");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(saveMemosSettings).toHaveBeenCalledWith({ instanceUrl: "https://memos.example.com", accessToken: "tok_123" });
    expect(onSettingsChange).toHaveBeenCalledWith(saved);
    expect(onSaved).toHaveBeenCalledWith(saved);
  });

  it("shows a token help hint during first-time setup", () => {
    render(<MemosConnectionForm settings={notConnected} onSettingsChange={vi.fn()} />);
    expect(screen.getByText(/Settings → Access Tokens/)).toBeInTheDocument();
  });
});
