import { RocketIcon } from "lucide-react";
import Link from "next/link";
import { DockerCommand } from "@/components/docker-command";
import { SectionHeader } from "@/components/section-header";

export function HomeDeploySection() {
  return (
    <section className="bg-transparent px-4 py-14 sm:px-6 sm:py-18 lg:py-24">
      <div className="mx-auto w-full max-w-(--fd-layout-width)">
        <div className="grid gap-10 border-t border-stone-300/60 pt-10 dark:border-white/10 lg:grid-cols-[minmax(0,21rem)_minmax(0,1fr)] lg:items-start lg:gap-14 lg:pt-14">
          <div>
            <SectionHeader
              icon={RocketIcon}
              title="One Command. Running in Minutes."
              description="A single Docker command gets you from zero to capturing thoughts."
              align="left"
            />
            <Link
              href="/docs/getting-started"
              className="inline-flex items-center gap-2 text-sm font-semibold text-stone-900 transition-colors hover:text-stone-700 dark:text-stone-100 dark:hover:text-stone-200 sm:text-base"
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
