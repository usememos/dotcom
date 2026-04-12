import {
  ArrowRightIcon,
  BookOpenIcon,
  CodeIcon,
  GraduationCapIcon,
  LightbulbIcon,
  PenToolIcon,
  ServerIcon,
  ShieldCheckIcon,
  UsersIcon,
  WrenchIcon,
} from "lucide-react";
import Link from "next/link";
import { SectionHeader } from "@/components/section-header";

const USE_CASES = [
  {
    slug: "self-hosting",
    icon: ServerIcon,
    title: "Self-Hosters",
    description: "Infrastructure docs & configs",
  },
  {
    slug: "family",
    icon: UsersIcon,
    title: "Family",
    description: "Private updates & shared memories",
  },
  {
    slug: "developers",
    icon: CodeIcon,
    title: "Developers",
    description: "Code snippets & debugging logs",
  },
  {
    slug: "writers",
    icon: PenToolIcon,
    title: "Writers",
    description: "Draft stories & capture ideas",
  },
  {
    slug: "personal-knowledge",
    icon: BookOpenIcon,
    title: "Journals",
    description: "Daily notes & idea trails",
  },
  {
    slug: "hobbyists-makers",
    icon: WrenchIcon,
    title: "Makers",
    description: "Project logs & ideas",
  },
  {
    slug: "students-researchers",
    icon: GraduationCapIcon,
    title: "Students",
    description: "Lecture notes & research",
  },
  {
    slug: "privacy-professionals",
    icon: ShieldCheckIcon,
    title: "Privacy Pros",
    description: "Confidential information",
  },
];

export function HomeUseCasesSection() {
  return (
    <section className="border-b border-zinc-200 bg-white px-4 py-14 dark:border-white/10 dark:bg-zinc-950 sm:px-6 sm:py-18 lg:py-22">
      <div className="mx-auto w-full max-w-[calc(100vw-2rem)] sm:max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <SectionHeader
              icon={LightbulbIcon}
              eyebrow="Use Cases"
              title="Where Memos fits."
              description="Use it where small notes matter: logs, links, snippets, journals, and private updates you want to keep."
              align="left"
            />
            <Link
              href="/use-cases"
              className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-950 transition-colors hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-300 sm:text-base"
            >
              Explore Use Cases
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>

          <div className="border-y border-zinc-200 dark:border-white/10">
            {USE_CASES.map((useCase, index) => {
              const Icon = useCase.icon;

              return (
                <Link
                  key={useCase.title}
                  href={`/use-cases/${useCase.slug}`}
                  className="group grid gap-3 border-b border-zinc-200 py-5 transition-colors last:border-b-0 hover:text-zinc-700 dark:border-white/10 dark:hover:text-zinc-200 sm:grid-cols-[5rem_minmax(0,13rem)_minmax(0,1fr)] sm:items-center"
                >
                  <div className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.18em] text-zinc-400 uppercase dark:text-zinc-500">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <Icon className="h-4 w-4 stroke-[1.8]" />
                  </div>
                  <h3 className="text-balance text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-100 sm:text-xl">
                    {useCase.title}
                  </h3>
                  <p className="max-w-[34rem] text-balance text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-[0.98rem]">
                    {useCase.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
