import { ArrowRightIcon, DollarSignIcon, PenToolIcon, ServerIcon, ShieldIcon, StarIcon, ZapIcon } from "lucide-react";
import Link from "next/link";
import type { SVGProps } from "react";
import { FeatureCard } from "@/components/feature-card";
import { SectionHeader } from "@/components/section-header";

function GithubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.29 9.4 7.86 10.92.58.1.79-.25.79-.56v-2.18c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.18c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

const FEATURES = [
  {
    icon: <ShieldIcon className="h-4 w-4 stroke-[1.8]" />,
    title: "Your Notes Stay With You",
    description: "Run Memos on your server, store notes in your database, and keep the data path clear.",
  },
  {
    icon: <ZapIcon className="h-4 w-4 stroke-[1.8]" />,
    title: "Open, Type, Move On",
    description: "No folder choice, no template step, no title required before a thought is worth saving.",
  },
  {
    icon: <PenToolIcon className="h-4 w-4 stroke-[1.8]" />,
    title: "Plain Markdown",
    description: "Write in a format that stays readable, portable, and easy to back up outside the app.",
  },
  {
    icon: <ServerIcon className="h-4 w-4 stroke-[1.8]" />,
    title: "Small Enough to Run Anywhere",
    description: "Start on a Raspberry Pi, VPS, or cloud box with a lightweight Docker deploy.",
  },
  {
    icon: <GithubIcon className="h-4 w-4 stroke-[1.8]" />,
    title: "Open Source You Can Inspect",
    description: "MIT licensed, public on GitHub, and shaped by contributors who run Memos themselves.",
  },
  {
    icon: <DollarSignIcon className="h-4 w-4 stroke-[1.8]" />,
    title: "Free Because You Host It",
    description: "No paid unlocks or seat pricing in the product. Bring the infrastructure that fits your setup.",
  },
];

export function HomeFeaturesSection() {
  return (
    <section className="border-b border-zinc-200 bg-white px-4 py-14 dark:border-white/10 dark:bg-zinc-950 sm:px-6 sm:py-18 lg:py-22">
      <div className="mx-auto w-full max-w-[calc(100vw-2rem)] sm:max-w-6xl">
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

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
