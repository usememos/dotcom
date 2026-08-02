import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { USE_CASE_SLUGS } from "@/features/marketing/data/use-cases";
import UseCasesPage, { metadata } from "./page";

describe("UseCasesPage", () => {
  it("organizes every use case by the visitor's context", () => {
    render(<UseCasesPage />);

    expect(screen.getByRole("heading", { level: 1, name: "Use Memos where quick notes actually happen." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Think, learn, and make." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Keep a small shared record." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Document systems and sensitive work." })).toBeInTheDocument();

    const detailLinks = screen.getAllByRole("link").filter((link) => link.getAttribute("href")?.startsWith("/use-cases/"));
    expect(detailLinks).toHaveLength(USE_CASE_SLUGS.length);
  });

  it("keeps search metadata focused on real workflows", () => {
    expect(metadata.title).toBe("Use Cases");
    expect(metadata.description).toContain("quick notes");
    expect(metadata.alternates?.canonical).toBe("https://usememos.com/use-cases");
  });
});
