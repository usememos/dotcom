import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { USE_CASE_SLUGS, USE_CASES } from "@/features/marketing/data/use-cases";
import UseCasePage, { generateMetadata, generateStaticParams } from "./page";

async function renderUseCase(slug: string) {
  render(await UseCasePage({ params: Promise.resolve({ slug }) }));
}

describe("UseCasePage", () => {
  it("presents workflows as independent uses instead of numbered steps", async () => {
    await renderUseCase("self-hosting");

    expect(screen.getByRole("heading", { level: 1, name: "Homelab & Self-Hosting Community" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Ways it fits the day." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "The fit stays simple." })).toBeInTheDocument();
    expect(screen.queryByText("01")).not.toBeInTheDocument();

    for (const workflow of USE_CASES["self-hosting"].workflows) {
      expect(screen.getAllByText(workflow).length).toBeGreaterThan(0);
    }

    expect(screen.getByRole("link", { name: /Install Memos/ })).toHaveClass("bg-white");
  });

  it("links only to public feature details and statically generates every use case", async () => {
    await renderUseCase("personal-knowledge");
    const staticParams = await generateStaticParams();
    const pageMetadata = await generateMetadata({ params: Promise.resolve({ slug: "personal-knowledge" }) });

    expect(screen.getByRole("link", { name: /Timeline View/ })).toHaveAttribute("href", "/features/timeline-view");
    expect(staticParams).toHaveLength(USE_CASE_SLUGS.length);
    expect(pageMetadata.alternates?.canonical).toBe("https://usememos.com/use-cases/personal-knowledge");
  });
});
