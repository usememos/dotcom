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
  },
  {
    slug: "developers",
    icon: CodeIcon,
    title: "Developers",
  },
  {
    slug: "writers",
    icon: PenToolIcon,
    title: "Writers",
  },
  {
    slug: "personal-knowledge",
    icon: BookOpenIcon,
    title: "Journals",
  },
  {
    slug: "hobbyists-makers",
    icon: WrenchIcon,
    title: "Makers",
  },
  {
    slug: "students-researchers",
    icon: GraduationCapIcon,
    title: "Students",
  },
  {
    slug: "family",
    icon: UsersIcon,
    title: "Families",
  },
  {
    slug: "privacy-professionals",
    icon: ShieldCheckIcon,
    title: "Privacy-conscious teams",
  },
] as const;

export function HomeUseCasesSection() {
  return (
    <section id="workflows" className="bg-white py-16 dark:bg-zinc-950 sm:py-20 lg:py-24">
      <div className="site-container">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,0.9fr)_auto] lg:items-end lg:gap-12">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-brand-700 uppercase dark:text-brand-300">Use cases</p>
            <h2 className="mt-4 max-w-[17ch] text-balance font-serif text-[2.5rem] leading-[1.03] font-semibold tracking-[-0.035em] text-zinc-950 dark:text-zinc-100 sm:text-5xl lg:text-[3.35rem]">
              Small notes, many kinds of work.
            </h2>
          </div>
          <Link
            href="/use-cases"
            prefetch={false}
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-950 transition-colors hover:text-brand-700 dark:text-zinc-100 dark:hover:text-brand-300 lg:justify-self-end"
          >
            Browse all workflows
            <ArrowUpRightIcon className="size-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-x-8 gap-y-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-5">
          {USE_CASES.map((useCase) => {
            const Icon = useCase.icon;
            return (
              <Link
                key={useCase.title}
                href={`/use-cases/${useCase.slug}`}
                prefetch={false}
                className="group grid grid-cols-[2.75rem_minmax(0,1fr)_auto] items-center gap-3 py-2"
              >
                <span className="flex size-9 items-center justify-center rounded-full bg-stone-100 text-zinc-500 transition-colors group-hover:bg-brand-50 group-hover:text-brand-700 dark:bg-white/6 dark:text-zinc-400 dark:group-hover:bg-brand-400/10 dark:group-hover:text-brand-300">
                  <Icon className="size-4 stroke-[1.8]" />
                </span>
                <h3 className="text-base font-semibold tracking-tight text-zinc-950 dark:text-zinc-100 sm:text-lg">{useCase.title}</h3>
                <ArrowUpRightIcon className="size-4 text-zinc-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-700 dark:text-zinc-500 dark:group-hover:text-brand-300" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
