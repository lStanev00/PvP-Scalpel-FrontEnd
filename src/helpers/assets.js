const DEFAULT_ASSET_BASE_URL =
    "https://bucket.pvpscalpel.com/pvp-scalpel-frontend";

function normalizeBaseUrl(value) {
    const baseUrl = String(value || DEFAULT_ASSET_BASE_URL).trim();
    return baseUrl.replace(/\/+$/, "");
}

function normalizeAssetPath(path) {
    return String(path || "").replace(/^\/+/, "");
}

export const ASSET_BASE_URL = normalizeBaseUrl(
    import.meta.env.VITE_ASSET_BASE_URL,
);

export function assetUrl(path) {
    return `${ASSET_BASE_URL}/${normalizeAssetPath(path)}`;
}

export function publicAssetUrl(path) {
    return assetUrl(`public/${normalizeAssetPath(path)}`);
}
