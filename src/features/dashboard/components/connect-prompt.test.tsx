import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ConnectPrompt } from "./connect-prompt";

describe("ConnectPrompt", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows the setup notice over blurred sample stats", () => {
    render(<ConnectPrompt onSetUp={vi.fn()} />);

    expect(screen.getByText("Set up your Memos instance")).toBeInTheDocument();
    // Sample stat tiles render behind the blur.
    expect(screen.getByText("Total memos")).toBeInTheDocument();
  });

  it("opens the connection dialog from the notice", async () => {
    const onSetUp = vi.fn();
    const user = userEvent.setup();
    render(<ConnectPrompt onSetUp={onSetUp} />);

    await user.click(screen.getByRole("button", { name: "Set up instance" }));
    expect(onSetUp).toHaveBeenCalledTimes(1);
  });
});
