import { HomeLayout } from "fumadocs-ui/layouts/home";
import { DownloadIcon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { baseOptions } from "@/app/layout.config";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Footer } from "@/components/footer";
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

        <section className="border-b border-zinc-200 px-4 py-14 dark:border-white/10 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <Breadcrumbs items={breadcrumbItems} className="mb-10" />
            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-5 text-sm font-semibold tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">Brand</p>
              <h1 className="text-balance font-serif text-5xl font-semibold leading-[1.04] tracking-normal text-zinc-950 dark:text-zinc-50 sm:text-6xl lg:text-7xl">
                Memos brand assets.
              </h1>
              <p className="mx-auto mt-7 max-w-2xl text-balance text-base leading-8 text-zinc-600 dark:text-zinc-300 sm:text-lg">
                Download official logos and use them with clear, consistent presentation.
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-zinc-200 px-4 dark:border-white/10 sm:px-6">
          <div className="mx-auto grid max-w-6xl divide-y divide-zinc-200 dark:divide-white/10 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
            {GUIDELINES.map((guideline, index) => (
              <div key={guideline} className="py-8 lg:px-8 lg:first:pl-0 lg:last:pr-0">
                <p className="text-xs font-semibold tracking-[0.18em] text-zinc-400">{String(index + 1).padStart(2, "0")}</p>
                <p className="mt-4 text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-base">{guideline}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-b border-zinc-200 px-4 py-14 dark:border-white/10 sm:px-6 lg:py-20">
          <div className="mx-auto w-full max-w-6xl">
            <div className="mb-10">
              <p className="text-sm font-semibold tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">Logos</p>
              <h2 className="mt-4 max-w-2xl text-balance font-serif text-3xl font-semibold tracking-normal text-zinc-950 dark:text-zinc-100 sm:text-4xl">
                Use the mark plainly.
              </h2>
            </div>
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
