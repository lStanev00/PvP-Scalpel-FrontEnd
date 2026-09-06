/* eslint-disable react/prop-types -- Video metadata is normalized before use. */
import { publicAssetUrl } from "../helpers/assets.js";
import { useSEO } from "../hooks/useSEO";

const SITE_NAME = "PvP Scalpel";
const CANONICAL_ORIGIN = "https://www.pvpscalpel.com";
const UNAVAILABLE_TITLE = "Clip unavailable | PvP Scalpel";
const UNAVAILABLE_DESCRIPTION = "This PvP Scalpel clip is unavailable.";

function canonicalFor(videoID) {
    return `${CANONICAL_ORIGIN}/watch/${encodeURIComponent(String(videoID))}`;
}

function useVideoSEO({ title, username, image, canonical, robots }) {
    const description = `${username} on ${SITE_NAME}`;

    useSEO({
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
    });
}

export default function SEOVideo({ video }) {
    useVideoSEO({
        title: video?.title || "Untitled video",
        username: video?.username || "Anonymous",
        image: video?.thumbnail || publicAssetUrl("logo/logo_resized.png"),
        canonical: canonicalFor(video?.id || ""),
        robots: "index, follow",
    });

    return null;
}

export function SEOUnavailableVideo({ videoID }) {
    const canonical = canonicalFor(videoID);

    useSEO({
        title: UNAVAILABLE_TITLE,
        description: UNAVAILABLE_DESCRIPTION,
        canonical,
        robots: "noindex, nofollow, noarchive",
        ogSiteName: SITE_NAME,
        ogTitle: UNAVAILABLE_TITLE,
        ogDescription: UNAVAILABLE_DESCRIPTION,
        ogType: "website",
        ogUrl: canonical,
        ogImage: publicAssetUrl("logo/logo_resized.png"),
        twitterCard: "summary_large_image",
        twitterTitle: UNAVAILABLE_TITLE,
        twitterDescription: UNAVAILABLE_DESCRIPTION,
        twitterImage: publicAssetUrl("logo/logo_resized.png"),
    });

    return null;
}
