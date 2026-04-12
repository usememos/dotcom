import { HomeLayout } from "fumadocs-ui/layouts/home";
import { DownloadIcon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { baseOptions } from "@/app/layout.config";
import { Footer } from "@/components/footer";
import { MarketingPageHero, MarketingSectionHeader, MarketingSummaryBand } from "@/components/marketing-page";
import { buildBreadcrumbJsonLd, buildMarketingMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMarketingMetadata({
  title: "Brand",
  description: "Official Memos brand assets, logos, and usage guidelines for the open-source note-taking tool built for instant capture.",
  path: "/brand",
});

const breadcrumbItems = [
  { href: "/", name: "Home" },
  { href: "/brand", name: "Brand" },
];

const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

const LOGOS = [
  { src: "/logo.png", alt: "Memos logo", title: "Standard Logo", width: 96, height: 96 },
  { src: "/logo-rounded.png", alt: "Memos rounded logo", title: "Rounded Logo", width: 96, height: 96 },
  { src: "/full-logo-landscape.png", alt: "Memos landscape logo", title: "Landscape Logo", width: 300, height: 96 },
  { src: "/full-logo.png", alt: "Memos vertical logo", title: "Vertical Logo", width: 89, height: 96 },
] as const;

const GUIDELINES = [
  "Use the logo with clear spacing and calm backgrounds.",
  "Keep the aspect ratio intact when resizing.",
  "Use the logo to link back to the Memos website when possible.",
] as const;

export default function BrandPage() {
  return (
    <HomeLayout {...baseOptions}>
      <main className="flex flex-1 flex-col bg-white dark:bg-zinc-950">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

        <MarketingPageHero
          breadcrumbs={breadcrumbItems}
          eyebrow="Brand"
          title="Memos brand assets."
          description="Download official logos and use them with clear, consistent presentation."
        />

        <MarketingSummaryBand items={GUIDELINES.map((description) => ({ description }))} numbered />

        <section className="border-b border-zinc-200 px-4 py-14 dark:border-white/10 sm:px-6 lg:py-20">
          <div className="mx-auto w-full max-w-6xl">
            <MarketingSectionHeader eyebrow="Logos" title="Use the mark plainly." align="left" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {LOGOS.map((logo) => (
                <div key={logo.src} className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-white/10 dark:bg-zinc-950">
                  <div className="flex h-24 items-center justify-center">
                    <Image src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} className="max-h-full max-w-full" />
                  </div>
                  <div className="mt-5 flex items-center justify-between gap-4 border-t border-zinc-200 pt-4 dark:border-white/10">
                    <p className="font-semibold text-zinc-950 dark:text-zinc-100">{logo.title}</p>
                    <a
                      href={logo.src}
                      download
                      className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 transition-colors hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-100"
                    >
                      <DownloadIcon className="h-4 w-4" />
                      PNG
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </HomeLayout>
  );
}
