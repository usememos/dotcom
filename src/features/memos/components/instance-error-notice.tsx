import type { InstanceErrorDetail } from "@/shared/memos/errors";

/** Renders a classified instance error with its remediation steps. */
export function InstanceErrorNotice({ detail }: { detail: InstanceErrorDetail }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-left dark:border-red-900/50 dark:bg-red-950/30">
      <p className="text-sm font-semibold text-red-800 dark:text-red-200">{detail.title}</p>
      <p className="mt-1 text-sm text-red-700 dark:text-red-300">{detail.why}</p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-red-700 dark:text-red-300">
        {detail.howToFix.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ul>
    </div>
  );
}
