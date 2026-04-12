import { RocketIcon } from "lucide-react";
import Link from "next/link";
import { DockerCommand } from "@/components/docker-command";
import { SectionHeader } from "@/components/section-header";

export function HomeDeploySection() {
  return (
    <section className="border-b border-zinc-200 bg-zinc-50 px-4 py-14 dark:border-white/10 dark:bg-zinc-950 sm:px-6 sm:py-18 lg:py-22">
      <div className="mx-auto w-full max-w-(--fd-layout-width)">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-start lg:gap-16">
          <div>
            <SectionHeader
              icon={RocketIcon}
              eyebrow="Deploy"
              title="Run it, then write."
              description="A single Docker command gets a private Memos timeline running in minutes."
              align="left"
            />
            <Link
              href="/docs/getting-started"
              className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-950 transition-colors hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-300 sm:text-base"
            >
              View all deployment options
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="mx-auto w-full max-w-3xl">
            <DockerCommand />
          </div>
        </div>
      </div>
    </section>
  );
}
