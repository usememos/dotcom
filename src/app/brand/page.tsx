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
          <div className="mx-auto max-w-5xl">
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

        <section className="border-b border-zinc-200 px-4 py-14 dark:border-white/10 sm:px-6 lg:py-20">
          <div className="mx-auto grid w-full max-w-(--fd-layout-width) gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">Logos</p>
              <h2 className="mt-4 text-balance font-serif text-3xl font-semibold tracking-normal text-zinc-950 dark:text-zinc-100 sm:text-4xl">
                Use the mark plainly.
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {LOGOS.map((logo) => (
                <div key={logo.src} className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-white/10 dark:bg-zinc-950">
                  <div className="flex h-24 items-center justify-center">
                    <Image src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} className="max-h-full max-w-full" />
                  </div>
                  <div className="mt-5 flex items-center justify-between gap-4 rounded-lg bg-zinc-50 px-3 py-2 dark:bg-white/5">
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

        <section className="px-4 py-14 sm:px-6 lg:py-20">
          <div className="mx-auto grid w-full max-w-(--fd-layout-width) gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">Usage</p>
              <h2 className="mt-4 text-balance font-serif text-3xl font-semibold tracking-normal text-zinc-950 dark:text-zinc-100 sm:text-4xl">
                Keep it simple.
              </h2>
            </div>
            <div className="grid gap-2">
              {GUIDELINES.map((guideline) => (
                <p
                  key={guideline}
                  className="rounded-lg bg-zinc-50 px-4 py-3 text-sm leading-7 text-zinc-600 dark:bg-white/5 dark:text-zinc-300 sm:text-base"
                >
                  {guideline}
                </p>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </HomeLayout>
  );
}
