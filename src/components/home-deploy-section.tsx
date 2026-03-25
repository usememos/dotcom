import { RocketIcon } from "lucide-react";
import Link from "next/link";
import { DockerCommand } from "@/components/docker-command";
import { SectionHeader } from "@/components/section-header";

export function HomeDeploySection() {
  return (
    <section className="bg-[linear-gradient(180deg,#f4f8f7_0%,#ffffff_100%)] px-4 py-14 dark:bg-[linear-gradient(180deg,#081014_0%,#070a0c_100%)] sm:px-6 sm:py-18 lg:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:items-center lg:gap-14">
          <div>
            <SectionHeader
              icon={RocketIcon}
              title="One Command. Running in Minutes."
              description="A single Docker command gets you from zero to capturing thoughts."
              align="left"
            />
            <Link
              href="/docs/getting-started"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition-colors hover:text-teal-700 dark:text-white dark:hover:text-teal-300 sm:text-base"
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
