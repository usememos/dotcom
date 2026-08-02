import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PricingPage, { metadata, PRICING_FAQ_ITEMS } from "./page";

function readJsonLd(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]')).map((script) =>
    JSON.parse(script.textContent ?? "{}"),
  );
}

describe("PricingPage", () => {
  it("answers the pricing question before explaining self-hosting costs", () => {
    render(<PricingPage />);

    expect(screen.getByRole("heading", { level: 1, name: "The whole product costs $0." })).toBeInTheDocument();
    expect(screen.getByText("Memos software")).toBeInTheDocument();
    expect(screen.getAllByText("$0")).toHaveLength(3);
    expect(screen.getByText("The only costs are the ones you choose.")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /Install Memos/ })[0]).toHaveAttribute("href", "/docs/getting-started");
    expect(screen.queryByRole("navigation", { name: "Breadcrumb" })).not.toBeInTheDocument();
  });

  it("publishes descriptive metadata and crawlable pricing structured data", () => {
    const { container } = render(<PricingPage />);
    const structuredData = readJsonLd(container);
    const software = structuredData.find((entry) => entry["@type"] === "SoftwareApplication");
    const faq = structuredData.find((entry) => entry["@type"] === "FAQPage");

    expect(metadata.title).toBe("Pricing: Free, Open-Source, Self-Hosted");
    expect(metadata.description).toContain("completely free");
    expect(metadata.alternates?.canonical).toBe("https://usememos.com/pricing");
    expect(software).toMatchObject({
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    });
    expect(faq?.mainEntity).toHaveLength(PRICING_FAQ_ITEMS.length);
  });
});
