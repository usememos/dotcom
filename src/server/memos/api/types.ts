export type NormalizedStats = {
  totalMemoCount: number;
  /** Number of distinct tags. */
  tagCount: number;
  memoTypeStats: { link: number; code: number; todo: number; undo: number };
  /** Raw ISO timestamps used to build the activity heatmap (pre-bucketing). */
  createdTimestamps: string[];
};

export type MemosApiAdapter = {
  id: "gen-a" | "gen-b" | "fallback";
  /** Path (relative to the instance origin) for the user stats request. */
  statsPath: (userId: string) => string;
  /** Maps a raw `:getStats` response to the normalized shape, or null when the payload is not an object. */
  normalizeStats: (raw: unknown) => NormalizedStats | null;
};
