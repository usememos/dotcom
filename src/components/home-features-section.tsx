import { ArrowRightIcon, DollarSignIcon, GithubIcon, PenToolIcon, ServerIcon, ShieldIcon, StarIcon, ZapIcon } from "lucide-react";
import Link from "next/link";
import { FeatureCard } from "@/components/feature-card";
import { SectionHeader } from "@/components/section-header";

const FEATURES = [
  {
    icon: <ShieldIcon className="w-6 h-6 sm:w-8 sm:h-8" />,
    title: "Your Notes Stay With You",
    description: "Run Memos on your server, store notes in your database, and keep the data path clear.",
  },
  {
    icon: <ZapIcon className="w-6 h-6 sm:w-8 sm:h-8" />,
    title: "Open, Type, Move On",
    description: "No folder choice, no template step, no title required before a thought is worth saving.",
  },
  {
    icon: <PenToolIcon className="w-6 h-6 sm:w-8 sm:h-8" />,
    title: "Plain Markdown",
    description: "Write in a format that stays readable, portable, and easy to back up outside the app.",
  },
  {
    icon: <ServerIcon className="w-6 h-6 sm:w-8 sm:h-8" />,
    title: "Small Enough to Run Anywhere",
    description: "Start on a Raspberry Pi, VPS, or cloud box with a lightweight Docker deploy.",
  },
  {
    icon: <GithubIcon className="w-6 h-6 sm:w-8 sm:h-8" />,
    title: "Open Source You Can Inspect",
    description: "MIT licensed, public on GitHub, and shaped by contributors who run Memos themselves.",
  },
  {
    icon: <DollarSignIcon className="w-6 h-6 sm:w-8 sm:h-8" />,
    title: "Free Because You Host It",
    description: "No paid unlocks or seat pricing in the product. Bring the infrastructure that fits your setup.",
  },
];

export function HomeFeaturesSection() {
  return (
    <section className="border-b border-zinc-200 bg-white px-4 py-14 dark:border-white/10 dark:bg-zinc-950 sm:px-6 sm:py-18 lg:py-22">
      <div className="mx-auto w-full max-w-(--fd-layout-width)">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <SectionHeader
              icon={StarIcon}
              eyebrow="Product"
              title="Small on purpose. Fast by default."
              description="Memos keeps the core loop simple: capture now, organize later, and keep the notes on your side of the line."
              align="left"
            />
            <Link
              href="/features"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-zinc-950 transition-colors hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-300 sm:text-base"
            >
              See the Feature Set
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:gap-y-10">
            {FEATURES.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
