const FE_CONTENT_EXPIRY_BUFFER_MS = 30 * 1000;
const FE_CONTENT_STORAGE_KEY = "pvpscalpel.feContentCache";

function canUseLocalStorage() {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function isCachedContentEntryValid(content) {
    return (
        content &&
        typeof content === "object" &&
        typeof content.url === "string" &&
        typeof content.expiresAt === "number"
    );
}

function isCachedContentExpired(content) {
    return (
        content.expiresAt > 0 && content.expiresAt - FE_CONTENT_EXPIRY_BUFFER_MS <= Date.now()
    );
}

function readPersistedFEContentCache() {
    if (!canUseLocalStorage()) return {};

    try {
        const rawCache = window.localStorage.getItem(FE_CONTENT_STORAGE_KEY);
        if (!rawCache) return {};

        const parsedCache = JSON.parse(rawCache);
        return parsedCache && typeof parsedCache === "object" ? parsedCache : {};
    } catch {
        return {};
    }
}

function syncPersistedFEContentCache(cache) {
    if (!canUseLocalStorage()) return;

    const persistedCache = {};

    for (const [path, content] of cache.entries()) {
        if (!isCachedContentEntryValid(content) || isCachedContentExpired(content)) {
            continue;
        }

        persistedCache[path] = {
            url: content.url,
            expiresAt: content.expiresAt,
        };
    }

    if (!Object.keys(persistedCache).length) {
        window.localStorage.removeItem(FE_CONTENT_STORAGE_KEY);
        return;
    }

    window.localStorage.setItem(FE_CONTENT_STORAGE_KEY, JSON.stringify(persistedCache));
}

/**
 * Creates the FE-content cache seeded from persisted, still-valid entries.
 *
 * @returns {Map<string, { url?: string, expiresAt?: number, promise?: Promise<string> }>}
 */
export function createFEContentCache() {
    const persistedCache = readPersistedFEContentCache();
    const cache = new Map();

    for (const [path, content] of Object.entries(persistedCache)) {
        if (!isCachedContentEntryValid(content) || isCachedContentExpired(content)) {
            continue;
        }

        cache.set(path, content);
    }

    syncPersistedFEContentCache(cache);
    return cache;
}

/**
 * Fetches a frontend-content asset descriptor and converts it into a cached resource shape.
 *
 * @param {(endpoint: string, options?: RequestInit) => Promise<{ ok?: boolean, data?: unknown }>} httpFetch
 * Authenticated request helper that returns the normalized API response.
 * @param {string} path Asset path stored in the frontend-content bucket.
 * @returns {Promise<{ url: string, expiresAt: number }>}
 */
export async function fetchFEContentResource(httpFetch, path) {
    const response = await httpFetch(`/CDN/FEContent?path=${path}`);
    const data = response?.data;

    if (!response?.ok || !data || typeof data !== "object") {
        return { url: "", expiresAt: 0 };
    }

    const expiresInSeconds = Number(data.expiresIn);

    return {
        url: data.url || data.downloadUrl || "",
        expiresAt:
            Number.isFinite(expiresInSeconds) && expiresInSeconds > 0
                ? Date.now() + expiresInSeconds * 1000
                : 0,
    };
}

/**
 * Returns a cached FE-content URL when still valid, otherwise refreshes it and updates the cache.
 *
 * @param {Map<string, { url?: string, expiresAt?: number, promise?: Promise<string> }>} cache
 * Cache storage for resolved assets and in-flight requests.
 * @param {(path: string) => Promise<{ url: string, expiresAt: number }>} fetchFEContent
 * Resource fetcher used when the cache is empty or expired.
 * @param {string} path Asset path stored in the frontend-content bucket.
 * @returns {Promise<string>}
 */
export function getCachedFEContent(cache, fetchFEContent, path) {
    const cachedContent = cache.get(path);

    if (cachedContent?.url) {
        if (!isCachedContentExpired(cachedContent)) {
            return Promise.resolve(cachedContent.url);
        }
    }

    if (cachedContent?.promise) {
        return cachedContent.promise;
    }

    const contentRequest = fetchFEContent(path)
        .then((content) => {
            if (!content.url) {
                cache.delete(path);
                syncPersistedFEContentCache(cache);
                return "";
            }

            cache.set(path, content);
            syncPersistedFEContentCache(cache);
            return content.url;
        })
        .catch(() => {
            cache.delete(path);
            syncPersistedFEContentCache(cache);
            return "";
        });

    cache.set(path, { promise: contentRequest });
    return contentRequest;
}
