import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  searchParams: new URLSearchParams(),
}));

vi.mock("next/navigation", () => ({
  useSearchParams: () => mocks.searchParams,
}));

vi.mock("@/features/memos/components/memos-connections-settings", () => ({
  MemosConnectionsSettings: ({ source }: { source: string | null }) => <div data-testid="settings-source">{source ?? "direct"}</div>,
}));

import { ConnectionsSettingsClient } from "./connections-settings-client";

describe("ConnectionsSettingsClient", () => {
  beforeEach(() => {
    mocks.searchParams = new URLSearchParams();
  });

  it("recognizes the Web Clipper source", () => {
    mocks.searchParams = new URLSearchParams("source=web-clipper");
    render(<ConnectionsSettingsClient />);
    expect(screen.getByTestId("settings-source")).toHaveTextContent("web-clipper");
  });

  it("ignores unknown and repeated source values", () => {
    mocks.searchParams = new URLSearchParams("source=web-clipper&source=other");
    const view = render(<ConnectionsSettingsClient />);
    expect(screen.getByTestId("settings-source")).toHaveTextContent("direct");

    mocks.searchParams = new URLSearchParams("source=other");
    view.rerender(<ConnectionsSettingsClient />);
    expect(screen.getByTestId("settings-source")).toHaveTextContent("direct");
  });
});
