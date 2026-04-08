import { useSEO } from "../hooks/useSEO";

export default function SEOLobbyScan() {
    useSEO({
        title: "PvP Scalpel - PvP Lobby Scan",
        description:
            "Paste your PvP Scalpel lobby string to stage pre-match bracket, rating, and lobby reads before the gates open.",
        canonical: "https://pvpscalpel.com/scanLobby",
    });

    return null;
}
