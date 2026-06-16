import {
  BookOpenIcon,
  CodeIcon,
  DollarSignIcon,
  ExternalLinkIcon,
  FileTextIcon,
  GitCompareIcon,
  HeartIcon,
  HistoryIcon,
  LightbulbIcon,
  MessageCircleIcon,
  NewspaperIcon,
  PaletteIcon,
  ScaleIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StickyNoteIcon,
} from "lucide-react";
import Link from "next/link";
import type { SVGProps } from "react";
import { FEATURES } from "@/features/marketing/data/features";

function GithubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.29 9.4 7.86 10.92.58.1.79-.25.79-.56v-2.18c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.18c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

function TwitterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.9 2.5h3.32l-7.25 8.29 8.53 10.71h-6.68l-5.23-6.53-5.98 6.53H2.28l7.76-8.87L1.86 2.5h6.85l4.73 5.96L18.9 2.5Zm-1.16 17.12h1.84L7.71 4.28H5.74l12 15.34Z" />
    </svg>
  );
}

interface FooterProps {
  compact?: boolean;
}

const COMPACT_LINKS: Array<{ href: string; label: string; external?: boolean }> = [
  { href: "/docs", label: "Docs" },
  { href: "/scratchpad", label: "Scratchpad" },
  { href: "/features", label: "Features" },
  { href: "/changelog", label: "Changelog" },
  { href: "/blog", label: "Blog" },
  { href: "https://github.com/usememos/memos", label: "GitHub", external: true },
];

export function Footer({ compact = false }: FooterProps = {}) {
  // Select key features to display in footer (top features from each category)
  const footerFeatures = [
    { slug: "self-hosted", feature: FEATURES["self-hosted"] },
    { slug: "open-source", feature: FEATURES["open-source"] },
    { slug: "markdown-support", feature: FEATURES["markdown-support"] },
    { slug: "api-first", feature: FEATURES["api-first"] },
  ];

  if (compact) {
    return (
      <footer className="mt-auto border-t border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-950">
        <div className="mx-auto grid w-full max-w-5xl gap-8 px-6 py-12 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start lg:px-8">
          <div>
            <p className="text-sm font-semibold tracking-[0.18em] text-zinc-950 uppercase dark:text-zinc-100">Memos</p>
            <p className="mt-3 max-w-md text-sm leading-7 text-zinc-600 dark:text-zinc-400">
              Capture quick notes in a private timeline you run yourself.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-medium text-zinc-600 dark:text-zinc-300" aria-label="Footer">
            {COMPACT_LINKS.map((link) =>
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-zinc-950 dark:hover:text-zinc-100"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={false}
                  className="transition-colors hover:text-zinc-950 dark:hover:text-zinc-100"
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>
        </div>
      </footer>
    );
  }

  return (
    <footer className="mt-auto border-t border-zinc-200 bg-transparent dark:border-white/10">
      <div className="mx-auto w-full max-w-(--fd-layout-width) px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:gap-16">
          {/* Explore Column */}
          <div className="col-span-1">
            <h3 className="font-semibold text-fd-foreground mb-6 text-sm uppercase tracking-wider">Explore</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  href="/docs"
                  prefetch={false}
                  className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  <BookOpenIcon className="w-4 h-4" />
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/scratchpad"
                  prefetch={false}
                  className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  <StickyNoteIcon className="w-4 h-4" />
                  Scratchpad
                </Link>
              </li>
              <li>
                <Link
                  href="/changelog"
                  prefetch={false}
                  className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  <HistoryIcon className="w-4 h-4" />
                  Changelog
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  prefetch={false}
                  className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  <DollarSignIcon className="w-4 h-4" />
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/use-cases"
                  prefetch={false}
                  className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  <LightbulbIcon className="w-4 h-4" />
                  Use Cases
                </Link>
              </li>
              <li>
                <Link
                  href="/compare"
                  prefetch={false}
                  className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  <GitCompareIcon className="w-4 h-4" />
                  Compare
                </Link>
              </li>
            </ul>
          </div>

          {/* Features Column */}
          <div className="col-span-1">
            <h3 className="font-semibold text-fd-foreground mb-6 text-sm uppercase tracking-wider">Features</h3>
            <ul className="space-y-4 text-sm">
              {footerFeatures.map(({ slug, feature }) => {
                const Icon = feature.icon;
                return (
                  <li key={slug}>
                    <Link
                      href={`/features/${slug}`}
                      prefetch={false}
                      className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
                    >
                      <Icon className="w-4 h-4" />
                      {feature.title}
                    </Link>
                  </li>
                );
              })}
              <li>
                <Link
                  href="/features"
                  prefetch={false}
                  className="inline-flex items-center gap-2 text-fd-muted-foreground font-medium transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  <SparklesIcon className="w-4 h-4" />
                  View all features
                </Link>
              </li>
            </ul>
          </div>

          {/* Community Column */}
          <div className="col-span-1">
            <h3 className="font-semibold text-fd-foreground mb-6 text-sm uppercase tracking-wider">Community</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  href="/docs/api"
                  prefetch={false}
                  className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  <CodeIcon className="w-4 h-4" />
                  API Reference
                </Link>
              </li>
              <li>
                <a
                  href="https://demo.usememos.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  <ExternalLinkIcon className="w-4 h-4" />
                  Live Demo
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/usememos/memos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  <GithubIcon className="w-4 h-4" />
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://discord.gg/tfPJa4UmAv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  <MessageCircleIcon className="w-4 h-4" />
                  Discord
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/usememos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  <TwitterIcon className="w-4 h-4" />X / Twitter
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="col-span-1">
            <h3 className="font-semibold text-fd-foreground mb-6 text-sm uppercase tracking-wider">Resources</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  href="/brand"
                  prefetch={false}
                  className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  <PaletteIcon className="w-4 h-4" />
                  Brand Guidelines
                </Link>
              </li>
              <li>
                <Link
                  href="/sponsors"
                  prefetch={false}
                  className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  <HeartIcon className="w-4 h-4" />
                  Sponsors
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  prefetch={false}
                  className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  <NewspaperIcon className="w-4 h-4" />
                  Blog
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/usememos/memos/blob/main/LICENSE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  <ScaleIcon className="w-4 h-4" />
                  MIT License
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/usememos/memos/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  <FileTextIcon className="w-4 h-4" />
                  Report an Issue
                </a>
              </li>
              <li>
                <Link
                  href="/privacy"
                  prefetch={false}
                  className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  <ShieldCheckIcon className="w-4 h-4" />
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
