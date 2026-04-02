import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/hero-section";
import { HomeCtaSection } from "@/components/home-cta-section";
import { HomeDeploySection } from "@/components/home-deploy-section";
import { HomeDiscoverSection } from "@/components/home-discover-section";
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
    <main className="flex flex-1 flex-col bg-[linear-gradient(180deg,rgba(248,244,237,0.92)_0%,rgba(246,240,231,0.75)_18%,rgba(250,248,243,0.82)_44%,rgba(244,238,229,0.92)_100%)] dark:bg-[linear-gradient(180deg,rgba(29,25,22,0.96)_0%,rgba(34,29,25,0.94)_48%,rgba(27,23,20,0.98)_100%)]">
      <HeroSection
        titleLines={[
          "Capture freely.",
          <span key="own" className="text-fd-primary">
            Own completely.
          </span>,
        ]}
        subtitle="A private timeline for your thoughts. Self-hosted, Markdown-native, and built to stay out of your way."
        primaryCta={{ text: "Get Started", href: "/docs/getting-started" }}
        secondaryCta={{ text: "Live Demo", href: "https://demo.usememos.com/", external: true }}
      />
      <HomeDiscoverSection />
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
