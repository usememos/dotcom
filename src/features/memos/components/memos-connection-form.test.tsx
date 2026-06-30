import { render, screen } from "@testing-library/react";
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

  it("tests then saves the connection in one Connect action, then closes via onDone", async () => {
    vi.mocked(testInstanceConnection).mockResolvedValue({ ok: true, name: "Steven" });
    const onSave = vi.fn().mockResolvedValue(undefined);
    const onDone = vi.fn();
    const user = userEvent.setup();

    render(<MemosConnectionForm instanceUrl={null} connected={false} onSave={onSave} onDisconnect={noop} onDone={onDone} />);

    await user.type(screen.getByLabelText("Instance URL"), "https://memos.example.com");
    await user.type(screen.getByLabelText("Access token"), "tok_123");
    await user.click(screen.getByRole("button", { name: "Connect" }));

    // The live test runs first, and only on success is the connection persisted.
    const creds = { instanceUrl: "https://memos.example.com", accessToken: "tok_123" };
    expect(testInstanceConnection).toHaveBeenCalledWith(creds);
    expect(onSave).toHaveBeenCalledWith(creds);

    expect(await screen.findByText("Connected as Steven")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Done" }));
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("does not save when the live test fails, surfacing the classified error (CORS)", async () => {
    const detail = describeInstanceError("cors", { origin: "https://www.usememos.com" });
    vi.mocked(testInstanceConnection).mockResolvedValue({ ok: false, error: detail });
    const onSave = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<MemosConnectionForm instanceUrl={null} connected={false} onSave={onSave} onDisconnect={noop} />);
    await user.type(screen.getByLabelText("Instance URL"), "https://memos.example.com");
    await user.type(screen.getByLabelText("Access token"), "tok_123");
    await user.click(screen.getByRole("button", { name: "Connect" }));

    expect(await screen.findByText(detail.title)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it("rejects an invalid instance URL before testing", async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<MemosConnectionForm instanceUrl={null} connected={false} onSave={onSave} onDisconnect={noop} />);
    await user.type(screen.getByLabelText("Instance URL"), "not-a-url");
    await user.type(screen.getByLabelText("Access token"), "tok_123");
    await user.click(screen.getByRole("button", { name: "Connect" }));

    expect(screen.getByText(/Enter a valid URL/)).toBeInTheDocument();
    expect(testInstanceConnection).not.toHaveBeenCalled();
    expect(onSave).not.toHaveBeenCalled();
  });

  it("shows a token help hint during first-time setup", () => {
    render(<MemosConnectionForm instanceUrl={null} connected={false} onSave={noop} onDisconnect={noop} />);
    expect(screen.getByText(/Settings → Access Tokens/)).toBeInTheDocument();
  });

  it("links to the instance's token settings once a URL is entered", async () => {
    const user = userEvent.setup();
    render(<MemosConnectionForm instanceUrl={null} connected={false} onSave={noop} onDisconnect={noop} />);

    await user.type(screen.getByLabelText("Instance URL"), "https://memos.example.com");
    const link = screen.getByRole("link", { name: /memos\.example\.com\/setting/ });
    expect(link).toHaveAttribute("href", "https://memos.example.com/setting");
  });

  it("disconnects via onDisconnect when connected", async () => {
    const onDisconnect = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<MemosConnectionForm instanceUrl="https://memos.example.com" connected onSave={noop} onDisconnect={onDisconnect} />);

    await user.click(screen.getByRole("button", { name: "Disconnect" }));
    expect(onDisconnect).toHaveBeenCalledTimes(1);
  });
});
