import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/marketing/components/hero-section", () => ({
  HeroSection: () => <section data-testid="hero-section" />,
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

vi.mock("@/features/marketing/components/sponsors-section", () => ({
  SponsorsSection: () => <section data-testid="home-sponsors" />,
}));

import HomePage from "./page";

describe("HomePage", () => {
  it("places sponsors between the FAQ and the final start CTA", () => {
    render(<HomePage />);

    const faq = screen.getByTestId("home-faq");
    const sponsors = screen.getByTestId("home-sponsors");
    const start = document.getElementById("start");

    expect(start).not.toBeNull();
    expect(faq.nextElementSibling).toBe(sponsors);
    expect(sponsors.nextElementSibling).toBe(start);
  });
});
