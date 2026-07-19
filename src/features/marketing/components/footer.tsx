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
  PuzzleIcon,
  ScaleIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StickyNoteIcon,
} from "lucide-react";
import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
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
  { href: "/web-clipper", label: "Web Clipper" },
  { href: "/scratchpad", label: "Scratchpad" },
  { href: "/features", label: "Features" },
  { href: "/changelog", label: "Changelog" },
  { href: "/blog", label: "Blog" },
  { href: "https://github.com/usememos/memos", label: "GitHub", external: true },
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
      { href: "/compare", label: "Compare", icon: GitCompareIcon },
      { href: "/pricing", label: "Pricing", icon: DollarSignIcon },
      { href: "/changelog", label: "Changelog", icon: HistoryIcon },
    ],
  },
  {
    title: "Tools",
    links: [
      { href: "/web-clipper", label: "Web Clipper", icon: PuzzleIcon },
      { href: "/scratchpad", label: "Scratchpad", icon: StickyNoteIcon },
      { href: "https://demo.usememos.com/", label: "Live Demo", icon: ExternalLinkIcon, external: true },
      { href: "/docs/api", label: "API Reference", icon: CodeIcon },
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
      { href: "https://github.com/usememos/memos", label: "GitHub", icon: GithubIcon, external: true },
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
      { href: "/brand", label: "Brand Guidelines", icon: PaletteIcon },
      { href: "https://github.com/usememos/memos/blob/main/LICENSE", label: "MIT License", icon: ScaleIcon, external: true },
      { href: "/privacy", label: "Privacy Policy", icon: ShieldCheckIcon },
    ],
  },
];

const FOOTER_LINK_CLASS =
  "inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-zinc-700 dark:hover:text-zinc-200";

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
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:gap-12">
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title} className="col-span-1">
              <h3 className="font-semibold text-fd-foreground mb-6 text-sm uppercase tracking-wider">{column.title}</h3>
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
      </div>
    </footer>
  );
}
