import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PrivacyPage, { metadata, PRIVACY_FAQ_ITEMS } from "./page";

function readJsonLd(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]')).map((script) =>
    JSON.parse(script.textContent ?? "{}"),
  );
}

describe("PrivacyPage", () => {
  it("states the privacy outcome and shows the self-hosted data path", () => {
    const { container } = render(<PrivacyPage />);

    expect(screen.getByRole("heading", { level: 1, name: "We collect nothing. Your data stays yours." })).toBeInTheDocument();
    expect(screen.getByText("Your browser")).toBeInTheDocument();
    expect(screen.getByText("Your Memos server")).toBeInTheDocument();
    expect(screen.getByText("Your database")).toBeInTheDocument();
    expect(screen.getByText("Not in the path")).toBeInTheDocument();
    expect(screen.getByText("What this policy covers.")).toBeInTheDocument();
    expect(container.querySelector("form")).not.toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: "Breadcrumb" })).not.toBeInTheDocument();
  });

  it("publishes descriptive metadata and matching privacy structured data", () => {
    const { container } = render(<PrivacyPage />);
    const structuredData = readJsonLd(container);
    const policy = structuredData.find((entry) => entry["@type"] === "WebPage");
    const faq = structuredData.find((entry) => entry["@type"] === "FAQPage");

    expect(metadata.title).toBe("Privacy Policy: No Tracking or Data Collection");
    expect(metadata.description).toContain("does not collect your information");
    expect(metadata.alternates?.canonical).toBe("https://usememos.com/privacy");
    expect(policy).toMatchObject({
      name: "Memos Privacy Policy",
      url: "https://usememos.com/privacy",
      dateModified: "2026-08-02",
    });
    expect(faq?.mainEntity).toHaveLength(PRIVACY_FAQ_ITEMS.length);
  });
});
