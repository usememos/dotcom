import {
  BookOpenIcon,
  CodeIcon,
  DollarSignIcon,
  ExternalLinkIcon,
  FileTextIcon,
  GithubIcon,
  HeartIcon,
  HistoryIcon,
  LightbulbIcon,
  MessageCircleIcon,
  NewspaperIcon,
  PaletteIcon,
  ScaleIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TwitterIcon,
} from "lucide-react";
import Link from "next/link";
import { FEATURES } from "@/lib/features";

interface FooterProps {
  compact?: boolean;
}

const COMPACT_LINKS: Array<{ href: string; label: string; external?: boolean }> = [
  { href: "/docs", label: "Docs" },
  { href: "/blog", label: "Blog" },
  { href: "/changelog", label: "Changelog" },
  { href: "/features", label: "Features" },
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
                <Link key={link.href} href={link.href} className="transition-colors hover:text-zinc-950 dark:hover:text-zinc-100">
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
                  className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  <BookOpenIcon className="w-4 h-4" />
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  <NewspaperIcon className="w-4 h-4" />
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/changelog"
                  className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  <HistoryIcon className="w-4 h-4" />
                  Changelog
                </Link>
              </li>
              <li>
                <Link
                  href="/features"
                  className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  <SparklesIcon className="w-4 h-4" />
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  <DollarSignIcon className="w-4 h-4" />
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/use-cases"
                  className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  <LightbulbIcon className="w-4 h-4" />
                  Use Cases
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
              <li>
                <Link
                  href="/privacy"
                  className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  <ShieldCheckIcon className="w-4 h-4" />
                  Privacy Policy
                </Link>
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
                  className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  <PaletteIcon className="w-4 h-4" />
                  Brand Guidelines
                </Link>
              </li>
              <li>
                <Link
                  href="/sponsors"
                  className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  <HeartIcon className="w-4 h-4" />
                  Sponsors
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
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
