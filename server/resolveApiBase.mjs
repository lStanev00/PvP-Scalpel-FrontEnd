const DEFAULT_API_BASE = "https://api.pvpscalpel.com";

export function resolveApiBase(env = process.env) {
    const raw = env.REST_URL || env.VITE_API_URL || DEFAULT_API_BASE;
    const trimmed = String(raw || "").trim();

    if (!trimmed) return "";

    if (/^https?:\/\//i.test(trimmed)) {
        return trimmed.replace(/\/+$/, "");
    }

    // Back-compat for internal network addresses supplied without a scheme.
    return `http://${trimmed}`.replace(/\/+$/, "");
}
