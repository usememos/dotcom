import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FeaturePage, { generateMetadata, generateStaticParams } from "./page";

async function renderFeature(slug: string) {
  render(await FeaturePage({ params: Promise.resolve({ slug }) }));
}

describe("FeaturePage", () => {
  it("presents an available feature as an open feature brief", async () => {
    await renderFeature("self-hosted");

    expect(screen.getByRole("heading", { level: 1, name: "Run Memos Yourself" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "What changes when you use it." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Where it earns its place." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "The implementation stays inspectable." })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /Install Memos/ })[0]).toHaveAttribute("href", "/docs/getting-started");
    expect(screen.queryByText("WIP")).not.toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: "Breadcrumb" })).not.toBeInTheDocument();
  });

  it("labels unreleased features and never presents them as available", async () => {
    await renderFeature("keyboard-shortcuts");

    expect(screen.getByText("WIP")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Work in progress" })).toBeInTheDocument();
    expect(screen.getByText(/not presented as complete in current Memos releases/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "What this feature is intended to change." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "The implementation direction." })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /Follow development/ })[0]).toHaveAttribute("href", "https://github.com/usememos/memos");
    expect(screen.queryByRole("link", { name: /Install Memos/ })).not.toBeInTheDocument();
  });

  it("marks WIP pages in metadata and statically generates every feature", async () => {
    const availableMetadata = await generateMetadata({ params: Promise.resolve({ slug: "self-hosted" }) });
    const wipMetadata = await generateMetadata({ params: Promise.resolve({ slug: "import" }) });
    const staticParams = await generateStaticParams();

    expect(availableMetadata.title).toBe("Self-Hosted Feature");
    expect(wipMetadata.title).toBe("Import Feature (WIP)");
    expect(wipMetadata.description).toMatch(/^Work in progress:/);
    expect(staticParams).toHaveLength(27);
  });
});
