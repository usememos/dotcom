import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/shared/memos/instance-stats", () => ({
  testInstanceConnection: vi.fn(),
}));

import { describeInstanceError } from "@/shared/memos/errors";
import { testInstanceConnection } from "@/shared/memos/instance-stats";
import { MemosConnectionForm } from "./memos-connection-form";

const noop = () => Promise.resolve();

describe("MemosConnectionForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("tests then saves the connection in one action", async () => {
    vi.mocked(testInstanceConnection).mockResolvedValue({ ok: true, name: "Steven", version: "0.30.0" });
    const onSave = vi.fn().mockResolvedValue(undefined);
    const onSaved = vi.fn();
    const user = userEvent.setup();

    render(<MemosConnectionForm instanceUrl={null} onSave={onSave} onSaved={onSaved} />);

    fireEvent.change(screen.getByLabelText("Instance URL"), { target: { value: "https://memos.example.com" } });
    fireEvent.change(screen.getByLabelText("Personal access token (PAT)"), { target: { value: "tok_123" } });
    await user.click(screen.getByRole("button", { name: "Test and save" }));

    // The live test runs first, and only on success is the connection persisted.
    const creds = { instanceUrl: "https://memos.example.com", accessToken: "tok_123" };
    expect(testInstanceConnection).toHaveBeenCalledWith(creds);
    expect(onSave).toHaveBeenCalledWith(creds);

    expect(onSaved).toHaveBeenCalledWith({ ok: true, name: "Steven", version: "0.30.0" });
  });

  it("does not save when the live test fails, surfacing the classified error (CORS)", async () => {
    const detail = describeInstanceError("cors", { origin: "https://www.usememos.com" });
    vi.mocked(testInstanceConnection).mockResolvedValue({ ok: false, error: detail });
    const onSave = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<MemosConnectionForm instanceUrl={null} onSave={onSave} />);
    fireEvent.change(screen.getByLabelText("Instance URL"), { target: { value: "https://memos.example.com" } });
    fireEvent.change(screen.getByLabelText("Personal access token (PAT)"), { target: { value: "tok_123" } });
    await user.click(screen.getByRole("button", { name: "Test and save" }));

    expect(await screen.findByText(detail.title)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it("rejects an invalid instance URL before testing", async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<MemosConnectionForm instanceUrl={null} onSave={onSave} />);
    fireEvent.change(screen.getByLabelText("Instance URL"), { target: { value: "not-a-url" } });
    fireEvent.change(screen.getByLabelText("Personal access token (PAT)"), { target: { value: "tok_123" } });
    await user.click(screen.getByRole("button", { name: "Test and save" }));

    expect(screen.getByText("Enter a complete URL starting with https:// (or http:// for local testing).")).toBeInTheDocument();
    expect(testInstanceConnection).not.toHaveBeenCalled();
    expect(onSave).not.toHaveBeenCalled();
  });

  it("shows a token help hint during first-time setup", () => {
    render(<MemosConnectionForm instanceUrl={null} onSave={noop} />);
    expect(screen.getByText(/Settings → Access Tokens/)).toBeInTheDocument();
  });

  it("shows required field errors instead of hiding them behind a disabled action", async () => {
    const user = userEvent.setup();
    render(<MemosConnectionForm instanceUrl={null} onSave={noop} />);

    await user.click(screen.getByRole("button", { name: "Test and save" }));

    expect(screen.getByText("Enter your Memos instance URL.")).toBeInTheDocument();
    expect(screen.getByText("Paste a personal access token from this Memos instance.")).toBeInTheDocument();
    expect(testInstanceConnection).not.toHaveBeenCalled();
  });

  it("offers the demo setup path and fills its instance URL", async () => {
    const user = userEvent.setup();
    render(<MemosConnectionForm instanceUrl={null} onSave={noop} showDemoOption />);

    expect(screen.getByRole("link", { name: "Create demo PAT" })).toHaveAttribute("href", "https://demo.usememos.com/setting");
    expect(
      screen.getByLabelText("Instance URL").compareDocumentPosition(screen.getByRole("button", { name: "Use demo.usememos.com" })) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Use demo.usememos.com" }));

    expect(screen.getByLabelText("Instance URL")).toHaveValue("https://demo.usememos.com");
    expect(screen.getByRole("button", { name: "Using demo.usememos.com" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("link", { name: "Open this instance’s access token settings" })).toHaveAttribute(
      "href",
      "https://demo.usememos.com/setting",
    );
    expect(screen.getByLabelText("Personal access token (PAT)")).toHaveFocus();
  });

  it("links to the instance's token settings once a URL is entered", () => {
    render(<MemosConnectionForm instanceUrl={null} onSave={noop} />);

    fireEvent.change(screen.getByLabelText("Instance URL"), { target: { value: "https://memos.example.com" } });
    const link = screen.getByRole("link", { name: "Open this instance’s access token settings" });
    expect(link).toHaveAttribute("href", "https://memos.example.com/setting");
  });

  it("keeps the saved token when editing with an empty token field", async () => {
    vi.mocked(testInstanceConnection).mockResolvedValue({ ok: true, name: "Steven", version: "0.30.0" });
    const onSave = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<MemosConnectionForm instanceUrl="https://memos.example.com" existingAccessToken="saved-token" onSave={onSave} />);

    expect(screen.getByLabelText("Personal access token (PAT)")).toHaveValue("");
    await user.click(screen.getByRole("button", { name: "Test and save" }));
    expect(onSave).toHaveBeenCalledWith({ instanceUrl: "https://memos.example.com", accessToken: "saved-token" });
  });

  it("keeps the entered replacement values and offers Retry when saving fails", async () => {
    vi.mocked(testInstanceConnection).mockResolvedValue({ ok: true, name: "Steven", version: "0.30.0" });
    const onSave = vi.fn().mockRejectedValue(new Error("Clerk unavailable"));
    const user = userEvent.setup();
    render(<MemosConnectionForm instanceUrl="https://old.example.com" existingAccessToken="old-token" onSave={onSave} />);

    fireEvent.change(screen.getByLabelText("Instance URL"), { target: { value: "https://new.example.com" } });
    fireEvent.change(screen.getByLabelText("Personal access token (PAT)"), { target: { value: "new-token" } });
    await user.click(screen.getByRole("button", { name: "Test and save" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/existing connection is unchanged/i);
    expect(screen.getByLabelText("Instance URL")).toHaveValue("https://new.example.com");
    expect(screen.getByLabelText("Personal access token (PAT)")).toHaveValue("new-token");
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });
});
