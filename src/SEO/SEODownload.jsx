import { useSEO } from "../hooks/useSEO";

export default function SEODownload() {
    useSEO({
        title: "PvP Scalpel - Download",
        description:
            "Download the PvP Scalpel desktop launcher for Windows and get real-time PvP performance tracking and analytics.",
        canonical: "https://www.pvpscalpel.com/download",
        ogUrl: "https://www.pvpscalpel.com/download",
    });

    return null;
}
