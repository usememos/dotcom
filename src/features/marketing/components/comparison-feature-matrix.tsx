import { CheckIcon, MinusIcon, XIcon } from "lucide-react";
import type { ComparisonDefinition, FeatureCell, FeatureSupport } from "@/features/marketing/data/comparisons";
import { FEATURE_MATRIX_GROUPS, FEATURE_MATRIX_ROWS, MEMOS_MATRIX } from "@/features/marketing/data/comparisons";
import { cn } from "@/shared/lib/utils";

const SUPPORT_MARK: Record<FeatureSupport, { label: string; icon: typeof CheckIcon; className: string }> = {
  yes: { label: "Yes", icon: CheckIcon, className: "text-brand-700 dark:text-brand-300" },
  partial: { label: "Partial", icon: MinusIcon, className: "text-zinc-500 dark:text-zinc-400" },
  no: { label: "No", icon: XIcon, className: "text-zinc-400 dark:text-zinc-500" },
};

/**
 * Below `sm` the table reflows into stacked rows (label above, the two products side by side)
 * instead of scrolling sideways; from `sm` up it is an ordinary three-column table.
 */
export const COMPARISON_TABLE_CLASS = {
  table: "block w-full border-collapse text-left text-sm sm:table",
  head: "hidden sm:table-header-group",
  body: "block sm:table-row-group",
  row: "grid grid-cols-2 gap-x-6 sm:table-row",
  rowLabel: "col-span-2 pt-5 pb-2 text-sm font-medium text-zinc-500 sm:table-cell sm:py-5 sm:pr-6 sm:align-top dark:text-zinc-400",
  cell: "block pb-5 leading-7 sm:table-cell sm:py-5 sm:align-top",
  /** Product name shown above each cell only in the stacked layout. */
  cellLabel: "mb-1 block text-xs font-medium text-zinc-400 sm:hidden dark:text-zinc-500",
} as const;

interface ComparisonFeatureMatrixProps {
  comparison: Pick<ComparisonDefinition, "competitor" | "matrix" | "title">;
}

/**
 * The truthful comparison structure a comparison page is allowed to make its
 * signature: one shared row set in four groups, Memos' fixed column, and the
 * competitor's column with an optional source footnote per cell.
 */
export function ComparisonFeatureMatrix({ comparison }: ComparisonFeatureMatrixProps) {
  return (
    <table aria-label={`${comparison.title} feature matrix`} className={COMPARISON_TABLE_CLASS.table}>
      <thead className={COMPARISON_TABLE_CLASS.head}>
        <tr className="border-b border-zinc-200 dark:border-white/10">
          <th scope="col" className="w-44 pb-4 pr-6 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Feature
          </th>
          <th scope="col" className="pb-4 pr-6 text-base font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">
            Memos
          </th>
          <th scope="col" className="pb-4 text-base font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">
            {comparison.competitor}
          </th>
        </tr>
      </thead>
      {FEATURE_MATRIX_GROUPS.map((group) => (
        <tbody key={group} className={COMPARISON_TABLE_CLASS.body}>
          <tr className="block sm:table-row">
            <th
              scope="rowgroup"
              colSpan={3}
              className="block pt-9 pb-3 text-xs font-semibold tracking-[0.18em] text-brand-700 uppercase sm:table-cell dark:text-brand-300"
            >
              {group}
            </th>
          </tr>
          {FEATURE_MATRIX_ROWS.filter((row) => row.group === group).map((row) => (
            <tr key={row.key} className={cn(COMPARISON_TABLE_CLASS.row, "border-t border-zinc-200 dark:border-white/10")}>
              <th scope="row" className={COMPARISON_TABLE_CLASS.rowLabel}>
                {row.label}
              </th>
              <td className={cn(COMPARISON_TABLE_CLASS.cell, "pr-6 text-zinc-800 dark:text-zinc-200")}>
                <span className={COMPARISON_TABLE_CLASS.cellLabel} aria-hidden="true">
                  Memos
                </span>
                <FeatureCellContent cell={MEMOS_MATRIX[row.key]} product="Memos" rowLabel={row.label} />
              </td>
              <td className={cn(COMPARISON_TABLE_CLASS.cell, "text-zinc-600 dark:text-zinc-400")}>
                <span className={COMPARISON_TABLE_CLASS.cellLabel} aria-hidden="true">
                  {comparison.competitor}
                </span>
                <FeatureCellContent cell={comparison.matrix[row.key]} product={comparison.competitor} rowLabel={row.label} />
              </td>
            </tr>
          ))}
        </tbody>
      ))}
    </table>
  );
}

function FeatureCellContent({ cell, product, rowLabel }: { cell: FeatureCell; product: string; rowLabel: string }) {
  const mark = cell.support ? SUPPORT_MARK[cell.support] : null;
  const Icon = mark?.icon;

  return (
    <span className="grid grid-cols-[1rem_minmax(0,1fr)] gap-x-2.5">
      {mark && Icon ? (
        <>
          <Icon aria-hidden="true" className={cn("mt-[0.45rem] size-4 shrink-0 stroke-[2.25]", mark.className)} />
          <span className="sr-only">{mark.label}.</span>
        </>
      ) : (
        <span aria-hidden="true" />
      )}
      <span className="col-start-2">
        {cell.detail}
        {cell.source ? (
          <>
            {" "}
            <a
              href={cell.source}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Source for ${product} ${rowLabel.toLowerCase()}`}
              className="text-xs text-zinc-400 underline decoration-zinc-300 underline-offset-2 transition-colors hover:text-brand-700 dark:decoration-white/20 dark:hover:text-brand-300"
            >
              source
            </a>
          </>
        ) : null}
      </span>
    </span>
  );
}
