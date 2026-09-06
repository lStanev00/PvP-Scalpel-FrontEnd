export const DEFAULT_ASSET_BASE_URL =
    "https://bucket.pvpscalpel.com/pvp-scalpel-frontend";

export function resolveAssetBase(env = process.env) {
    const raw =
        env.ASSET_BASE_URL ||
        env.VITE_ASSET_BASE_URL ||
        DEFAULT_ASSET_BASE_URL;

    return String(raw || DEFAULT_ASSET_BASE_URL)
        .trim()
        .replace(/\/+$/, "");
}

export function assetUrl(assetBase, assetPath) {
    return `${assetBase}/${String(assetPath || "").replace(/^\/+/, "")}`;
}
