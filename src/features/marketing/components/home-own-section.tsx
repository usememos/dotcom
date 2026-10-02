import { ArrowRightIcon, EyeOffIcon, LockIcon, TerminalIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { ChapterHeader } from "@/features/marketing/components/chapter-header";
import { HomeOwnCommand } from "@/features/marketing/components/home-own-command";
import { type AnatomyNote, MemoAnatomyFigure } from "@/features/marketing/components/memo-anatomy-figure";
import { BRAND_PROOF_POINTS } from "@/shared/lib/branding";

type ProofPoint = (typeof BRAND_PROOF_POINTS)[number];

/** The condition behind each proof point. */
const PROOF_DETAILS: Record<ProofPoint, { icon: ReactNode; detail: string }> = {
  "Private and free": {
    icon: <LockIcon aria-hidden="true" className="size-4" />,
    detail: "New memos are private by default. MIT-licensed with no license fee; your hosting may cost money.",
  },
  "Zero telemetry": {
    icon: <EyeOffIcon aria-hidden="true" className="size-4" />,
    detail: "The Memos software sends no usage data or analytics.",
  },
  "Deploys in seconds": {
    icon: <TerminalIcon aria-hidden="true" className="size-4" />,
    detail: "With Docker installed, the command above starts your server.",
  },
};

/** Notes on the command's lines; each `id` matches a `data-anchor` in HomeOwnCommand. */
export const COMMAND_NOTES: readonly AnatomyNote[] = [
  { id: "run", label: "One command, one container", side: "left", top: "3.9rem" },
  { id: "data", label: "Your memos live in this folder", side: "left", top: "10.6rem" },
  { id: "port", label: "Open it on port 5230", side: "right", top: "5.7rem" },
  { id: "image", label: "Open source, MIT licensed", side: "right", top: "12.4rem" },
];

export function HomeOwnSection() {
  return (
    <section id="own" className="relative scroll-mt-20 overflow-hidden bg-zinc-950 py-20 text-white sm:py-24 lg:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.16) 1px, transparent 0)",
          backgroundSize: "24px 24px",
          maskImage: "radial-gradient(ellipse at center, black, transparent 70%)",
        }}
      />
      <div className="site-container relative flex flex-col items-center text-center">
        <ChapterHeader eyebrow="Own" title="Choose where your memos live." tone="inverse" />

        <figure className="mt-14 w-full sm:mt-16">
          <MemoAnatomyFigure notes={COMMAND_NOTES} tone="inverse" widthClass="max-w-[31rem]">
            <HomeOwnCommand />
          </MemoAnatomyFigure>
          <figcaption className="mx-auto mt-8 grid max-w-md grid-cols-2 gap-x-6 gap-y-2 text-left text-sm font-medium text-brand-300 xl:hidden">
            {COMMAND_NOTES.map((note) => (
              <span key={note.id}>{note.label}</span>
            ))}
          </figcaption>
        </figure>

        <dl className="mt-14 grid w-full max-w-4xl gap-8 text-left sm:mt-16 md:grid-cols-3 md:gap-10">
          {BRAND_PROOF_POINTS.map((point) => (
            <div key={point}>
              <dt className="flex items-center gap-2.5 text-base font-semibold tracking-tight text-white">
                <span className="text-brand-300">{PROOF_DETAILS[point].icon}</span>
                {point}
              </dt>
              <dd className="mt-2 text-pretty text-sm leading-6 text-zinc-400">{PROOF_DETAILS[point].detail}</dd>
            </div>
          ))}
        </dl>

        <Link
          href="/docs/getting-started"
          prefetch={false}
          className="group mt-12 inline-flex items-center gap-2 rounded-sm text-sm font-semibold text-white transition-colors hover:text-brand-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
        >
          Read the install guide
          <ArrowRightIcon aria-hidden="true" className="size-4 motion-safe:transition-transform motion-safe:group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
