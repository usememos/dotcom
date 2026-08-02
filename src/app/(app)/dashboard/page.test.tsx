import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/overview/components/overview", () => ({
  Overview: () => <div data-testid="overview" />,
}));

import OverviewPage, { dynamic, metadata, revalidate } from "./page";

describe("OverviewPage", () => {
  it("renders the Overview feature component", () => {
    render(<OverviewPage />);
    expect(screen.getByTestId("overview")).toBeInTheDocument();
  });

  it("exports a non-revalidating static shell and a title", () => {
    expect(dynamic).toBe("force-static");
    expect(revalidate).toBe(false);
    expect(metadata.title).toBe("Overview");
  });
});
