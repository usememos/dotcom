import type { Metadata } from "next";
import { HeroAccent } from "@/features/marketing/components/hero-accent";
import { HeroSection } from "@/features/marketing/components/hero-section";
import { HomeFaqSection } from "@/features/marketing/components/home-faq-section";
import { HomeFindSection } from "@/features/marketing/components/home-find-section";
import { HomeOwnSection } from "@/features/marketing/components/home-own-section";
import { HomeWriteSection } from "@/features/marketing/components/home-write-section";
import { BRAND_DESCRIPTION, BRAND_HEADLINE, BRAND_TITLE } from "@/shared/lib/branding";
import { buildDefaultOpenGraphImages, DEFAULT_OG_IMAGE } from "@/shared/lib/seo";

export const metadata: Metadata = {
  title: {
    absolute: BRAND_TITLE,
  },
  description: BRAND_DESCRIPTION,
  keywords: ["memos", "quick thoughts", "timeline", "Markdown notes", "private notes", "daily notes"],
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
  const headlineAccentStart = BRAND_HEADLINE.indexOf("everyday thoughts.");

  return (
    <main className="flex flex-1 flex-col overflow-x-hidden bg-white dark:bg-zinc-950">
      <HeroSection
        title={
          <>
            {BRAND_HEADLINE.slice(0, headlineAccentStart)}
            <HeroAccent>{BRAND_HEADLINE.slice(headlineAccentStart)}</HeroAccent>
          </>
        }
        subtitle={BRAND_DESCRIPTION}
        primaryCta={{ text: "Installation", href: "/docs/getting-started" }}
        secondaryCta={{ text: "Demo", href: "https://demo.usememos.com/", external: true }}
      />
      <HomeWriteSection />
      <HomeFindSection />
      <HomeOwnSection />
      <HomeFaqSection />
    </main>
  );
}
