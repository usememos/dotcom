import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/dashboard/components/dashboard", () => ({
  Dashboard: () => <div data-testid="dashboard" />,
}));

import DashboardPage, { dynamic, metadata } from "./page";

describe("DashboardPage", () => {
  it("renders the Dashboard feature component", () => {
    render(<DashboardPage />);
    expect(screen.getByTestId("dashboard")).toBeInTheDocument();
  });

  it("exports force-dynamic and a title", () => {
    expect(dynamic).toBe("force-dynamic");
    expect(metadata.title).toBe("Dashboard");
  });
});
