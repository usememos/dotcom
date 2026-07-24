import {
  ArrowUpRightIcon,
  BookOpenIcon,
  CodeIcon,
  GraduationCapIcon,
  PenToolIcon,
  ServerIcon,
  ShieldCheckIcon,
  UsersIcon,
  WrenchIcon,
} from "lucide-react";
import Link from "next/link";

const USE_CASES = [
  {
    slug: "self-hosting",
    icon: ServerIcon,
    title: "Self-hosters",
    description: "Infrastructure notes, configuration history, and the fixes you will need again.",
  },
  {
    slug: "developers",
    icon: CodeIcon,
    title: "Developers",
    description: "Code snippets, debugging trails, and the small decisions behind a shipped change.",
  },
  {
    slug: "writers",
    icon: PenToolIcon,
    title: "Writers",
    description: "Lines worth keeping, early drafts, and research captured before the idea disappears.",
  },
  {
    slug: "personal-knowledge",
    icon: BookOpenIcon,
    title: "Journals",
    description: "Daily observations and private idea trails without turning life into a database.",
  },
  {
    slug: "hobbyists-makers",
    icon: WrenchIcon,
    title: "Makers",
    description: "Build logs, measurements, parts, and the next thing to try when you return.",
  },
  {
    slug: "students-researchers",
    icon: GraduationCapIcon,
    title: "Students",
    description: "Lecture notes, sources, and questions that connect one study session to the next.",
  },
  {
    slug: "family",
    icon: UsersIcon,
    title: "Families",
    description: "A private stream for updates, shared memories, and the people closest to you.",
  },
  {
    slug: "privacy-professionals",
    icon: ShieldCheckIcon,
    title: "Privacy-conscious teams",
    description: "Sensitive working notes kept on infrastructure your organization controls.",
  },
] as const;

export function HomeUseCasesSection() {
  return (
    <section id="workflows" className="bg-white px-4 py-16 dark:bg-zinc-950 sm:px-6 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,0.9fr)_minmax(18rem,0.55fr)] lg:items-end lg:justify-between lg:gap-12">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-teal-700 uppercase dark:text-teal-300">Use cases</p>
            <h2 className="mt-4 max-w-[17ch] text-balance font-serif text-[2.5rem] leading-[1.03] font-semibold tracking-[-0.035em] text-zinc-950 dark:text-zinc-100 sm:text-5xl lg:text-[3.35rem]">
              Small notes, many kinds of work.
            </h2>
          </div>
          <p className="max-w-lg text-base leading-7 text-zinc-600 dark:text-zinc-300 sm:text-[1.0625rem] sm:leading-8 lg:justify-self-end">
            Memos fits wherever context arrives in fragments and needs somewhere private to stay.
          </p>
        </div>

        <div className="mt-12 grid sm:mt-14 md:grid-cols-2 md:gap-x-12">
          {USE_CASES.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <Link
                key={useCase.title}
                href={`/use-cases/${useCase.slug}`}
                prefetch={false}
                className={`group grid grid-cols-[2.75rem_minmax(0,1fr)_auto] gap-4 border-b border-zinc-200 py-6 transition-colors hover:bg-stone-50 dark:border-white/10 dark:hover:bg-white/[0.035] ${
                  index % 2 === 0 ? "md:pr-3" : "md:pl-3"
                }`}
              >
                <span className="flex size-9 items-center justify-center rounded-full bg-stone-100 text-zinc-500 transition-colors group-hover:bg-teal-50 group-hover:text-teal-700 dark:bg-white/6 dark:text-zinc-400 dark:group-hover:bg-teal-400/10 dark:group-hover:text-teal-300">
                  <Icon className="size-4 stroke-[1.8]" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-100 sm:text-[1.1875rem]">
                    {useCase.title}
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-[0.9375rem]">
                    {useCase.description}
                  </p>
                </div>
                <ArrowUpRightIcon className="mt-2 size-4 text-zinc-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-teal-700 dark:text-zinc-500 dark:group-hover:text-teal-300" />
              </Link>
            );
          })}
        </div>

        <div className="mt-8 flex justify-end">
          <Link
            href="/use-cases"
            prefetch={false}
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-950 transition-colors hover:text-teal-700 dark:text-zinc-100 dark:hover:text-teal-300"
          >
            Browse all workflows
            <ArrowUpRightIcon className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
