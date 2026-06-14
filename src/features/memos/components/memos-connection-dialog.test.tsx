import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/shared/settings/memos-settings-client", () => ({
  saveMemosSettings: vi.fn(),
  testMemosConnection: vi.fn(),
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

  it("offers test, save, and disconnect actions when connected", () => {
    render(<MemosConnectionForm settings={connected} onSettingsChange={vi.fn()} />);

    expect(screen.getByRole("button", { name: "Test connection" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Disconnect" })).toBeInTheDocument();
  });

  it("hides disconnect until an instance is connected", () => {
    render(<MemosConnectionForm settings={notConnected} onSettingsChange={vi.fn()} />);
    expect(screen.queryByRole("button", { name: "Disconnect" })).not.toBeInTheDocument();
  });
});

describe("MemosConnectionDialog", () => {
  it("states that the token is stored server-side, not in the browser", () => {
    render(<MemosConnectionDialog open onOpenChange={vi.fn()} settings={notConnected} onSettingsChange={vi.fn()} />);
    expect(screen.getByText(/stored server-side and never sent to the browser/)).toBeInTheDocument();
  });
});
