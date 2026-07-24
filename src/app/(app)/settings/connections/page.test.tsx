import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/memos/components/memos-connections-settings", () => ({
  MemosConnectionsSettings: ({ source }: { source: string | null }) => <div data-testid="settings-source">{source ?? "direct"}</div>,
}));

vi.mock("./connections-settings-client", () => ({
  ConnectionsSettingsClient: () => <div data-testid="settings-client" />,
}));

import ConnectionsPage, { dynamic, metadata, revalidate } from "./page";

describe("ConnectionsPage", () => {
  it("renders the client query adapter", () => {
    render(<ConnectionsPage />);
    expect(screen.getByTestId("settings-client")).toBeInTheDocument();
  });

  it("exports a non-revalidating static shell and a title", () => {
    expect(dynamic).toBe("force-static");
    expect(revalidate).toBe(false);
    expect(metadata.title).toBe("Memos Instance – Settings");
  });
});
