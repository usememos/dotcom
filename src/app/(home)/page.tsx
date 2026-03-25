import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/hero-section";
import { HomeCtaSection } from "@/components/home-cta-section";
import { HomeDeploySection } from "@/components/home-deploy-section";
import { HomeFeaturesSection } from "@/components/home-features-section";
import { HomeScratchpadSection } from "@/components/home-scratchpad-section";
import { HomeStatsSection } from "@/components/home-stats-section";
import { HomeUseCasesSection } from "@/components/home-use-cases-section";
import { SponsorsSection } from "@/components/sponsors-section";

export const metadata: Metadata = {
  description:
    "Memos is an open-source, self-hosted note-taking tool built for instant capture. Markdown-native, privacy-first, and ready in minutes.",
  keywords: [
    "open source self hosted note-taking tool",
    "self-hosted note-taking tool",
    "open source note taking",
    "docker notes tool",
    "privacy-first notes",
    "markdown notes",
    "memos",
    "quick capture notes",
    "self-hosted notes",
  ],
  alternates: {
    canonical: "https://usememos.com",
  },
  openGraph: {
    title: "Memos - Capture thoughts instantly. Own them completely.",
    description: "Open-source, self-hosted note-taking tool built for quick capture. Markdown-native, lightweight, and fully yours.",
    url: "https://usememos.com",
    siteName: "Memos",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Memos - Capture thoughts instantly. Own them completely.",
    description: "Open-source, self-hosted note-taking tool built for quick capture. Markdown-native, lightweight, and fully yours.",
  },
};

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <HeroSection
        title={
          <>
            Capture freely.
            <span className="block text-fd-primary">Own completely.</span>
          </>
        }
        subtitle="A private timeline for your thoughts. Self-hosted, Markdown-native, and built to stay out of your way."
        primaryCta={{ text: "Get Started", href: "/docs/getting-started" }}
        secondaryCta={{ text: "Live Demo", href: "https://demo.usememos.com/", external: true }}
      />
      <HomeFeaturesSection />
      <HomeUseCasesSection />
      <HomeStatsSection />
      <HomeDeploySection />
      <SponsorsSection />
      <HomeScratchpadSection />
      <HomeCtaSection />
      <Footer />
    </main>
  );
}
