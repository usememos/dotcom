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

import HomePage from "./page";

describe("HomePage", () => {
  it("renders the chosen hero title as one accessible heading with the ownership accent", () => {
    render(<HomePage />);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1, name: "Seconds to write. Yours to keep." })).toBeVisible();
    expect(screen.getByText("Yours to keep.")).toHaveClass("text-brand-600", "dark:text-brand-300");
    expect(
      screen.getByText(
        "Memos is a timeline for quick thoughts, daily notes, and things you want to remember. No title or folder to choose before you write.",
      ),
    ).toBeVisible();
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
