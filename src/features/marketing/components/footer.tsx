import {
  BookOpenIcon,
  CodeIcon,
  DollarSignIcon,
  ExternalLinkIcon,
  FileTextIcon,
  HeartIcon,
  HistoryIcon,
  LightbulbIcon,
  MessageCircleIcon,
  NewspaperIcon,
  PaletteIcon,
  PenLineIcon,
  PuzzleIcon,
  ScaleIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "lucide-react";
import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { FEATURES } from "@/features/marketing/data/features";
import { BRAND_DESCRIPTION } from "@/shared/lib/branding";
import { GITHUB_REPO_URL } from "@/shared/lib/seo";
import { GithubIcon } from "@/shared/ui/github-icon";
import { ThemeToggle } from "@/shared/ui/theme-toggle";

function TwitterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.9 2.5h3.32l-7.25 8.29 8.53 10.71h-6.68l-5.23-6.53-5.98 6.53H2.28l7.76-8.87L1.86 2.5h6.85l4.73 5.96L18.9 2.5Zm-1.16 17.12h1.84L7.71 4.28H5.74l12 15.34Z" />
    </svg>
  );
}

function TelegramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

interface FooterProps {
  compact?: boolean;
}

const COMPACT_LINKS: Array<{ href: string; label: string; external?: boolean }> = [
  { href: "/docs", label: "Docs" },
  { href: "/web-clipper", label: "Web Clipper" },
  { href: "/editor", label: "Editor" },
  { href: "/features", label: "Features" },
  { href: "/changelog", label: "Changelog" },
  { href: "/blog", label: "Blog" },
  { href: GITHUB_REPO_URL, label: "GitHub", external: true },
];

interface FooterLink {
  href: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  external?: boolean;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

// Key features to surface in the footer (top features from each category).
const footerFeatures = [
  { slug: "self-hosted", feature: FEATURES["self-hosted"] },
  { slug: "open-source", feature: FEATURES["open-source"] },
  { slug: "markdown-support", feature: FEATURES["markdown-support"] },
  { slug: "api-first", feature: FEATURES["api-first"] },
];

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Explore",
    links: [
      { href: "/docs", label: "Documentation", icon: BookOpenIcon },
      { href: "/use-cases", label: "Use Cases", icon: LightbulbIcon },
      { href: "/pricing", label: "Pricing", icon: DollarSignIcon },
      { href: "/changelog", label: "Changelog", icon: HistoryIcon },
    ],
  },
  {
    title: "Tools",
    links: [
      { href: "/web-clipper", label: "Web Clipper", icon: PuzzleIcon },
      { href: "/editor", label: "Editor", icon: PenLineIcon },
      { href: "https://demo.usememos.com/", label: "Live Demo", icon: ExternalLinkIcon, external: true },
    ],
  },
  {
    title: "Features",
    links: [
      ...footerFeatures.map(({ slug, feature }) => ({
        href: `/features/${slug}`,
        label: feature.title,
        icon: feature.icon,
      })),
      { href: "/features", label: "View all features", icon: SparklesIcon },
    ],
  },
  {
    title: "Community",
    links: [
      { href: GITHUB_REPO_URL, label: "GitHub", icon: GithubIcon, external: true },
      { href: "https://t.me/memosxtg", label: "Telegram", icon: TelegramIcon, external: true },
      { href: "https://discord.gg/tfPJa4UmAv", label: "Discord", icon: MessageCircleIcon, external: true },
      { href: "https://x.com/usememos", label: "X / Twitter", icon: TwitterIcon, external: true },
      { href: "/sponsors", label: "Sponsors", icon: HeartIcon },
      { href: "https://github.com/usememos/memos/issues", label: "Report an Issue", icon: FileTextIcon, external: true },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/blog", label: "Blog", icon: NewspaperIcon },
      { href: "/docs/api", label: "API Reference", icon: CodeIcon },
      { href: "/brand", label: "Brand Guidelines", icon: PaletteIcon },
      { href: "https://github.com/usememos/memos/blob/main/LICENSE", label: "MIT License", icon: ScaleIcon, external: true },
      { href: "/privacy", label: "Privacy Policy", icon: ShieldCheckIcon },
    ],
  },
];

const FOOTER_LINK_CLASS =
  "inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-zinc-700 dark:hover:text-zinc-200";

function FooterLinkItem({ link }: { link: FooterLink }) {
  const Icon = link.icon;
  const content = (
    <>
      <Icon className="w-4 h-4" />
      {link.label}
    </>
  );

  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={FOOTER_LINK_CLASS}>
        {content}
      </a>
    );
  }

  return (
    <Link href={link.href} prefetch={false} className={FOOTER_LINK_CLASS}>
      {content}
    </Link>
  );
}

export function Footer({ compact = false }: FooterProps = {}) {
  if (compact) {
    return (
      <footer className="mt-auto border-t border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-950">
        <div className="site-container py-12">
          <div className="grid gap-8 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-zinc-950 uppercase dark:text-zinc-100">Memos</p>
              <p className="mt-3 max-w-md text-sm leading-7 text-zinc-600 dark:text-zinc-400">{BRAND_DESCRIPTION}</p>
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
          <div className="mt-8 flex justify-end border-t border-zinc-200 pt-6 dark:border-white/10">
            <ThemeToggle />
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="mt-auto border-t border-zinc-200 bg-transparent dark:border-white/10">
      <div className="site-container py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:gap-12">
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title} className="col-span-1">
              <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-foreground">{column.title}</h3>
              <ul className="space-y-4 text-sm">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <FooterLinkItem link={link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex justify-end border-t border-zinc-200 pt-8 dark:border-white/10">
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
