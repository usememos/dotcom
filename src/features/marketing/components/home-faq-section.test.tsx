import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HOME_FAQ_ITEMS } from "@/features/marketing/data/faq";
import { HomeFaqSection } from "./home-faq-section";

interface FaqPageJsonLd {
  "@type": string;
  mainEntity: Array<{
    name: string;
    acceptedAnswer: {
      text: string;
    };
  }>;
}

describe("HomeFaqSection", () => {
  it("keeps every answer in sync with the FAQPage JSON-LD, one open at a time", () => {
    const { container } = render(<HomeFaqSection />);
    const scripts = container.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]');
    const rows = Array.from(container.querySelectorAll<HTMLDetailsElement>("#faq details"));

    expect(scripts).toHaveLength(1);
    expect(rows).toHaveLength(HOME_FAQ_ITEMS.length);
    // A shared name makes the native accordion exclusive; the first answer starts open.
    expect(new Set(rows.map((row) => row.getAttribute("name"))).size).toBe(1);
    expect(rows.map((row) => row.open)).toEqual(HOME_FAQ_ITEMS.map((_, index) => index === 0));

    // Closed answers stay in the DOM, so Find in page and search engines still read them.
    const renderedItems = rows.map((row) => ({
      question: row.querySelector("summary")?.textContent?.trim(),
      answer: row.querySelector("p")?.textContent?.trim(),
    }));
    const jsonLd = JSON.parse(scripts[0]?.textContent ?? "{}") as FaqPageJsonLd;
    const structuredItems = jsonLd.mainEntity.map((item) => ({
      question: item.name,
      answer: item.acceptedAnswer.text,
    }));

    expect(jsonLd["@type"]).toBe("FAQPage");
    expect(renderedItems).toEqual(HOME_FAQ_ITEMS);
    expect(structuredItems).toEqual(renderedItems);
  });
});
