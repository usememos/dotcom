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
    <section className="bg-gradient-to-b from-white to-slate-50/50 px-4 py-12 dark:from-slate-900 dark:to-slate-800/50 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          icon={StarIcon}
          title="Why Memos?"
          description="One thing done well: capturing your thoughts without getting in the way."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>

        <div className="mt-10 text-center sm:mt-12">
          <Link
            href="/features"
            className="group inline-flex items-center gap-2 text-base font-semibold text-teal-600 transition-all hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 sm:text-lg"
          >
            Explore All Features
            <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
