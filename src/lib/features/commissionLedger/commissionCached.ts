// A small in-memory cache for commission list fetches, shared across any
// component that imports it (not tied to CommissionTable's local state).
// This means an action elsewhere (approve/confirm/mark-paid/dispute) can
// call `invalidateCommissionsCache()` and the next tab visit will refetch
// fresh data instead of serving a stale cached page.

interface CachedEntry<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPage: number };
  cachedAt: number;
}

const cache = new Map<string, CachedEntry<any>>();

// How long a cached page is considered fresh before a revisit refetches it
// anyway, even without explicit invalidation. Keeps things correct if a
// mutation happens in another tab/session and this one doesn't know to
// invalidate.
const TTL_MS = 60_000;

export function buildCommissionsCacheKey(
  scope: "mine" | "all",
  tab: string,
  page: number
): string {
  return `${scope}:${tab}:${page}`;
}

export function getCachedCommissions<T>(key: string): CachedEntry<T> | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.cachedAt > TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry;
}

export function setCachedCommissions<T>(
  key: string,
  data: T[],
  meta: CachedEntry<T>["meta"]
) {
  cache.set(key, { data, meta, cachedAt: Date.now() });
}

// Call this after any mutation (approve, confirm, mark paid, dispute,
// resolve dispute, etc.) so the next fetch — on any tab — bypasses the
// cache and gets fresh data. Simpler and safer than trying to patch the
// exact cached entries that changed.
export function invalidateCommissionsCache() {
  cache.clear();
}