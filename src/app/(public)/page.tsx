import { ArrowRightIcon, LockKeyholeIcon, PenLineIcon, ServerIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/features/marketing/components/footer";
import { HeroAccent } from "@/features/marketing/components/hero-accent";
import { HeroSection } from "@/features/marketing/components/hero-section";
import { HomeDeploySection } from "@/features/marketing/components/home-deploy-section";
import { HomeDiscoverSection } from "@/features/marketing/components/home-discover-section";
import { HomeFaqSection } from "@/features/marketing/components/home-faq-section";
import { HomeFeaturesSection } from "@/features/marketing/components/home-features-section";
import { HomeUseCasesSection } from "@/features/marketing/components/home-use-cases-section";
import { MarketingSiteLayout } from "@/features/marketing/components/marketing-site-layout";
import { buildDefaultOpenGraphImages, DEFAULT_OG_IMAGE } from "@/shared/lib/seo";

const PRINCIPLES = [
  {
    icon: PenLineIcon,
    title: "Open. Write. Done.",
    description: "No folder decision, no workspace setup, no title required before a thought is worth saving.",
  },
  {
    icon: LockKeyholeIcon,
    title: "Private timeline.",
    description: "Memos feels closer to posting into your own quiet feed than maintaining a formal notebook.",
  },
  {
    icon: ServerIcon,
    title: "Yours to run.",
    description: "Self-host it, keep Markdown-native notes, and choose the database and server you trust.",
  },
] as const;

export const metadata: Metadata = {
  title: {
    absolute: "Memos - Open-Source, Self-Hosted Note-Taking App",
  },
  description:
    "Memos is an open-source, self-hosted note-taking app — a Markdown-native timeline for quick notes, daily logs, links, and snippets. Self-host with Docker in minutes; private and free.",
  keywords: [
    "note-taking app",
    "open source note taking app",
    "self-hosted note-taking app",
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
    images: buildDefaultOpenGraphImages(),
  },
  twitter: {
    card: "summary_large_image",
    title: "Memos - Capture first. Keep it yours.",
    description:
      "Open-source, self-hosted timeline for quick notes, daily logs, links, and snippets. Markdown-native, lightweight, and yours to run.",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function HomePage() {
  return (
    <MarketingSiteLayout>
      <main className="flex flex-1 flex-col overflow-x-hidden bg-white dark:bg-zinc-950">
        <HeroSection
          title={
            <>
              <span className="block">Capture first.</span>
              <span className="block">
                <HeroAccent>Keep it yours.</HeroAccent>
              </span>
            </>
          }
          subtitle="A self-hosted timeline for quick notes, daily logs, links, and snippets. Open it, write in Markdown, and move on."
          primaryCta={{ text: "Install Memos", href: "/docs/getting-started" }}
          secondaryCta={{ text: "Try Live Demo", href: "https://demo.usememos.com/", external: true }}
        />
        <section id="why-memos" className="bg-white px-4 py-16 dark:bg-zinc-950 sm:px-6 sm:py-20 lg:py-24">
          <div className="mx-auto w-full max-w-6xl">
            <div className="grid gap-7 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.7fr)] lg:items-end lg:gap-12">
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-teal-700 uppercase dark:text-teal-300">The idea</p>
                <h2 className="mt-4 max-w-[17ch] text-balance font-serif text-[2.5rem] leading-[1.03] font-semibold tracking-[-0.035em] text-zinc-950 dark:text-zinc-100 sm:text-5xl lg:text-[3.35rem]">
                  Not a workspace. Not a second brain.
                </h2>
              </div>
              <p className="max-w-xl text-base leading-7 text-zinc-600 dark:text-zinc-300 sm:text-[1.0625rem] sm:leading-8 lg:justify-self-end">
                Just a small, self-hosted timeline for notes you want to capture quickly and keep close.
              </p>
            </div>

            <div className="mt-12 grid gap-10 sm:mt-14 lg:grid-cols-3 lg:gap-12">
              {PRINCIPLES.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title}>
                    <Icon className="size-5 text-teal-700 dark:text-teal-300" />
                    <h3 className="mt-7 text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-100 sm:mt-8 sm:text-[1.375rem]">
                      {item.title}
                    </h3>
                    <p className="mt-3 max-w-md text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-[0.9375rem]">
                      {item.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <HomeFeaturesSection />
        <HomeDeploySection />
        <HomeUseCasesSection />
        <HomeDiscoverSection />
        <HomeFaqSection />

        <section id="start" className="bg-white px-4 py-16 dark:bg-zinc-950 sm:px-6 sm:py-20 lg:py-24">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-12">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-teal-700 uppercase dark:text-teal-300">Start here</p>
              <h2 className="mt-4 text-balance font-serif text-[2.5rem] leading-[1.03] font-semibold tracking-[-0.035em] text-zinc-950 dark:text-zinc-100 sm:text-5xl">
                Start with one memo.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-zinc-600 dark:text-zinc-300 sm:text-[1.0625rem] sm:leading-8">
                Run it yourself or try the public demo before choosing where your timeline will live.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Link
                href="/docs/getting-started"
                prefetch={false}
                className="group inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-700 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-teal-300"
              >
                Install Memos
                <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="https://demo.usememos.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg border border-zinc-300 px-5 py-3 text-sm font-semibold text-zinc-950 transition-colors hover:bg-stone-50 dark:border-white/15 dark:text-zinc-100 dark:hover:bg-white/5"
              >
                Try Live Demo
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </MarketingSiteLayout>
  );
}
