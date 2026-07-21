import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  signIn: vi.fn(),
  testConnection: vi.fn(),
  connection: {
    credentials: null as { instanceUrl: string; accessToken: string } | null,
    instanceUrl: null as string | null,
    isLoaded: true,
    isSignedIn: true,
    save: vi.fn(),
    disconnect: vi.fn(),
  },
}));

vi.mock("@/features/account/hooks/use-account-actions", () => ({
  useAccountActions: () => ({ user: null, signIn: mocks.signIn }),
}));
vi.mock("@/features/memos/hooks/use-memos-connection", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/features/memos/hooks/use-memos-connection")>();
  return { ...original, useMemosConnection: () => mocks.connection };
});
vi.mock("@/shared/memos/instance-stats", () => ({
  testInstanceConnection: mocks.testConnection,
}));

import { MemosConnectionsSettings } from "./memos-connections-settings";

describe("MemosConnectionsSettings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.connection.credentials = null;
    mocks.connection.instanceUrl = null;
    mocks.connection.isLoaded = true;
    mocks.connection.isSignedIn = true;
  });

  it("shows extension return guidance without changing the route resource", () => {
    render(<MemosConnectionsSettings source="web-clipper" />);
    expect(screen.getByRole("heading", { name: "Connect your Memos instance" })).toBeInTheDocument();
    expect(screen.getByText(/then return to Memos Web Clipper/i)).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Dashboard" })).not.toBeInTheDocument();
  });

  it("keeps first-time setup focused on the connection form", () => {
    render(<MemosConnectionsSettings source={null} />);
    expect(screen.getByLabelText("Instance URL")).toBeInTheDocument();
    expect(screen.getByLabelText("Personal access token (PAT)")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Test and save" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Use demo.usememos.com" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Before you connect" })).not.toBeInTheDocument();
    expect(screen.queryByText("Connection saved to this account")).not.toBeInTheDocument();
    expect(screen.queryByText("Browser extension")).not.toBeInTheDocument();
  });

  it("returns signed-out users to the same page through the account sign-in action", async () => {
    mocks.connection.isSignedIn = false;
    const user = userEvent.setup();
    render(<MemosConnectionsSettings source={null} />);
    await user.click(screen.getByRole("button", { name: "Sign in" }));
    expect(mocks.signIn).toHaveBeenCalledTimes(1);
  });

  it("checks and renders an existing connection with direct management actions", async () => {
    mocks.connection.credentials = { instanceUrl: "https://memos.example.com", accessToken: "tok" };
    mocks.connection.instanceUrl = "https://memos.example.com";
    mocks.testConnection.mockResolvedValue({ ok: true, name: "Steven", version: "0.30.0" });
    render(<MemosConnectionsSettings source={null} />);

    expect(await screen.findByText("0.30.0")).toBeInTheDocument();
    expect(screen.getByText("Just now")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open Memos" })).toHaveAttribute("href", "https://memos.example.com");
    expect(screen.getByRole("button", { name: "Edit connection" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Disconnect" })).toBeInTheDocument();
    expect(screen.getByText("Browser extension")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Get it/ })).toHaveAttribute("href", "/web-clipper");
  });

  it("asks for confirmation before disconnecting and keeps the saved connection on failure", async () => {
    mocks.connection.credentials = { instanceUrl: "https://memos.example.com", accessToken: "tok" };
    mocks.connection.instanceUrl = "https://memos.example.com";
    mocks.testConnection.mockResolvedValue({ ok: true, name: "Steven", version: "0.30.0" });
    mocks.connection.disconnect.mockRejectedValue(new Error("save failed"));
    const user = userEvent.setup();
    render(<MemosConnectionsSettings source={null} />);

    await screen.findByText("0.30.0");
    await user.click(screen.getByRole("button", { name: "Disconnect" }));
    expect(screen.getByText(/Disconnect this instance/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Disconnect" }));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(/connection is still saved/i));
    expect(mocks.connection.disconnect).toHaveBeenCalledTimes(1);
  });
});
