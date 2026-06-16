import { describe, expect, it } from "vitest";
import { buildFaqJsonLd } from "@/shared/lib/seo";
import { HOME_FAQ_ITEMS } from "./faq";

describe("home FAQ data", () => {
  it("has non-empty, unique questions", () => {
    const questions = HOME_FAQ_ITEMS.map((item) => item.question);

    expect(questions.length).toBeGreaterThan(0);
    expect(new Set(questions).size).toBe(questions.length);
    for (const item of HOME_FAQ_ITEMS) {
      expect(item.question.trim()).not.toBe("");
      expect(item.answer.trim()).not.toBe("");
    }
  });

  it("maps to valid FAQPage JSON-LD", () => {
    const jsonLd = buildFaqJsonLd(HOME_FAQ_ITEMS);

    expect(jsonLd["@type"]).toBe("FAQPage");
    expect(jsonLd.mainEntity).toHaveLength(HOME_FAQ_ITEMS.length);
  });
});
