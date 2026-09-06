const SITE_NAME = "PvP Scalpel";
const CANONICAL_ORIGIN = "https://www.pvpscalpel.com";
const DEFAULT_TITLE = "Untitled video";
const DEFAULT_USERNAME = "Anonymous";
const TV_TITLE = "Scalpel TV";
const TV_DESCRIPTION =
    "Watch World of Warcraft PvP videos, highlights, guides, arena matches, Battleground Blitz clips, and community content from PvP Scalpel.";
const TV_CANONICAL = `${CANONICAL_ORIGIN}/watch`;
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

function buildSocialMetadata({
    title,
    description,
    canonical,
    image,
    robots,
    suppressDescription = false,
}) {
    return {
        title,
        description,
        canonical,
        robots,
        suppressDescription,
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
    const clipTitle = normalizeText(video?.title, DEFAULT_TITLE);
    const username = normalizeText(video?.author?.username, DEFAULT_USERNAME);
    const title = `${clipTitle} - ${username} at ${SITE_NAME}`;
    const canonical = buildCanonical(video._id);
    const image = resolveThumbnail(
        video?.manifest?.thumbnail,
        assetBase,
        logoUrl
    );

    return buildSocialMetadata({
        title,
        description: "",
        canonical,
        image,
        robots: "index, follow",
        suppressDescription: true,
    });
}

export function buildVideoCatalogueSeo(logoUrl) {
    return buildSocialMetadata({
        title: TV_TITLE,
        description: TV_DESCRIPTION,
        canonical: TV_CANONICAL,
        image: logoUrl,
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
