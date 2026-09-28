import type { Metadata } from "next";
import { HeroAccent } from "@/features/marketing/components/hero-accent";
import { HeroSection } from "@/features/marketing/components/hero-section";
import { HomeFaqSection } from "@/features/marketing/components/home-faq-section";
import { HomeFindSection } from "@/features/marketing/components/home-find-section";
import { HomeOwnSection } from "@/features/marketing/components/home-own-section";
import { HomeWriteSection } from "@/features/marketing/components/home-write-section";
import { StartSection } from "@/features/marketing/components/start-section";
import { BRAND_DESCRIPTION, BRAND_TAGLINE_LINES, BRAND_TITLE } from "@/shared/lib/branding";
import { buildDefaultOpenGraphImages, DEFAULT_OG_IMAGE } from "@/shared/lib/seo";

export const metadata: Metadata = {
  title: {
    absolute: "Memos - Open-Source, Self-Hosted Note-Taking App",
  },
  description:
    "Write short memos without titles or folders in Memos, an open-source, self-hosted note-taking app. Find them later by search, tag, or date.",
  keywords: [
    "note-taking app",
    "open source note taking app",
    "self-hosted note-taking app",
    "open source self hosted note-taking tool",
    "self-hosted note-taking tool",
    "open source note taking",
    "docker notes tool",
    "private notes",
    "markdown notes",
    "memos",
    "quick capture notes",
    "self-hosted notes",
  ],
  alternates: {
    canonical: "https://usememos.com",
  },
  openGraph: {
    title: BRAND_TITLE,
    description: BRAND_DESCRIPTION,
    url: "https://usememos.com",
    siteName: "Memos",
    locale: "en_US",
    type: "website",
    images: buildDefaultOpenGraphImages(),
  },
  twitter: {
    card: "summary_large_image",
    title: BRAND_TITLE,
    description: BRAND_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col overflow-x-hidden bg-white dark:bg-zinc-950">
      <HeroSection
        title={
          <>
            <span className="block text-balance">{BRAND_TAGLINE_LINES[0]}</span>{" "}
            <span className="block text-balance">
              <HeroAccent>{BRAND_TAGLINE_LINES[1]}</HeroAccent>
            </span>
          </>
        }
        subtitle={BRAND_DESCRIPTION}
        primaryCta={{ text: "Install Memos", href: "/docs/getting-started" }}
        secondaryCta={{ text: "Try Live Demo", href: "https://demo.usememos.com/", external: true }}
      />
      <HomeWriteSection />
      <HomeFindSection />
      <HomeOwnSection />
      <HomeFaqSection />

      <StartSection />
    </main>
  );
}
