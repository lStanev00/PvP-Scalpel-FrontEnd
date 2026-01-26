import { useEffect } from "react";
import { useSEO } from "../hooks/useSEO";

export default function SEODesktopBeta() {
    useSEO({
        title: "PvP Scalpel Desktop — Closed Beta",
        description:
            "Private closed beta information for the PvP Scalpel Desktop companion application.",
        canonical: "https://pvpscalpel.com/desktopBeta",
        ogTitle: "PvP Scalpel Desktop — Closed Beta",
        ogDescription:
            "Private closed beta information for the PvP Scalpel Desktop companion application.",
        ogType: "website",
        ogUrl: "https://pvpscalpel.com/desktop-beta",
        ogImage: "https://pvpscalpel.com/logo/logo_resized.png",
        twitterCard: "summary_large_image",
        twitterTitle: "PvP Scalpel Desktop — Closed Beta",
        twitterDescription:
            "Private closed beta information for the PvP Scalpel Desktop companion application.",
        twitterImage: "https://pvpscalpel.com/logo/logo_resized.png",
    });

    useEffect(() => {
        let meta = document.querySelector('meta[name="robots"]');
        const prevContent = meta?.content;
        const created = !meta;

        if (!meta) {
            meta = document.createElement("meta");
            meta.setAttribute("name", "robots");
            document.head.appendChild(meta);
        }

        meta.setAttribute("content", "noindex,nofollow,noarchive");

        return () => {
            if (created) {
                meta.remove();
                return;
            }
            if (prevContent) {
                meta.setAttribute("content", prevContent);
            }
        };
    }, []);

    return null;
}
