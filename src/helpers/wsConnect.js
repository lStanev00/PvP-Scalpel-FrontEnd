/**
 * Creates a browser websocket using the configured app websocket endpoint.
 *
 * Browser WebSocket cannot attach custom headers. In development this mirrors
 * the REST `/api` setup by connecting to the same-origin Vite `/ws` proxy, so
 * eligible localhost cookies are included in the upgrade request.
 *
 * @param {string} [path=""] Optional websocket path appended to the configured base URL.
 * @returns {WebSocket}
 */
export function createWebSocketWithCredentials(path = "") {
    const configuredUrl = import.meta.env.VITE_WS_URL || "wss://ws.pvpscalpel.com";
    const baseUrl = normalizeWebSocketBaseUrl(configuredUrl);
    const normalizedPath = path ? "/" + String(path).replace(/^\/+/, "") : "";

    return new WebSocket(baseUrl.replace(/\/+$/, "") + normalizedPath);
}

function normalizeWebSocketBaseUrl(value) {
    const url = String(value || "").trim();

    if (url.startsWith("ws://") || url.startsWith("wss://")) {
        return url;
    }

    if (url.startsWith("/")) {
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        return `${protocol}//${window.location.host}${url}`;
    }

    return `wss://${url}`;
}
