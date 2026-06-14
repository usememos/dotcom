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
import { ConnectOnboarding } from "./connect-onboarding";

const notConnected = { instanceUrl: null, hasAccessToken: false };

async function fillAndSave(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: "Get started" }));
  await user.type(screen.getByLabelText("Instance URL"), "https://memos.example.com");
  await user.type(screen.getByLabelText("Access token"), "tok_123");
  await user.click(screen.getByRole("button", { name: "Save" }));
}

describe("ConnectOnboarding", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the step indicator and marks the active step", async () => {
    const user = userEvent.setup();
    render(<ConnectOnboarding settings={notConnected} onComplete={vi.fn()} />);

    // All three steps are listed in the stepper.
    expect(screen.getByText("Introduction")).toBeInTheDocument();
    expect(screen.getByText("Set up instance")).toBeInTheDocument();
    expect(screen.getByText("Done")).toBeInTheDocument();

    // Step 1 is active on first render.
    expect(screen.getByText("Introduction").closest("[aria-current]")).toHaveAttribute("aria-current", "step");

    // Advancing moves the active marker to the setup step.
    await user.click(screen.getByRole("button", { name: "Get started" }));
    expect(screen.getByText("Set up instance").closest("[aria-current]")).toHaveAttribute("aria-current", "step");
  });

  it("walks intro -> form -> save -> continue -> congrats -> complete", async () => {
    vi.mocked(saveMemosSettings).mockResolvedValue({ instanceUrl: "https://memos.example.com", hasAccessToken: true });
    const onComplete = vi.fn();
    const user = userEvent.setup();

    render(<ConnectOnboarding settings={notConnected} onComplete={onComplete} />);

    // Step 1: intro
    expect(screen.getByText("Welcome to your dashboard")).toBeInTheDocument();

    await fillAndSave(user);

    // After save: a manual Continue button appears; congrats is NOT shown yet
    // and the dashboard reload (onComplete) has not fired.
    const continueButton = await screen.findByRole("button", { name: "Continue" });
    expect(screen.queryByText("You're all set 🎉")).not.toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();

    await user.click(continueButton);

    // Step 3: congrats
    expect(screen.getByText("You're all set 🎉")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Go to dashboard" }));
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("stays on the form and shows an error when saving fails", async () => {
    vi.mocked(saveMemosSettings).mockRejectedValue(new Error("boom"));
    const user = userEvent.setup();

    render(<ConnectOnboarding settings={notConnected} onComplete={vi.fn()} />);
    await fillAndSave(user);

    expect(await screen.findByText("Couldn't save settings. Try again.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Continue" })).not.toBeInTheDocument();
  });

  it("returns to the intro step from the form via Back", async () => {
    const user = userEvent.setup();
    render(<ConnectOnboarding settings={notConnected} onComplete={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Get started" }));
    expect(screen.getByLabelText("Instance URL")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Back" }));
    expect(screen.getByText("Welcome to your dashboard")).toBeInTheDocument();
  });

  it("shows 'Maybe later' only when onCancel is provided and calls it", async () => {
    const onCancel = vi.fn();
    const user = userEvent.setup();

    const { rerender } = render(<ConnectOnboarding settings={notConnected} onComplete={vi.fn()} />);
    expect(screen.queryByRole("button", { name: "Maybe later" })).not.toBeInTheDocument();

    rerender(<ConnectOnboarding settings={notConnected} onComplete={vi.fn()} onCancel={onCancel} />);
    await user.click(screen.getByRole("button", { name: "Maybe later" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
