import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/hero-section";

const PRINCIPLES = [
  {
    label: "01",
    title: "Open. Write. Done.",
    description: "No folder decision, no workspace setup, no title required before a thought is worth saving.",
  },
  {
    label: "02",
    title: "Private timeline.",
    description: "Memos feels closer to posting into your own quiet feed than maintaining a formal notebook.",
  },
  {
    label: "03",
    title: "Yours to run.",
    description: "Self-host it, keep Markdown-native notes, and choose the database and server you trust.",
  },
] as const;

const START_LINKS = [
  { href: "/docs/getting-started", label: "Install Memos" },
  { href: "/features", label: "See Features" },
  { href: "/use-cases", label: "Use Cases" },
  { href: "/docs", label: "Read Docs" },
] as const;

export const metadata: Metadata = {
  description:
    "Memos is an open-source, self-hosted timeline for quick notes, daily logs, links, and snippets. Capture first, organize later, and keep every memo yours.",
  keywords: [
    "open source self hosted note-taking tool",
    "self-hosted note-taking tool",
    "open source note taking",
    "docker notes tool",
    "privacy-first notes",
    "markdown notes",
    "memos",
    "quick capture notes",
    "self-hosted notes",
  ],
  alternates: {
    canonical: "https://usememos.com",
  },
  openGraph: {
    title: "Memos - Capture first. Keep it yours.",
    description:
      "Open-source, self-hosted timeline for quick notes, daily logs, links, and snippets. Markdown-native, lightweight, and yours to run.",
    url: "https://usememos.com",
    siteName: "Memos",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Memos - Capture first. Keep it yours.",
    description:
      "Open-source, self-hosted timeline for quick notes, daily logs, links, and snippets. Markdown-native, lightweight, and yours to run.",
  },
};

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col bg-white dark:bg-zinc-950">
      <HeroSection
        title={
          <>
            <span className="block">Capture first.</span>
            <span className="block">Keep it yours.</span>
          </>
        }
        subtitle="A self-hosted timeline for quick notes, daily logs, links, and snippets. Open it, write in Markdown, and move on."
        primaryCta={{ text: "Install Memos", href: "/docs/getting-started" }}
        secondaryCta={{ text: "Try Live Demo", href: "https://demo.usememos.com/", external: true }}
      />
      <section className="border-b border-zinc-200 bg-white px-4 py-14 dark:border-white/10 dark:bg-zinc-950 sm:px-6 lg:py-20">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end">
          <h2 className="text-balance font-serif text-3xl font-semibold tracking-[-0.035em] text-zinc-950 dark:text-zinc-100 sm:text-4xl lg:text-5xl">
            Not a workspace. Not a second brain.
          </h2>
          <p className="max-w-2xl text-balance text-lg leading-8 text-zinc-600 dark:text-zinc-300 lg:justify-self-end">
            Just a small, self-hosted timeline for notes you want to capture quickly and keep close.
          </p>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-white px-4 dark:border-white/10 dark:bg-zinc-950 sm:px-6">
        <div className="mx-auto grid max-w-5xl divide-y divide-zinc-200 dark:divide-white/10 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          {PRINCIPLES.map((item) => (
            <div key={item.title} className="py-8 lg:px-8 lg:first:pl-0 lg:last:pr-0">
              <p className="text-xs font-semibold tracking-[0.18em] text-zinc-400 uppercase dark:text-zinc-500">{item.label}</p>
              <h3 className="mt-5 text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">{item.title}</h3>
              <p className="mt-4 max-w-md text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-base">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white px-4 py-16 dark:bg-zinc-950 sm:px-6 lg:py-22">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">Start here</p>
          <h2 className="mt-5 text-balance font-serif text-4xl font-semibold tracking-[-0.04em] text-zinc-950 dark:text-zinc-100 sm:text-5xl">
            Start with one memo.
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-3 text-sm font-semibold text-zinc-950 dark:text-zinc-100">
            {START_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 transition-colors hover:bg-zinc-100 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
