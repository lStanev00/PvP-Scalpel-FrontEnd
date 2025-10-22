import { Helmet } from "react-helmet-async";

export default function SEOPosts() {
    return (
        <Helmet>
            <title>PvP Scalpel — Community Posts</title>
            <meta
                name="description"
                content="Read PvP guides, strategies, and announcements from the PvP Scalpel community."
            />
            <link rel="canonical" href="https://pvpscalpel.com/posts" />
        </Helmet>
    );
}
