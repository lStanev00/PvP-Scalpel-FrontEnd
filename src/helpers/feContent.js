const FE_CONTENT_EXPIRY_BUFFER_MS = 30 * 1000;

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
        const hasExpiration = cachedContent.expiresAt > 0;
        const isExpired =
            hasExpiration && cachedContent.expiresAt - FE_CONTENT_EXPIRY_BUFFER_MS <= Date.now();

        if (!isExpired) {
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
                return "";
            }

            cache.set(path, content);
            return content.url;
        })
        .catch(() => {
            cache.delete(path);
            return "";
        });

    cache.set(path, { promise: contentRequest });
    return contentRequest;
}
