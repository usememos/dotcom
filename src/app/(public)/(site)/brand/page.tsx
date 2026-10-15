import { DownloadIcon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { HeroAccent } from "@/features/marketing/components/hero-accent";
import { MarketingSectionHeader } from "@/features/marketing/components/marketing-page";
import { BRAND_ASSETS_PATH, BRAND_AVATAR_PALETTES } from "@/shared/lib/brand-assets";
import { buildBreadcrumbJsonLd, buildMarketingMetadata } from "@/shared/lib/seo";
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
  { title: "Standard logo", filename: "logo.svg", small: false, description: "The original mark for general use." },
  { title: "Small logo", filename: "logo-small.svg", small: true, description: "Simplified details for display at 32px or smaller." },
] as const;

const LEGACY_LOGOS = [
  { src: "/logo.png", title: "Standard logo" },
  { src: "/logo-rounded.png", title: "Rounded logo" },
  { src: "/full-logo-landscape.png", title: "Landscape logo" },
  { src: "/full-logo.png", title: "Vertical logo" },
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
          <MemosMark size={144} label={`Memos bird logo on a ${dark ? "dark" : "light"} background`} />
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
            Our logo is based on the bird pictograph for the Chinese character <span lang="zh">鸟</span>. Download the original mark or
            choose an avatar for your profile.
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
          <div className="mt-10 grid gap-6 text-sm leading-7 text-zinc-600 sm:grid-cols-2 dark:text-zinc-300">
            <p>
              Keep the shape and proportions intact, leave clear space around the mark, and choose a color that stands out against its
              background.
            </p>
            <p>
              The SVG uses <code className="text-zinc-950 dark:text-zinc-100">currentColor</code>. When embedded inline, set its color with
              CSS. Background color and corner radius are separate choices.
            </p>
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
              const src = `${BRAND_ASSETS_PATH}/avatars/memos-${palette}.png`;
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
          <h2 className="text-balance font-serif text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl dark:text-zinc-100">
            Using the brand
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-300">
            Wordmark typography, capitalization, and the primary color palette are still being explored. These avatar palettes are available
            options, not a final brand color system.
          </p>
          <a
            href="https://github.com/usememos/.github/blob/main/BRAND.md"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex min-h-10 items-center rounded-lg text-sm font-semibold text-brand-700 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600 dark:text-brand-300"
          >
            Read the brand guidelines
          </a>
          <details className="mt-10 max-w-2xl">
            <summary className="w-fit cursor-pointer rounded-lg py-2 text-sm font-semibold text-zinc-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600 dark:text-zinc-300">
              Legacy assets
            </summary>
            <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
              Previous logos remain available for existing references. Use the bird mark above for new work.
            </p>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {LEGACY_LOGOS.map((logo) => (
                <li key={logo.src}>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300">{logo.title}</p>
                  <DownloadLink href={logo.src} name={`Legacy ${logo.title.toLowerCase()}`} format="PNG" />
                </li>
              ))}
            </ul>
          </details>
        </div>
      </section>
    </main>
  );
}
