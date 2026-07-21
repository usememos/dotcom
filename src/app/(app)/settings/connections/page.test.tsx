import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/memos/components/memos-connections-settings", () => ({
  MemosConnectionsSettings: ({ source }: { source: string | null }) => <div data-testid="settings-source">{source ?? "direct"}</div>,
}));

import ConnectionsPage, { dynamic, metadata } from "./page";

describe("ConnectionsPage", () => {
  it("recognizes only the Web Clipper source", async () => {
    render(await ConnectionsPage({ searchParams: Promise.resolve({ source: "web-clipper" }) }));
    expect(screen.getByTestId("settings-source")).toHaveTextContent("web-clipper");
  });

  it("ignores unknown and repeated source values", async () => {
    render(await ConnectionsPage({ searchParams: Promise.resolve({ source: ["web-clipper", "other"] }) }));
    expect(screen.getByTestId("settings-source")).toHaveTextContent("direct");
  });

  it("is dynamic and noindex through the authenticated app layout", () => {
    expect(dynamic).toBe("force-dynamic");
    expect(metadata.title).toBe("Memos Instance – Settings");
  });
});
