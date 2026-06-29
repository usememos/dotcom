import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/shared/settings/memos-settings-client", () => ({
  saveMemosSettings: vi.fn(),
  getMemosSettings: vi.fn(),
  deleteMemosSettings: vi.fn(),
  MemosSettingsRequestError: class MemosSettingsRequestError extends Error {},
}));

vi.mock("@/shared/memos/instance-stats", () => ({
  testInstanceConnection: vi.fn(),
}));

import { describeInstanceError } from "@/shared/memos/errors";
import { testInstanceConnection } from "@/shared/memos/instance-stats";
import { saveMemosSettings } from "@/shared/settings/memos-settings-client";
import { MemosConnectionForm } from "./memos-connection-form";

const notConnected = { instanceUrl: null, hasAccessToken: false };

describe("MemosConnectionForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("tests then saves the connection in one Connect action, then closes via onSaved", async () => {
    const saved = { instanceUrl: "https://memos.example.com", hasAccessToken: true };
    vi.mocked(testInstanceConnection).mockResolvedValue({ ok: true, name: "Steven" });
    vi.mocked(saveMemosSettings).mockResolvedValue(saved);
    const onSaved = vi.fn();
    const onSettingsChange = vi.fn();
    const user = userEvent.setup();

    render(<MemosConnectionForm settings={notConnected} onSettingsChange={onSettingsChange} onSaved={onSaved} />);

    await user.type(screen.getByLabelText("Instance URL"), "https://memos.example.com");
    await user.type(screen.getByLabelText("Access token"), "tok_123");
    await user.click(screen.getByRole("button", { name: "Connect" }));

    // The live test runs first, and only on success is the connection persisted.
    expect(testInstanceConnection).toHaveBeenCalledWith({ instanceUrl: "https://memos.example.com", accessToken: "tok_123" });
    expect(saveMemosSettings).toHaveBeenCalledWith({ instanceUrl: "https://memos.example.com", accessToken: "tok_123" });
    expect(onSettingsChange).toHaveBeenCalledWith(saved);

    // Success state is shown; the user acknowledges it to close.
    expect(await screen.findByText("Connected as Steven")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Done" }));
    expect(onSaved).toHaveBeenCalledTimes(1);
  });

  it("does not save when the live test fails, surfacing the classified error (CORS)", async () => {
    const detail = describeInstanceError("cors", { origin: "https://www.usememos.com" });
    vi.mocked(testInstanceConnection).mockResolvedValue({ ok: false, error: detail });
    const onSettingsChange = vi.fn();
    const user = userEvent.setup();

    render(<MemosConnectionForm settings={notConnected} onSettingsChange={onSettingsChange} />);
    await user.type(screen.getByLabelText("Instance URL"), "https://memos.example.com");
    await user.type(screen.getByLabelText("Access token"), "tok_123");
    await user.click(screen.getByRole("button", { name: "Connect" }));

    expect(await screen.findByText(detail.title)).toBeInTheDocument();
    expect(saveMemosSettings).not.toHaveBeenCalled();
  });

  it("shows a token help hint during first-time setup", () => {
    render(<MemosConnectionForm settings={notConnected} onSettingsChange={vi.fn()} />);
    expect(screen.getByText(/Settings → Access Tokens/)).toBeInTheDocument();
  });

  it("links to the instance's token settings once a URL is entered", async () => {
    const user = userEvent.setup();
    render(<MemosConnectionForm settings={notConnected} onSettingsChange={vi.fn()} />);

    await user.type(screen.getByLabelText("Instance URL"), "https://memos.example.com");
    const link = screen.getByRole("link", { name: /memos\.example\.com\/setting/ });
    expect(link).toHaveAttribute("href", "https://memos.example.com/setting");
  });
});
