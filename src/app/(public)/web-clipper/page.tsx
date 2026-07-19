import { HomeLayout } from "fumadocs-ui/layouts/home";
import { CodeIcon, EyeIcon, ImageIcon, LayoutTemplateIcon, MousePointerClickIcon, PencilLineIcon } from "lucide-react";
import type { Metadata } from "next";
import type { SVGProps } from "react";
import { FeatureCard } from "@/features/marketing/components/feature-card";
import { Footer } from "@/features/marketing/components/footer";
import { HeroAccent } from "@/features/marketing/components/hero-accent";
import {
  MarketingCtaSection,
  MarketingPageHero,
  MarketingSectionHeader,
  MarketingSummaryBand,
} from "@/features/marketing/components/marketing-page";
import { baseOptions } from "@/shared/config/layout";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, buildMarketingMetadata, type FaqItem } from "@/shared/lib/seo";
import { JsonLdScript } from "@/shared/ui/json-ld-script";

const CHROME_STORE_URL = "https://chromewebstore.google.com/detail/memos-web-clipper/nebaoebnljalfegiidibihhkebeiklbl";
const FIREFOX_ADDON_URL = "https://addons.mozilla.org/en-US/firefox/addon/memos-web-clipper/";
const GITHUB_REPO_URL = "https://github.com/usememos/web-clipper";

function GithubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.29 9.4 7.86 10.92.58.1.79-.25.79-.56v-2.18c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.18c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

export const metadata: Metadata = buildMarketingMetadata({
  title: "Memos Web Clipper - Save Web Pages to Your Memos",
  description:
    "An open-source browser extension for Chrome and Firefox. Clip pages, selections, and images as Markdown directly into your self-hosted Memos instance.",
  path: "/web-clipper",
});

const breadcrumbItems = [
  { href: "/", name: "Home" },
  { href: "/web-clipper", name: "Web Clipper" },
];

const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Memos Web Clipper",
  applicationCategory: "BrowserApplication",
  operatingSystem: "Chrome, Firefox",
  description:
    "Save pages, selections, and images directly to your Memos instance. Converts clips to Markdown and works with self-hosted Memos.",
  url: "https://usememos.com/web-clipper",
  downloadUrl: [CHROME_STORE_URL, FIREFOX_ADDON_URL],
  license: "https://github.com/usememos/web-clipper/blob/main/LICENSE",
};

const SUMMARY = [
  {
    title: "Markdown-native clips",
    description: "Selections, links, lists, code, and tables are converted to clean Markdown instead of pasted HTML.",
  },
  {
    title: "Your instance, your notes",
    description: "Clips save straight to the Memos server you run, so captured pages live on your own infrastructure.",
  },
  {
    title: "Private by design",
    description: "No analytics, ads, or telemetry. The extension talks only to usememos.com and your Memos instance.",
  },
] as const;

const HOW_IT_WORKS = [
  "Install the extension from the Chrome Web Store or Firefox Add-ons, then connect your Memos instance.",
  "Open the clipper on any page to capture the title, URL, and content, or select text and images first for a focused clip.",
  "Review and edit the Markdown, pick a visibility (Private, Protected, or Public), and save it to your timeline.",
] as const;

const CLIPPER_FEATURES = [
  {
    title: "Clean Markdown conversion",
    description: "Selected text, links, lists, code blocks, and tables become readable Markdown that fits your existing notes.",
    icon: <CodeIcon className="h-5 w-5" />,
  },
  {
    title: "Image attachments",
    description: "Pick images from the page and upload them to your instance as Memos attachments alongside the clip.",
    icon: <ImageIcon className="h-5 w-5" />,
  },
  {
    title: "Edit before saving",
    description: "Every clip opens for review first, so you can trim, annotate, or tag it before it reaches your timeline.",
    icon: <PencilLineIcon className="h-5 w-5" />,
  },
  {
    title: "Visibility control",
    description: "Choose Private, Protected, or Public per clip, matching the visibility model you already use in Memos.",
    icon: <EyeIcon className="h-5 w-5" />,
  },
  {
    title: "Right-click quick save",
    description: "Save selected text or images from the context menu without opening the popup. Quick saves default to private.",
    icon: <MousePointerClickIcon className="h-5 w-5" />,
  },
  {
    title: "Custom clip templates",
    description: "Control how clips are formatted with templates stored locally in your browser, not on a server.",
    icon: <LayoutTemplateIcon className="h-5 w-5" />,
  },
] as const;

const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "Which browsers does the Memos Web Clipper support?",
    answer:
      "The extension is available for Google Chrome via the Chrome Web Store and for Mozilla Firefox (version 142 or later) via Firefox Add-ons.",
  },
  {
    question: "Does the web clipper work with self-hosted Memos?",
    answer:
      "Yes. The clipper is built for self-hosted Memos and saves clips directly to your own instance. It requires Memos 0.26.0 or later.",
  },
  {
    question: "Is the Memos Web Clipper open source?",
    answer:
      "Yes. Like Memos itself, the web clipper is open source. The code is available on GitHub for review, issues, and contributions.",
  },
  {
    question: "Why can't the clipper capture some pages?",
    answer:
      "Browsers block extensions from reading browser-owned pages such as internal settings screens and some store pages. On those pages the clipper falls back to saving the title and URL.",
  },
] as const;

const faqJsonLd = buildFaqJsonLd(FAQ_ITEMS);

export default function WebClipperPage() {
  return (
    <HomeLayout {...baseOptions}>
      <main className="flex flex-1 flex-col bg-white dark:bg-zinc-950">
        <JsonLdScript data={breadcrumbJsonLd} />
        <JsonLdScript data={softwareJsonLd} />
        <JsonLdScript data={faqJsonLd} />

        <MarketingPageHero
          eyebrow="Browser Extension"
          title={
            <>
              Clip the web into <HeroAccent>your Memos.</HeroAccent>
            </>
          }
          description="Save pages, selections, and images from any website straight to your self-hosted Memos instance — converted to clean Markdown, reviewed before saving, with no telemetry."
          actions={[
            { label: "Add to Chrome", href: CHROME_STORE_URL, showArrow: true },
            { label: "Add to Firefox", href: FIREFOX_ADDON_URL },
            { label: "View on GitHub", href: GITHUB_REPO_URL, icon: <GithubIcon className="h-4 w-4" /> },
          ]}
        />

        <MarketingSummaryBand items={SUMMARY} />

        <section className="border-b border-zinc-200 px-4 py-14 dark:border-white/10 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <MarketingSectionHeader eyebrow="How It Works" title="From page to memo in three steps." align="left" />
            <div className="border-y border-zinc-200 dark:border-white/10">
              {HOW_IT_WORKS.map((item, index) => (
                <div
                  key={item}
                  className="grid gap-4 border-b border-zinc-200 py-5 last:border-b-0 dark:border-white/10 sm:grid-cols-[4rem_minmax(0,1fr)]"
                >
                  <p className="text-xs font-semibold tracking-[0.18em] text-zinc-400">{String(index + 1).padStart(2, "0")}</p>
                  <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-base">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-zinc-200 px-4 py-14 dark:border-white/10 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <MarketingSectionHeader
              eyebrow="Features"
              title="Everything a clipper needs. Nothing it doesn't."
              description="The clipper stays focused on capture: grab what matters on a page, shape it into Markdown, and file it in your timeline."
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {CLIPPER_FEATURES.map((feature) => (
                <FeatureCard key={feature.title} icon={feature.icon} title={feature.title} description={feature.description} />
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-zinc-200 px-4 py-14 dark:border-white/10 sm:px-6 lg:py-20">
          <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <p className="text-sm font-semibold tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">FAQ</p>
              <h2 className="mt-4 max-w-[14ch] text-balance font-serif text-3xl font-semibold tracking-[-0.03em] text-zinc-950 dark:text-zinc-100 sm:text-4xl">
                Web clipper questions.
              </h2>
              <p className="mt-4 max-w-md text-balance text-base leading-7 text-zinc-600 dark:text-zinc-300 sm:text-lg">
                Supported browsers, version requirements, and how the extension works with your instance.
              </p>
            </div>

            <dl className="divide-y divide-zinc-200 border-y border-zinc-200 dark:divide-white/10 dark:border-white/10">
              {FAQ_ITEMS.map((item) => (
                <div key={item.question} className="py-6">
                  <dt className="text-base font-semibold tracking-tight text-zinc-950 dark:text-zinc-100 sm:text-lg">{item.question}</dt>
                  <dd className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-[0.98rem]">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <MarketingCtaSection
          title="Start clipping in under a minute."
          description="Install the extension, connect your Memos instance, and the next page worth keeping is one click from your timeline."
          actions={[
            { label: "Add to Chrome", href: CHROME_STORE_URL, showArrow: true },
            { label: "Add to Firefox", href: FIREFOX_ADDON_URL, variant: "secondary" },
          ]}
        />
      </main>
      <Footer />
    </HomeLayout>
  );
}
