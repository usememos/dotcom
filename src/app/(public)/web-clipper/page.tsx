import { HomeLayout } from "fumadocs-ui/layouts/home";
import { ArrowRightIcon, CodeIcon, EyeIcon, ImageIcon, LanguagesIcon, LockKeyholeIcon, ServerIcon } from "lucide-react";
import type { Metadata } from "next";
import type { SVGProps } from "react";
import { Footer } from "@/features/marketing/components/footer";
import { ConnectionVisual, TemplateVisual, WebClipperHeroVisual } from "@/features/marketing/components/web-clipper-showcase";
import styles from "@/features/marketing/components/web-clipper-showcase.module.css";
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
    "An open-source browser extension for Chrome, Edge, Brave, Arc, and Firefox. Save pages, selections, and images as Markdown directly to your Memos instance.",
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
  operatingSystem: "Chromium-based browsers, Firefox",
  description:
    "Save pages, selections, and images directly to your Memos instance. Connect through usememos.com or directly with a personal access token.",
  url: "https://usememos.com/web-clipper",
  downloadUrl: [CHROME_STORE_URL, FIREFOX_ADDON_URL],
  license: "https://github.com/usememos/web-clipper/blob/main/LICENSE",
};

const CAPTURE_FEATURES = [
  {
    title: "Clean Markdown conversion",
    description: "Selected text, links, lists, code blocks, and tables become readable Markdown that fits your existing notes.",
    icon: <CodeIcon className="h-5 w-5" />,
  },
  {
    title: "Images and quick saves",
    description: "Attach images from a page, or right-click selected text and images to save them privately without opening the popup.",
    icon: <ImageIcon className="h-5 w-5" />,
  },
  {
    title: "Review every memo",
    description: "Trim, annotate, or tag the Markdown, then choose a clearly explained Private, Protected, or Public visibility.",
    icon: <EyeIcon className="h-5 w-5" />,
  },
] as const;

const LANGUAGES = ["English", "简体中文", "繁體中文", "Français", "Deutsch", "日本語", "Español"] as const;

const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "Which browsers does the Memos Web Clipper support?",
    answer:
      "The extension works with Chromium-based browsers, including Google Chrome, Microsoft Edge, Brave, and Arc. It is also available for Mozilla Firefox version 142 or later.",
  },
  {
    question: "Does the web clipper work with self-hosted Memos?",
    answer:
      "Yes. Connect through usememos.com or connect directly with your instance URL and a personal access token. Direct connections require no usememos.com account. Memos 0.26.0 or later is required.",
  },
  {
    question: "Where are my connection details and templates stored?",
    answer:
      "Direct connection details and custom clip templates stay in your browser. The extension validates your instance URL, supported Memos version, and token before saving the connection.",
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
      <main className="flex flex-1 flex-col overflow-hidden bg-white dark:bg-zinc-950">
        <JsonLdScript data={breadcrumbJsonLd} />
        <JsonLdScript data={softwareJsonLd} />
        <JsonLdScript data={faqJsonLd} />

        <section className="relative isolate border-b border-white/10 bg-[#172033] text-white">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle at 18% 14%, rgba(56,189,248,.22), transparent 30%), linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)",
              backgroundSize: "auto, 42px 42px, 42px 42px",
            }}
          />
          <div className="relative mx-auto grid min-h-[calc(100svh-4rem)] max-w-[90rem] items-center gap-14 px-4 pt-14 pb-24 sm:px-6 sm:pt-16 sm:pb-28 lg:grid-cols-[minmax(0,34rem)_minmax(0,1fr)] lg:gap-16 lg:px-10 lg:py-20 xl:px-16">
            <div className={`${styles.heroCopy} max-w-xl`}>
              <div className="mb-7 flex flex-wrap items-center gap-3">
                <span className="font-mono text-xs tracking-[0.16em] text-sky-100 uppercase">Memos Web Clipper</span>
                <span className="rounded-full border border-amber-200/30 bg-amber-200/10 px-2.5 py-1 font-mono text-[10px] font-medium text-amber-100">
                  v0.2.0
                </span>
              </div>
              <h1 className="font-serif text-5xl leading-[0.98] font-semibold tracking-[-0.035em] text-white sm:text-6xl lg:text-7xl">
                <span className="block sm:whitespace-nowrap">Keep the page.</span>
                <span className="block sm:whitespace-nowrap">Lose the tab.</span>
              </h1>
              <p className="mt-7 max-w-lg text-balance text-base leading-8 text-slate-200/85 sm:text-lg">
                Turn pages, selections, and images into clean Markdown—then save them straight to the Memos instance you control.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a
                  href={CHROME_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#172033] transition-transform hover:-translate-y-0.5 hover:bg-sky-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Add to Chrome
                  <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
                </a>
                <a
                  href={FIREFOX_ADDON_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg border border-white/25 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Add to Firefox
                </a>
              </div>
              <p className="mt-5 text-xs leading-5 text-slate-300/70">Also works with Edge, Brave, and Arc · Open source · No telemetry</p>
            </div>
            <div className="relative pb-8 lg:pb-12">
              <WebClipperHeroVisual />
            </div>
          </div>
        </section>

        <section className="border-b border-zinc-200 px-4 py-16 dark:border-white/10 sm:px-6 lg:py-24">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:items-center lg:gap-20">
            <div>
              <p className="text-sm font-semibold tracking-[0.16em] text-teal-700 uppercase dark:text-teal-300">New in v0.2.0</p>
              <h2 className="mt-4 text-balance font-serif text-4xl leading-tight font-semibold tracking-[-0.025em] text-zinc-950 dark:text-zinc-100 sm:text-5xl">
                Your server. Your way in.
              </h2>
              <p className="mt-5 text-base leading-8 text-zinc-600 dark:text-zinc-300">
                Use the guided usememos.com setup, or connect directly with an instance URL and personal access token. Both paths are
                validated before anything is saved.
              </p>
              <a
                href={`${GITHUB_REPO_URL}/blob/main/CHANGELOG.md`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 underline decoration-teal-300 underline-offset-4 hover:text-teal-900 dark:text-teal-300 dark:hover:text-teal-200"
              >
                Read the v0.2.0 changelog
                <ArrowRightIcon className="size-4" />
              </a>
            </div>
            <ConnectionVisual />
          </div>
        </section>

        <section className="border-b border-zinc-200 bg-zinc-50 px-4 py-16 dark:border-white/10 dark:bg-zinc-900/40 sm:px-6 lg:py-24">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,25rem)] lg:items-center lg:gap-20">
            <TemplateVisual />
            <div>
              <p className="text-sm font-semibold tracking-[0.16em] text-teal-700 uppercase dark:text-teal-300">Format it once</p>
              <h2 className="mt-4 text-balance font-serif text-4xl leading-tight font-semibold tracking-[-0.025em] text-zinc-950 dark:text-zinc-100 sm:text-5xl">
                Every clip, already in your shape.
              </h2>
              <p className="mt-5 text-base leading-8 text-zinc-600 dark:text-zinc-300">
                Build a reusable template from title, URL, date, and captured content. The live preview shows the final Markdown before you
                save the format locally in your browser.
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-zinc-200 px-4 py-16 dark:border-white/10 sm:px-6 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-5 border-b border-zinc-200 pb-10 dark:border-white/10 lg:grid-cols-[minmax(0,23rem)_1fr] lg:items-end lg:gap-20">
              <div>
                <p className="text-sm font-semibold tracking-[0.16em] text-teal-700 uppercase dark:text-teal-300">
                  Capture without cleanup
                </p>
                <h2 className="mt-4 text-balance font-serif text-4xl leading-tight font-semibold tracking-[-0.025em] text-zinc-950 dark:text-zinc-100 sm:text-5xl">
                  From webpage to timeline.
                </h2>
              </div>
              <p className="max-w-2xl text-base leading-8 text-zinc-600 dark:text-zinc-300 lg:justify-self-end">
                Select what matters, shape the Markdown, choose visibility, and save. The source stays attached so you can always get back
                to the full context.
              </p>
            </div>
            <div className="grid divide-y divide-zinc-200 dark:divide-white/10 md:grid-cols-3 md:divide-x md:divide-y-0">
              {CAPTURE_FEATURES.map((feature) => (
                <div key={feature.title} className="group py-8 md:px-8 md:first:pl-0 md:last:pr-0">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 transition-transform group-hover:-translate-y-1 dark:bg-teal-400/10 dark:text-teal-300">
                    {feature.icon}
                  </span>
                  <h3 className="mt-6 text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-zinc-200 bg-[#f6f2e7] px-4 py-14 dark:border-white/10 dark:bg-zinc-900 sm:px-6 lg:py-18">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,20rem)_1fr] lg:items-center lg:gap-20">
            <div>
              <LanguagesIcon className="size-6 text-teal-700 dark:text-teal-300" />
              <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">
                At home in your browser.
              </h2>
              <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">The whole extension now speaks seven languages.</p>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3 lg:grid-cols-4">
              {LANGUAGES.map((language) => (
                <div
                  key={language}
                  className="border-b border-zinc-300 pb-3 font-medium text-zinc-800 dark:border-white/15 dark:text-zinc-200"
                >
                  {language}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-zinc-200 px-4 py-14 dark:border-white/10 sm:px-6">
          <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-3 sm:divide-x sm:divide-zinc-200 dark:sm:divide-white/10">
            {[
              {
                icon: <ServerIcon className="size-5" />,
                title: "Self-hosted first",
                text: "Clips go to the Memos instance you choose.",
              },
              {
                icon: <LockKeyholeIcon className="size-5" />,
                title: "Private by design",
                text: "No analytics, ads, or telemetry in the extension.",
              },
              {
                icon: <GithubIcon className="size-5" />,
                title: "Open source",
                text: "Inspect the code, report issues, or contribute on GitHub.",
              },
            ].map((item) => (
              <div key={item.title} className="sm:px-8 sm:first:pl-0 sm:last:pr-0">
                <div className="flex items-center gap-3 text-teal-700 dark:text-teal-300">
                  {item.icon}
                  <h2 className="font-semibold text-zinc-950 dark:text-zinc-100">{item.title}</h2>
                </div>
                <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-b border-zinc-200 px-4 py-16 dark:border-white/10 sm:px-6 lg:py-24">
          <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <p className="text-sm font-semibold tracking-[0.16em] text-teal-700 uppercase dark:text-teal-300">FAQ</p>
              <h2 className="mt-4 max-w-[12ch] text-balance font-serif text-4xl font-semibold tracking-[-0.025em] text-zinc-950 dark:text-zinc-100">
                Before you start clipping.
              </h2>
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-zinc-700 hover:text-teal-700 dark:text-zinc-300 dark:hover:text-teal-300"
              >
                View source on GitHub <ArrowRightIcon className="size-4" />
              </a>
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

        <section className="relative isolate overflow-hidden bg-[#172033] px-4 py-16 text-white sm:px-6 lg:py-24">
          <div className="pointer-events-none absolute top-[-10rem] left-1/2 size-[34rem] -translate-x-1/2 rounded-full bg-sky-300/12 blur-3xl" />
          <div className="relative mx-auto max-w-4xl text-center">
            <p className="font-mono text-xs tracking-[0.16em] text-sky-200 uppercase">The next page is worth keeping</p>
            <h2 className="mx-auto mt-5 max-w-[21ch] text-balance font-serif text-4xl leading-[1.08] font-semibold tracking-[-0.03em] sm:text-5xl lg:text-6xl">
              Make it a memo before it becomes another tab.
            </h2>
            <p className="mx-auto mt-6 max-w-4xl text-base leading-8 text-slate-200/80 sm:text-lg">
              Install the extension, choose how to connect, and save your first clip in under a minute.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href={CHROME_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#172033] transition-transform hover:-translate-y-0.5 hover:bg-sky-50"
              >
                Add to Chrome <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href={FIREFOX_ADDON_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg border border-white/25 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Add to Firefox
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </HomeLayout>
  );
}
