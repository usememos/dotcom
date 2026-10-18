import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FEATURE_SLUGS } from "@/features/marketing/data/features";
import FeaturesPage, { metadata } from "./page";

describe("FeaturesPage", () => {
  it("organizes every feature by the visitor's purpose", () => {
    render(<FeaturesPage />);

    expect(screen.getByRole("heading", { level: 1, name: "Everything begins with a memo." })).toBeInTheDocument();

    const index = screen.getByRole("navigation", { name: "Feature groups" });
    for (const [group, id] of [
      ["Write", "capture"],
      ["Find", "review"],
      ["Sharing", "publishing"],
      ["Ownership", "ownership"],
      ["Everyday use", "operations"],
    ]) {
      expect(within(index).getByRole("link", { name: new RegExp(group) })).toHaveAttribute("href", `#${id}`);
    }

    const featureLinks = screen.getAllByRole("link").filter((link) => link.getAttribute("href")?.startsWith("/features/"));
    expect(featureLinks).toHaveLength(FEATURE_SLUGS.length);
    expect(screen.getByRole("heading", { level: 2, name: "Write without choosing a title or folder." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Your memos, wherever you choose." })).toBeInTheDocument();
  });

  it("keeps search metadata focused on the complete feature set", () => {
    render(<FeaturesPage />);

    expect(metadata.title).toBe("Features");
    expect(metadata.description).toContain("Writing, finding, and sharing");
    expect(metadata.alternates?.canonical).toBe("https://usememos.com/features");
    expect(screen.queryByRole("navigation", { name: "Breadcrumb" })).not.toBeInTheDocument();
  });
});
