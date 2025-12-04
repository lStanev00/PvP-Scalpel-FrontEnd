import { useSEO } from "../hooks/useSEO";

export default function SEOPosts() {
    useSEO({
        title: "PvP Scalpel — Community Posts",
        description:
            "Read PvP guides, strategies, and announcements from the PvP Scalpel community.",
        canonical: "https://pvpscalpel.com/posts",
    });

    return null;
}
