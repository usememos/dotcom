// Client-safe stats types shared by the instance client and the dashboard.

/** A single UTC day with a memo count. date is "YYYY-MM-DD". */
export type MemosActivityDay = { date: string; count: number };

export type MemosStatsData = {
  totalMemoCount: number;
  /** Number of distinct tags. */
  tagCount: number;
  memoTypeStats: { link: number; code: number; todo: number; undo: number };
  /** Days with count > 0 within the trailing window, ascending by date. */
  days: MemosActivityDay[];
};
