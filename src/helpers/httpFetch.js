/**
 * Performs an authenticated API request and normalizes the response shape.
 *
 * @param {string} endpoint API path appended to the configured API domain.
 * @param {RequestInit} [options={}] Additional fetch options merged with the defaults.
 * @returns {Promise<
 *   | { status: number, ok: true, data: unknown }
 *   | { status: number, ok: false, data?: unknown, error?: string }
 * >}
 */
export async function httpFetchWithCredentials(endpoint, options = {}) {
    const apiDomain = import.meta.env.VITE_API_URL || "https://api.pvpscalpel.com";
    if (!apiDomain) {
        return {
            status: 0,
            ok: false,
            error: "VITE_API_URL is not configured",
        };
    }

    const defaultOptions = {
        credentials: "include",
        headers: {
            600: "BasicPass",
            "Content-Type": "application/json",
            ...options.headers,
        },
    };

    if (import.meta.env.MODE == "development") {
        defaultOptions.headers.ga6n1fa4fcvt = "EiDcafRc45$td4aedrgh4615tokenbtw";
    }

    const finalOptions = { ...defaultOptions, ...options };

    try {
        const res = await fetch(apiDomain + endpoint, finalOptions);

        let data = null;
        const contetType = res.headers.get("content-type");

        if (contetType && contetType.includes("application/json")) {
            data = await res.json();
        }

        return {
            status: res.status,
            ok: res.ok,
            data,
        };
    } catch (error) {
        return {
            status: 0,
            ok: false,
            error: error.message || "Debug this case",
        };
    }
}
