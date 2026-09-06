import { useSEO } from "../hooks/useSEO";

export default function SEOPosts() {
    useSEO({
        title: "PvP Scalpel — Community Posts",
        description:
            "Read PvP guides, strategies, and announcements from the PvP Scalpel community.",
        canonical: "https://www.pvpscalpel.com/posts",
        ogUrl: "https://www.pvpscalpel.com/posts",
    });

    return null;
}
