import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/marketing/components/hero-section", () => ({
  HeroSection: ({ title, subtitle }: { title: ReactNode; subtitle: string }) => (
    <section data-testid="hero-section">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </section>
  ),
}));

vi.mock("@/features/marketing/components/home-write-section", () => ({
  HomeWriteSection: () => <section data-testid="home-write" />,
}));

vi.mock("@/features/marketing/components/home-find-section", () => ({
  HomeFindSection: () => <section data-testid="home-find" />,
}));

vi.mock("@/features/marketing/components/home-own-section", () => ({
  HomeOwnSection: () => <section data-testid="home-own" />,
}));

vi.mock("@/features/marketing/components/home-faq-section", () => ({
  HomeFaqSection: () => <section data-testid="home-faq" />,
}));

import { BRAND_DESCRIPTION, BRAND_HEADLINE } from "@/shared/lib/branding";
import HomePage from "./page";

describe("HomePage", () => {
  it("pairs the canonical headline and description in the hero", () => {
    render(<HomePage />);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1, name: BRAND_HEADLINE })).toBeVisible();
    expect(screen.getByText(BRAND_DESCRIPTION)).toBeVisible();
  });

  it("emphasizes only everyday thoughts with the shared brand accent", () => {
    render(<HomePage />);

    const heading = screen.getByRole("heading", { level: 1, name: BRAND_HEADLINE });
    const accent = screen.getByText("everyday thoughts.", { selector: "span" });
    expect(heading.textContent).toBe(BRAND_HEADLINE);
    expect(heading).toContainElement(accent);
    expect(accent).toHaveClass("text-brand-600", "dark:text-brand-300");
    expect(accent).not.toHaveClass("block", "whitespace-nowrap");
    expect(heading.querySelectorAll("span")).toHaveLength(1);
  });

  it("tells the story in brand order: write, find, own, then answers", () => {
    render(<HomePage />);

    const hero = screen.getByTestId("hero-section");
    const order = ["home-write", "home-find", "home-own", "home-faq"].map((id) => screen.getByTestId(id));
    expect(hero.nextElementSibling).toBe(order[0]);
    for (let index = 1; index < order.length; index++) {
      expect(order[index - 1].nextElementSibling).toBe(order[index]);
    }
  });

  it("ends with the FAQ without a separate reference-links section", () => {
    render(<HomePage />);

    const faq = screen.getByTestId("home-faq");
    expect(screen.getByRole("main").lastElementChild).toBe(faq);
    expect(faq.nextElementSibling).toBeNull();
    expect(screen.queryByRole("heading", { name: "Further reading" })).not.toBeInTheDocument();
    expect(document.getElementById("start")).toBeNull();
  });
});
