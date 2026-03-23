type CacheEntry<T> = {
  expiresAt: number;
  value?: T;
  promise?: Promise<T>;
};

const GLOBAL_TTL_CACHE_KEY = '__echocodeTtlCache';

function getCacheStore(): Map<string, CacheEntry<unknown>> {
  const globalScope = globalThis as typeof globalThis & {
    [GLOBAL_TTL_CACHE_KEY]?: Map<string, CacheEntry<unknown>>;
  };

  if (!globalScope[GLOBAL_TTL_CACHE_KEY]) {
    globalScope[GLOBAL_TTL_CACHE_KEY] = new Map<string, CacheEntry<unknown>>();
  }

  return globalScope[GLOBAL_TTL_CACHE_KEY];
}

export async function readThroughTtlCache<T>(
  key: string,
  ttlMs: number,
  loader: () => Promise<T>,
): Promise<T> {
  const now = Date.now();
  const store = getCacheStore();
  const existing = store.get(key) as CacheEntry<T> | undefined;

  if (existing && existing.value !== undefined && existing.expiresAt > now) {
    return existing.value;
  }

  if (existing?.promise) {
    return existing.promise;
  }

  const pending = loader()
    .then((value) => {
      store.set(key, {
        value,
        expiresAt: Date.now() + ttlMs,
      });

      return value;
    })
    .catch((error) => {
      store.delete(key);
      throw error;
    });

  store.set(key, {
    expiresAt: now + ttlMs,
    promise: pending,
  });

  return pending;
}
