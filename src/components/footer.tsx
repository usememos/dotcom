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

export function Footer() {
  // Select key features to display in footer (top features from each category)
  const footerFeatures = [
    { slug: "self-hosted", feature: FEATURES["self-hosted"] },
    { slug: "open-source", feature: FEATURES["open-source"] },
    { slug: "markdown-support", feature: FEATURES["markdown-support"] },
    { slug: "api-first", feature: FEATURES["api-first"] },
  ];
  return (
    <footer className="mt-auto border-t border-stone-300/55 bg-transparent dark:border-white/8">
      <div className="mx-auto w-full max-w-(--fd-layout-width) px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:gap-16">
          {/* Explore Column */}
          <div className="col-span-1">
            <h3 className="font-semibold text-fd-foreground mb-6 text-sm uppercase tracking-wider">Explore</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-stone-700 dark:hover:text-stone-200"
                >
                  <BookOpenIcon className="w-4 h-4" />
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-stone-700 dark:hover:text-stone-200"
                >
                  <NewspaperIcon className="w-4 h-4" />
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/changelog"
                  className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-stone-700 dark:hover:text-stone-200"
                >
                  <HistoryIcon className="w-4 h-4" />
                  Changelog
                </Link>
              </li>
              <li>
                <Link
                  href="/features"
                  className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-stone-700 dark:hover:text-stone-200"
                >
                  <SparklesIcon className="w-4 h-4" />
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-stone-700 dark:hover:text-stone-200"
                >
                  <DollarSignIcon className="w-4 h-4" />
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/use-cases"
                  className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-stone-700 dark:hover:text-stone-200"
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
                      className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-stone-700 dark:hover:text-stone-200"
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
                  className="inline-flex items-center gap-2 text-fd-muted-foreground font-medium transition-colors hover:text-stone-700 dark:hover:text-stone-200"
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
                  className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-stone-700 dark:hover:text-stone-200"
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
                  className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-stone-700 dark:hover:text-stone-200"
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
                  className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-stone-700 dark:hover:text-stone-200"
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
                  className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-stone-700 dark:hover:text-stone-200"
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
                  className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-stone-700 dark:hover:text-stone-200"
                >
                  <TwitterIcon className="w-4 h-4" />X / Twitter
                </a>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-stone-700 dark:hover:text-stone-200"
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
                  className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-stone-700 dark:hover:text-stone-200"
                >
                  <PaletteIcon className="w-4 h-4" />
                  Brand Guidelines
                </Link>
              </li>
              <li>
                <Link
                  href="/sponsors"
                  className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-stone-700 dark:hover:text-stone-200"
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
                  className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-stone-700 dark:hover:text-stone-200"
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
                  className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-stone-700 dark:hover:text-stone-200"
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
