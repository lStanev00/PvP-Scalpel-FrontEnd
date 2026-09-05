import { useSEO } from "../hooks/useSEO";

export default function SEOTV() {
    useSEO({
        title: "Scalpel TV",
        description:
            "Watch World of Warcraft PvP videos, highlights, guides, arena matches, Battleground Blitz clips, and community content from PvP Scalpel.",
        canonical: "https://www.pvpscalpel.com/watch",
    });

    return null;
}