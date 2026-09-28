import type { ReactNode } from "react";

const TONE_CLASS = {
  light: {
    eyebrow: "text-brand-700 dark:text-brand-300",
    title: "text-zinc-950 dark:text-zinc-100",
    description: "text-zinc-600 dark:text-zinc-300",
  },
  // For always-dark chapters, where `dark:` variants alone would not provide contrast in the light theme.
  inverse: { eyebrow: "text-brand-300", title: "text-white", description: "text-zinc-300" },
} as const;

interface ChapterHeaderProps {
  eyebrow: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  tone?: keyof typeof TONE_CLASS;
  id?: string;
}

/** The centered eyebrow, section thesis, and optional lead shared by Homepage-style chapters. */
export function ChapterHeader({ eyebrow, title, description, tone = "light", id }: ChapterHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <p className={`text-xs font-semibold tracking-[0.18em] uppercase ${TONE_CLASS[tone].eyebrow}`}>{eyebrow}</p>
      <h2
        id={id}
        className={`mt-4 max-w-4xl text-balance font-serif text-[2.5rem] leading-[1.03] font-semibold tracking-[-0.035em] sm:text-5xl lg:text-[3.35rem] ${TONE_CLASS[tone].title}`}
      >
        {title}
      </h2>
      {description ? (
        <p className={`mt-5 max-w-2xl text-pretty text-base leading-7 sm:text-[1.0625rem] sm:leading-8 ${TONE_CLASS[tone].description}`}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
