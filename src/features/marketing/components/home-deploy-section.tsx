import { ArrowRightIcon, ContainerIcon } from "lucide-react";
import Link from "next/link";
import { DockerCommand } from "@/features/marketing/components/docker-command";

export function HomeDeploySection() {
  return (
    <section id="deploy" className="relative overflow-hidden bg-zinc-950 px-4 py-20 text-white sm:px-6 sm:py-24 lg:py-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(45,212,191,0.2) 1px, transparent 0)",
          backgroundSize: "24px 24px",
          maskImage: "linear-gradient(to right, black, transparent 72%)",
        }}
      />
      <div className="relative mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:items-center lg:gap-16">
        <div>
          <span className="inline-flex size-11 items-center justify-center rounded-full border border-teal-300/30 bg-teal-300/10 text-teal-200">
            <ContainerIcon className="size-5" />
          </span>
          <p className="mt-7 text-xs font-semibold tracking-[0.18em] text-teal-300 uppercase">Deploy</p>
          <h2 className="mt-4 max-w-[13ch] text-balance font-serif text-[2.5rem] leading-[1.03] font-semibold tracking-[-0.035em] sm:text-5xl lg:text-[3.35rem]">
            Your server. One command.
          </h2>
          <p className="mt-5 max-w-md text-base leading-7 text-zinc-300 sm:text-[1.0625rem] sm:leading-8">
            Start a private Memos timeline in minutes, then move it whenever your setup changes.
          </p>
          <Link
            href="/docs/getting-started"
            prefetch={false}
            className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-teal-200"
          >
            View deployment options
            <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <DockerCommand />
      </div>
    </section>
  );
}
