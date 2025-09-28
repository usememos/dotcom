const DEFAULT_LIMIT = 60;
const DEFAULT_WINDOW_MS = 60_000;
const CLEANUP_INTERVAL_MS = 60_000;
const MAX_BUCKETS = 10_000;

type Bucket = {
  count: number;
  reset: number;
};

type Tracker = Map<string, Bucket>;

const tracker: Tracker = new Map();
let lastCleanup = Date.now();

export type RateLimitOptions = {
  limit?: number;
  windowMs?: number;
};

export type RateLimitState = {
  allowed: boolean;
  limit: number;
  remaining: number;
  reset: number;
  retryAfter: number;
};

function cleanup(now: number) {
  if (tracker.size === 0) return;
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [key, bucket] of tracker.entries()) {
    if (bucket.reset <= now) {
      tracker.delete(key);
    }
  }

  if (tracker.size <= MAX_BUCKETS) return;

  const entries = Array.from(tracker.entries()).sort((a, b) => a[1].reset - b[1].reset);
  while (tracker.size > MAX_BUCKETS && entries.length > 0) {
    const [key] = entries.shift()!;
    tracker.delete(key);
  }
}

export function consumeRateLimit(identifier: string, options: RateLimitOptions = {}): RateLimitState {
  const limit = options.limit ?? DEFAULT_LIMIT;
  const windowMs = options.windowMs ?? DEFAULT_WINDOW_MS;
  const now = Date.now();

  cleanup(now);

  let bucket = tracker.get(identifier);
  if (!bucket || bucket.reset <= now) {
    bucket = { count: 0, reset: now + windowMs };
  }

  bucket.count += 1;
  tracker.set(identifier, bucket);

  const allowed = bucket.count <= limit;
  const remaining = allowed ? limit - bucket.count : 0;
  const resetSeconds = Math.max(0, Math.ceil((bucket.reset - now) / 1000));

  return {
    allowed,
    limit,
    remaining,
    reset: resetSeconds,
    retryAfter: resetSeconds,
  };
}
