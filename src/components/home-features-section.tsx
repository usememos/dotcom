import { ArrowRightIcon, DollarSignIcon, GithubIcon, PenToolIcon, ServerIcon, ShieldIcon, StarIcon, ZapIcon } from "lucide-react";
import Link from "next/link";
import { FeatureCard } from "@/components/feature-card";
import { SectionHeader } from "@/components/section-header";

const FEATURES = [
  {
    icon: <ShieldIcon className="w-6 h-6 sm:w-8 sm:h-8" />,
    title: "Total Data Ownership",
    description: "Your notes live on your server, in your database, in plain Markdown. Zero telemetry, zero tracking.",
  },
  {
    icon: <ZapIcon className="w-6 h-6 sm:w-8 sm:h-8" />,
    title: "Instant Capture",
    description: "Open Memos, type, done. No folder navigation, no template selection. Capture first, organize later.",
  },
  {
    icon: <PenToolIcon className="w-6 h-6 sm:w-8 sm:h-8" />,
    title: "Markdown-Native",
    description: "Write in plain text that lasts. No proprietary formats, no vendor lock-in. Back up with a single file copy.",
  },
  {
    icon: <ServerIcon className="w-6 h-6 sm:w-8 sm:h-8" />,
    title: "Runs Anywhere",
    description: "From a Raspberry Pi to your own cloud. A ~20MB Docker image, one command to deploy, running in under 5 minutes.",
  },
  {
    icon: <GithubIcon className="w-6 h-6 sm:w-8 sm:h-8" />,
    title: "Open Source, MIT Licensed",
    description: "The code is yours as much as the notes are. 57K+ stars, 370+ contributors, built in the open.",
  },
  {
    icon: <DollarSignIcon className="w-6 h-6 sm:w-8 sm:h-8" />,
    title: "Free, Forever",
    description: "Every feature. Every update. No paywalls, no tiers, no surprise fees. Self-hosting means no costs to pass on.",
  },
];

export function HomeFeaturesSection() {
  return (
    <section className="relative overflow-hidden bg-transparent px-4 py-14 sm:px-6 sm:py-18 lg:py-24">
      <div className="mx-auto w-full max-w-(--fd-layout-width)">
        <div className="grid gap-10 border-t border-stone-300/60 pt-10 dark:border-white/10 lg:grid-cols-[minmax(0,21rem)_minmax(0,1fr)] lg:gap-14 lg:pt-14">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <SectionHeader
              icon={StarIcon}
              title="Why Memos?"
              description="A focused tool for quick capture, plain-text notes, and long-term control over your own data."
              align="left"
            />
            <Link
              href="/features"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-stone-900 transition-colors hover:text-stone-700 dark:text-stone-100 dark:hover:text-stone-200 sm:text-base"
            >
              Explore All Features
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:gap-y-10">
            {FEATURES.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
