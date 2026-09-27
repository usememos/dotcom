import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { BRAND_DESCRIPTION, BRAND_TAGLINE } from "@/shared/lib/branding";

vi.mock("@/features/marketing/components/hero-section", () => ({
  HeroSection: ({ title, subtitle }: { title: ReactNode; subtitle: string }) => (
    <section data-testid="hero-section">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </section>
  ),
}));

vi.mock("@/features/marketing/components/home-deploy-section", () => ({
  HomeDeploySection: () => <section data-testid="home-deploy" />,
}));

vi.mock("@/features/marketing/components/home-discover-section", () => ({
  HomeDiscoverSection: () => <section data-testid="home-discover" />,
}));

vi.mock("@/features/marketing/components/home-faq-section", () => ({
  HomeFaqSection: () => <section data-testid="home-faq" />,
}));

vi.mock("@/features/marketing/components/home-features-section", () => ({
  HomeFeaturesSection: () => <section data-testid="home-features" />,
}));

vi.mock("@/features/marketing/components/home-use-cases-section", () => ({
  HomeUseCasesSection: () => <section data-testid="home-use-cases" />,
}));

import HomePage from "./page";

describe("HomePage", () => {
  it("preserves the approved brand introduction as one accessible heading", () => {
    render(<HomePage />);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1, name: BRAND_TAGLINE })).toBeVisible();
    expect(screen.getByText(BRAND_DESCRIPTION)).toBeVisible();
  });

  it("follows the FAQ with the final start CTA", () => {
    render(<HomePage />);

    const faq = screen.getByTestId("home-faq");
    const start = document.getElementById("start");

    expect(start).not.toBeNull();
    expect(faq.nextElementSibling).toBe(start);
  });
});
