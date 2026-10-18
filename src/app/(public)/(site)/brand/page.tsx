import { DownloadIcon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { HeroAccent } from "@/features/marketing/components/hero-accent";
import { MarketingSectionHeader } from "@/features/marketing/components/marketing-page";
import { BRAND_ASSETS_PATH, BRAND_AVATAR_PALETTES } from "@/shared/lib/brand-assets";
import { buildBreadcrumbJsonLd, buildMarketingMetadata } from "@/shared/lib/seo";
import { MemosLockup } from "@/shared/ui/memos-lockup";
import { MemosMark } from "@/shared/ui/memos-mark";

export const metadata: Metadata = buildMarketingMetadata({
  title: "Brand",
  description: "Official brand assets, logos, and usage guidelines for Memos.",
  path: "/brand",
});

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { href: "/", name: "Home" },
  { href: "/brand", name: "Brand" },
]);

const LOGOS = [
  { title: "Standard logo", filename: "mark.svg", small: false, description: "Standard logo for general use." },
  { title: "Small logo", filename: "mark-small.svg", small: true, description: "Simplified version for display at 32px or smaller." },
] as const;

function DownloadLink({ href, name, format }: { href: string; name: string; format: "SVG" | "PNG" }) {
  return (
    <a
      href={href}
      download
      aria-label={`Download ${format} — ${name}`}
      className="inline-flex min-h-10 items-center gap-2 rounded-lg text-sm font-semibold text-brand-700 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600 dark:text-brand-300"
    >
      <DownloadIcon className="size-4 shrink-0" aria-hidden="true" />
      Download {format}
    </a>
  );
}

function MarkPreview({ small = false, dark = false }: { small?: boolean; dark?: boolean }) {
  return (
    <div
      className={`flex min-h-52 min-w-0 flex-col items-center justify-center gap-4 px-3 py-6 ${dark ? "bg-zinc-950 text-zinc-100" : "bg-stone-50 text-zinc-950"}`}
    >
      <div className="flex h-36 items-center justify-center gap-3 sm:gap-5">
        {small ? (
          [16, 24, 32].map((size) => (
            <div key={size} className="flex flex-col items-center gap-3">
              <div className="flex h-8 items-center">
                <MemosMark size={size} />
              </div>
              <span className={`text-[10px] ${dark ? "text-zinc-400" : "text-zinc-500"}`}>{size}px</span>
            </div>
          ))
        ) : (
          <MemosMark size={144} label="Memos" />
        )}
      </div>
      <span className={`text-xs ${dark ? "text-zinc-400" : "text-zinc-500"}`}>{dark ? "Dark background" : "Light background"}</span>
    </div>
  );
}

export default function BrandPage() {
  return (
    <main className="flex flex-1 flex-col bg-white dark:bg-zinc-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <section className="py-14 lg:py-20">
        <div className="site-container">
          <p className="text-xs font-semibold tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">Brand</p>
          <h1 className="mt-5 text-balance font-serif text-5xl leading-[1.04] font-semibold tracking-[-0.035em] text-zinc-950 sm:text-6xl lg:text-7xl dark:text-zinc-100">
            Memos <HeroAccent>brand assets.</HeroAccent>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg sm:leading-8 dark:text-zinc-300">
            Official marks, wordmarks, avatars, and product previews for Memos.
          </p>
          <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-8">
            {LOGOS.map((logo) => (
              <div key={logo.filename}>
                <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/10">
                  <MarkPreview small={logo.small} />
                  <MarkPreview small={logo.small} dark />
                </div>
                <div className="mt-5 flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                  <div>
                    <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-100">{logo.title}</h2>
                    <p className="mt-1 text-sm leading-7 text-zinc-600 dark:text-zinc-400">{logo.description}</p>
                  </div>
                  <DownloadLink href={`${BRAND_ASSETS_PATH}/${logo.filename}`} name={logo.title} format="SVG" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-14 lg:py-20">
        <div className="site-container">
          <MarketingSectionHeader
            eyebrow="Wordmark"
            title="The mark and the name."
            description="Official SVG lettering, with standard, small, and light artwork for dark image embeds."
            align="left"
          />
          <div className="grid gap-10">
            {[
              { title: "Standard lockup", filename: "lockup.svg", height: 85 },
              { title: "Small lockup", filename: "lockup-small.svg", height: 34 },
              { title: "Lockup on dark", filename: "lockup-on-dark.svg", height: 85 },
            ].map((lockup) => (
              <div key={lockup.filename}>
                <div
                  className={`grid overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/10 ${lockup.filename === "lockup-on-dark.svg" ? "" : "sm:grid-cols-2"}`}
                >
                  {(lockup.filename === "lockup-on-dark.svg" ? [true] : [false, true]).map((dark) => (
                    <div
                      key={String(dark)}
                      className={`flex min-h-40 min-w-0 items-center justify-center px-4 py-8 ${dark ? "bg-zinc-950 text-zinc-100" : "bg-stone-50 text-zinc-950"}`}
                    >
                      <MemosLockup height={lockup.height} className="max-w-full h-auto" />
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-zinc-950 dark:text-zinc-100">{lockup.title}</h3>
                  <DownloadLink href={`${BRAND_ASSETS_PATH}/${lockup.filename}`} name={lockup.title} format="SVG" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-stone-50/70 py-14 lg:py-20 dark:bg-zinc-900/35">
        <div className="site-container">
          <MarketingSectionHeader
            eyebrow="Avatars"
            title="One mark, eight palettes."
            description="Each download is a 512 × 512 PNG with a solid background and a square canvas. Your platform handles the crop."
            align="left"
          />
          <ul className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-4 sm:gap-x-8" aria-label="Avatar downloads">
            {BRAND_AVATAR_PALETTES.map((palette) => {
              const name = palette[0].toUpperCase() + palette.slice(1);
              const src = `${BRAND_ASSETS_PATH}/avatars/${palette}.png`;
              return (
                <li key={palette}>
                  <Image src={src} alt={`Memos ${name} avatar`} width={512} height={512} className="aspect-square h-auto w-full" />
                  <h3 className="mt-4 text-sm font-semibold text-zinc-950 dark:text-zinc-100">{name}</h3>
                  <DownloadLink href={src} name={`${name} avatar`} format="PNG" />
                </li>
              );
            })}
          </ul>
        </div>
      </section>
      <section className="py-14 lg:py-20">
        <div className="site-container">
          <MarketingSectionHeader
            eyebrow="Product previews"
            title="The timeline in both themes."
            description="Matching 1448 × 1086 PNGs, exported from the shared preview sources."
            align="left"
          />
          <div className="grid gap-10 lg:grid-cols-2">
            {(["light", "dark"] as const).map((theme) => (
              <figure key={theme}>
                <Image
                  src={`${BRAND_ASSETS_PATH}/previews/timeline-${theme}.png`}
                  alt={`The Memos timeline with a composer and recent memos in ${theme} mode`}
                  width={1448}
                  height={1086}
                  className="h-auto w-full"
                />
                <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-zinc-950 dark:text-zinc-100">
                    {theme === "light" ? "Light preview" : "Dark preview"}
                  </h3>
                  <DownloadLink
                    href={`${BRAND_ASSETS_PATH}/previews/timeline-${theme}.png`}
                    name={`${theme === "light" ? "Light" : "Dark"} preview`}
                    format="PNG"
                  />
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
      <section className="py-14 lg:py-20">
        <div className="site-container">
          <h2 className="text-balance font-serif text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl dark:text-zinc-100">
            Using the brand
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-300">
            Positioning, approved copy, and asset usage are maintained in the shared brand document.
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-300">
            The SVG wordmark uses Source Serif 4 Semibold, licensed under the{" "}
            <a
              href="/brand/OFL-SourceSerif4.txt"
              className="rounded-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              SIL Open Font License 1.1
            </a>
            .
          </p>
          <a
            href="https://github.com/usememos/.github/blob/main/BRAND.md"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex min-h-10 items-center rounded-sm text-sm font-medium text-brand-700 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600 dark:text-brand-300"
          >
            Brand guidance
          </a>
        </div>
      </section>
    </main>
  );
}
