const SITE_NAME = "PvP Scalpel";
const CANONICAL_ORIGIN = "https://www.pvpscalpel.com";
const DEFAULT_TITLE = "Untitled video";
const DEFAULT_USERNAME = "Anonymous";
const UNAVAILABLE_TITLE = "Clip unavailable | PvP Scalpel";
const UNAVAILABLE_DESCRIPTION = "This PvP Scalpel clip is unavailable.";

function normalizeText(value, fallback) {
    return typeof value === "string" && value.trim()
        ? value.trim()
        : fallback;
}

function buildCanonical(videoID) {
    return `${CANONICAL_ORIGIN}/watch/${encodeURIComponent(String(videoID))}`;
}

function resolveThumbnail(thumbnail, assetBase, logoUrl) {
    if (typeof thumbnail !== "string" || !thumbnail.trim()) {
        return logoUrl;
    }

    try {
        return new URL(thumbnail.trim(), `${assetBase.replace(/\/+$/, "")}/`)
            .href;
    } catch {
        return logoUrl;
    }
}

function buildSocialMetadata({ title, description, canonical, image, robots }) {
    return {
        title,
        description,
        canonical,
        robots,
        ogSiteName: SITE_NAME,
        ogTitle: title,
        ogDescription: description,
        ogType: "website",
        ogUrl: canonical,
        ogImage: image,
        twitterCard: "summary_large_image",
        twitterTitle: title,
        twitterDescription: description,
        twitterImage: image,
    };
}

export function buildVideoSeo(video, { assetBase, logoUrl }) {
    const title = normalizeText(video?.title, DEFAULT_TITLE);
    const username = normalizeText(video?.author?.username, DEFAULT_USERNAME);
    const canonical = buildCanonical(video._id);
    const image = resolveThumbnail(
        video?.manifest?.thumbnail,
        assetBase,
        logoUrl
    );

    return buildSocialMetadata({
        title,
        description: `${username} on ${SITE_NAME}`,
        canonical,
        image,
        robots: "index, follow",
    });
}

export function buildUnavailableVideoSeo(videoID, logoUrl) {
    return buildSocialMetadata({
        title: UNAVAILABLE_TITLE,
        description: UNAVAILABLE_DESCRIPTION,
        canonical: buildCanonical(videoID),
        image: logoUrl,
        robots: "noindex, nofollow, noarchive",
    });
}
