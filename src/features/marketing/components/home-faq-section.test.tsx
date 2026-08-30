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
  it("keeps every visible answer in sync with the FAQPage JSON-LD", () => {
    const { container } = render(<HomeFaqSection />);
    const scripts = container.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]');
    const rows = Array.from(container.querySelectorAll<HTMLElement>("#faq dl > div"));

    expect(scripts).toHaveLength(1);
    expect(rows).toHaveLength(HOME_FAQ_ITEMS.length);

    const renderedItems = rows.map((row) => {
      const question = row.querySelector("dt");
      const answer = row.querySelector("dd");

      expect(question).toBeVisible();
      expect(answer).toBeVisible();

      return {
        question: question?.textContent?.trim(),
        answer: answer?.textContent?.trim(),
      };
    });
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
