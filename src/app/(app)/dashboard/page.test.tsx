import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/dashboard/components/dashboard", () => ({
  Dashboard: () => <div data-testid="dashboard" />,
}));

import DashboardPage, { dynamic, metadata, revalidate } from "./page";

describe("DashboardPage", () => {
  it("renders the Dashboard feature component", () => {
    render(<DashboardPage />);
    expect(screen.getByTestId("dashboard")).toBeInTheDocument();
  });

  it("exports a non-revalidating static shell and a title", () => {
    expect(dynamic).toBe("force-static");
    expect(revalidate).toBe(false);
    expect(metadata.title).toBe("Dashboard");
  });
});
