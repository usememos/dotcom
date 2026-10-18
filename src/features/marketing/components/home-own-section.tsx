import { EyeOffIcon, LockIcon, TerminalIcon } from "lucide-react";
import Link from "next/link";
import { ChapterHeader } from "@/features/marketing/components/chapter-header";
import { HomeOwnCommand } from "@/features/marketing/components/home-own-command";
import { MarketingActions } from "@/features/marketing/components/marketing-page";

const DETAILS = [
  {
    title: "Private and free",
    icon: LockIcon,
    description: "New memos are private by default. MIT-licensed with no license fee; your hosting may cost money.",
  },
  {
    title: "Zero telemetry",
    icon: EyeOffIcon,
    description: "The Memos software sends no usage data or analytics.",
  },
  {
    title: "Deployment options",
    icon: TerminalIcon,
    description: "You can also use Docker Compose, a native binary, Kubernetes, or build from source.",
  },
];

export function HomeOwnSection() {
  return (
    <section id="own" className="scroll-mt-20 bg-zinc-950 py-20 text-white sm:py-24 lg:py-28">
      <div className="site-container flex flex-col items-center text-center">
        <ChapterHeader eyebrow="Own" title="Choose where your memos live." tone="inverse" />
        <div className="mt-14 w-full max-w-[42rem] text-left sm:mt-16">
          <HomeOwnCommand prominent />
          <p className="mt-5 text-center text-sm leading-7 text-balance text-zinc-300">
            <Link
              href="/docs/configuration/database"
              prefetch={false}
              className="rounded-sm underline decoration-white/30 underline-offset-4 transition-colors hover:text-brand-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
            >
              SQLite by default. MySQL and PostgreSQL supported.
            </Link>
          </p>
        </div>
        <dl className="mx-auto mt-14 grid max-w-4xl gap-10 text-left sm:mt-16 md:grid-cols-3">
          {DETAILS.map(({ title, icon: Icon, description }) => (
            <div key={title}>
              <dt className="flex items-center gap-2.5 text-base font-semibold text-white">
                <Icon className="size-4 text-brand-300" aria-hidden="true" />
                {title}
              </dt>
              <dd className="mt-3 text-sm leading-7 text-zinc-300">{description}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-12">
          <MarketingActions tone="inverse" actions={[{ label: "Deployment guides", href: "/docs/deploy" }]} />
        </div>
      </div>
    </section>
  );
}
