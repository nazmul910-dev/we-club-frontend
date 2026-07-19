

interface CachedEntry<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPage: number };
  cachedAt: number;
}

const cache = new Map<string, CachedEntry<any>>();

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

export function invalidateCommissionsCache() {
  cache.clear();
}