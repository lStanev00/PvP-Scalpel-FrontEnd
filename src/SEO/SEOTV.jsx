import { useSEO } from "../hooks/useSEO";
import { publicAssetUrl } from "../helpers/assets.js";

const TITLE = "Scalpel TV";
const DESCRIPTION =
    "Watch World of Warcraft PvP videos, highlights, guides, arena matches, Battleground Blitz clips, and community content from PvP Scalpel.";
const CANONICAL = "https://www.pvpscalpel.com/watch";
const IMAGE = publicAssetUrl("logo/logo_resized.png");

export default function SEOTV() {
    useSEO({
        title: TITLE,
        description: DESCRIPTION,
        canonical: CANONICAL,
        robots: "index, follow",
        ogSiteName: "PvP Scalpel",
        ogTitle: TITLE,
        ogDescription: DESCRIPTION,
        ogType: "website",
        ogUrl: CANONICAL,
        ogImage: IMAGE,
        twitterCard: "summary_large_image",
        twitterTitle: TITLE,
        twitterDescription: DESCRIPTION,
        twitterImage: IMAGE,
    });

    return null;
}
