import {
  BirdIcon,
  BookOpenIcon,
  CodeIcon,
  DollarSignIcon,
  ExternalLinkIcon,
  FileTextIcon,
  GithubIcon,
  HeartIcon,
  HistoryIcon,
  LockIcon,
  MessageCircleIcon,
  NewspaperIcon,
  PaletteIcon,
  ScaleIcon,
  ServerIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-fd-background mt-auto">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:gap-16">
          {/* Features Column */}
          <div className="col-span-1">
            <h3 className="font-semibold text-fd-foreground mb-6 text-sm uppercase tracking-wider">Features</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  href="/features/data-ownership"
                  className="inline-flex items-center gap-2 text-fd-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  <LockIcon className="w-4 h-4" />
                  Data Ownership
                </Link>
              </li>
              <li>
                <Link
                  href="/features/self-hosted"
                  className="inline-flex items-center gap-2 text-fd-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  <ServerIcon className="w-4 h-4" />
                  Self-Hosted
                </Link>
              </li>
              <li>
                <Link
                  href="/features/markdown-support"
                  className="inline-flex items-center gap-2 text-fd-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  <FileTextIcon className="w-4 h-4" />
                  Markdown
                </Link>
              </li>
              <li>
                <Link
                  href="/features/api-first"
                  className="inline-flex items-center gap-2 text-fd-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  <CodeIcon className="w-4 h-4" />
                  API First
                </Link>
              </li>
              <li>
                <Link
                  href="/features"
                  className="inline-flex items-center gap-2 text-fd-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 transition-colors font-medium"
                >
                  <SparklesIcon className="w-4 h-4" />
                  View all features →
                </Link>
              </li>
            </ul>
          </div>

          {/* Product Column */}
          <div className="col-span-1">
            <h3 className="font-semibold text-fd-foreground mb-6 text-sm uppercase tracking-wider">Product</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-2 text-fd-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  <BookOpenIcon className="w-4 h-4" />
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/api"
                  className="inline-flex items-center gap-2 text-fd-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  <CodeIcon className="w-4 h-4" />
                  API Reference
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-fd-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  <NewspaperIcon className="w-4 h-4" />
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/changelog"
                  className="inline-flex items-center gap-2 text-fd-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  <HistoryIcon className="w-4 h-4" />
                  Changelog
                </Link>
              </li>
              <li>
                <a
                  href="https://demo.usememos.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-fd-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  <ExternalLinkIcon className="w-4 h-4" />
                  Live Demo
                </a>
              </li>
            </ul>
          </div>

          {/* Community Column */}
          <div className="col-span-1">
            <h3 className="font-semibold text-fd-foreground mb-6 text-sm uppercase tracking-wider">Community</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <a
                  href="https://github.com/usememos/memos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-fd-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
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
                  className="inline-flex items-center gap-2 text-fd-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
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
                  className="inline-flex items-center gap-2 text-fd-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  <BirdIcon className="w-4 h-4" />X / Twitter
                </a>
              </li>
              <li>
                <Link
                  href="/sponsors"
                  className="inline-flex items-center gap-2 text-fd-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  <HeartIcon className="w-4 h-4" />
                  Sponsors
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="col-span-1">
            <h3 className="font-semibold text-fd-foreground mb-6 text-sm uppercase tracking-wider">Resources</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <a
                  href="https://github.com/usememos/memos/blob/main/LICENSE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-fd-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  <ScaleIcon className="w-4 h-4" />
                  MIT License
                </a>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="inline-flex items-center gap-2 text-fd-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  <ShieldCheckIcon className="w-4 h-4" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 text-fd-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  <DollarSignIcon className="w-4 h-4" />
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/brand"
                  className="inline-flex items-center gap-2 text-fd-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  <PaletteIcon className="w-4 h-4" />
                  Brand Guidelines
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
