import { useSEO } from "../hooks/useSEO";

export default function SEOHome() {
    useSEO({
        title: "PvP Scalpel",
        description:
            "Analyze your World of Warcraft PvP performance with precision — view rankings, guild rosters, and community stats.",
        canonical: "https://pvpscalpel.com/",
    });

    return null;
}
