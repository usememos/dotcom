import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/shared/settings/memos-settings-client", () => ({
  saveMemosSettings: vi.fn(),
  getMemosSettings: vi.fn(),
  deleteMemosSettings: vi.fn(),
  MemosSettingsRequestError: class MemosSettingsRequestError extends Error {},
}));

import { MemosConnectionDialog } from "./memos-connection-dialog";
import { MemosConnectionForm } from "./memos-connection-form";

const connected = { instanceUrl: "https://memos.example.com", hasAccessToken: true };
const notConnected = { instanceUrl: null, hasAccessToken: false };

describe("MemosConnectionForm — token security + actions", () => {
  it("renders the access token as a password field that is never prefilled", () => {
    render(<MemosConnectionForm settings={connected} onSettingsChange={vi.fn()} />);

    const token = screen.getByLabelText("Access token");
    expect(token).toHaveAttribute("type", "password");
    expect(token).toHaveValue("");
    expect(screen.getByText(/A token is already saved\. Enter it again \(or a new one\) to save changes\./)).toBeInTheDocument();
  });

  it("offers a single connect action plus disconnect when connected", () => {
    render(<MemosConnectionForm settings={connected} onSettingsChange={vi.fn()} />);

    expect(screen.getByRole("button", { name: "Connect" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Disconnect" })).toBeInTheDocument();
    // The separate "Test connection" / "Save" buttons are merged into Connect.
    expect(screen.queryByRole("button", { name: "Test connection" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Save" })).not.toBeInTheDocument();
  });

  it("hides disconnect until an instance is connected", () => {
    render(<MemosConnectionForm settings={notConnected} onSettingsChange={vi.fn()} />);
    expect(screen.queryByRole("button", { name: "Disconnect" })).not.toBeInTheDocument();
  });
});

describe("MemosConnectionDialog", () => {
  it("states that the token is stored privately with the user's account", () => {
    render(<MemosConnectionDialog open onOpenChange={vi.fn()} settings={notConnected} onSettingsChange={vi.fn()} />);
    expect(screen.getByText(/stored privately with your account/)).toBeInTheDocument();
  });
});
