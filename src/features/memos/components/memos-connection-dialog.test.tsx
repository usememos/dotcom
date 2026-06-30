import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MemosConnectionDialog } from "./memos-connection-dialog";
import { MemosConnectionForm } from "./memos-connection-form";

const noop = () => Promise.resolve();

describe("MemosConnectionForm — token security + actions", () => {
  it("renders the access token as a password field that is never prefilled", () => {
    render(<MemosConnectionForm instanceUrl="https://memos.example.com" connected onSave={noop} onDisconnect={noop} />);

    const token = screen.getByLabelText("Access token");
    expect(token).toHaveAttribute("type", "password");
    expect(token).toHaveValue("");
    expect(screen.getByText(/A token is already saved\. Enter it again \(or a new one\) to save changes\./)).toBeInTheDocument();
  });

  it("offers a single connect action plus disconnect when connected", () => {
    render(<MemosConnectionForm instanceUrl="https://memos.example.com" connected onSave={noop} onDisconnect={noop} />);

    expect(screen.getByRole("button", { name: "Connect" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Disconnect" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Test connection" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Save" })).not.toBeInTheDocument();
  });

  it("hides disconnect until an instance is connected", () => {
    render(<MemosConnectionForm instanceUrl={null} connected={false} onSave={noop} onDisconnect={noop} />);
    expect(screen.queryByRole("button", { name: "Disconnect" })).not.toBeInTheDocument();
  });
});

describe("MemosConnectionDialog", () => {
  it("states that the token is stored privately with the user's account", () => {
    render(<MemosConnectionDialog open onOpenChange={() => {}} instanceUrl={null} connected={false} onSave={noop} onDisconnect={noop} />);
    expect(screen.getByText(/stored privately with your account/)).toBeInTheDocument();
  });
});
