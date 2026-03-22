import { RocketIcon } from "lucide-react";
import Link from "next/link";
import { DockerCommand } from "@/components/docker-command";
import { SectionHeader } from "@/components/section-header";

export function HomeDeploySection() {
  return (
    <section className="bg-gradient-to-b from-slate-50/80 to-white px-4 py-12 dark:from-slate-800 dark:to-slate-900 sm:px-6 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-5xl">
        <SectionHeader
          icon={RocketIcon}
          title="One Command. Running in Minutes."
          description="A single Docker command gets you from zero to capturing thoughts."
        />

        <div className="mx-auto max-w-3xl">
          <DockerCommand />
        </div>

        <div className="mt-8 text-center sm:mt-10">
          <Link
            href="/docs/getting-started"
            className="inline-flex items-center gap-2 text-sm font-semibold text-teal-600 transition-colors hover:text-teal-700 hover:underline dark:text-teal-400 dark:hover:text-teal-300 sm:text-base"
          >
            View all deployment options
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
