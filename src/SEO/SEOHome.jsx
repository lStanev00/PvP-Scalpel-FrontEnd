import { Helmet } from "react-helmet-async";

export default function SEOHome() {
    return (
        <Helmet>
            <title>PvP Scalpel — Home</title>
            <meta
                name="description"
                content="Analyze your World of Warcraft PvP performance with precision — view rankings, guild rosters, and community stats."
            />
            <link rel="canonical" href="https://pvpscalpel.com/" />
        </Helmet>
    );
}
