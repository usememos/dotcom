import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { OverviewHeader } from "./overview-header";

describe("OverviewHeader", () => {
  it("keeps the page title and connection status focused on overview context", () => {
    render(<OverviewHeader secondary="memos.example.com · v1" />);

    expect(screen.getByRole("heading", { name: "Overview" })).toBeInTheDocument();
    expect(screen.getByText("memos.example.com · v1")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Account menu" })).not.toBeInTheDocument();
  });
});
