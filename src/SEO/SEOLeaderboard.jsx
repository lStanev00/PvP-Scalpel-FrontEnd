import { Helmet } from "react-helmet-async";

export default function SEOLeaderboard({ content }) {

    const titles = {
        shuffleContent: "PvP Scalpel — Solo Shuffle Rankings",
        "2v2Content": "PvP Scalpel — 2v2 Arena Rankings",
        "3v3Content": "PvP Scalpel — 3v3 Arena Rankings",
        blitzContent: "PvP Scalpel — Blitz Battleground Rankings",
        BGContent: "PvP Scalpel — Rated Battleground Rankings",
    };

    const descriptions = {
        shuffleContent:
            "Track Solo Shuffle performance for World of Warcraft players — see guild rankings, class stats, and competitive trends updated in real time.",
        "2v2Content":
            "Analyze 2v2 Arena PvP rankings — view top players, MMR progress, and guild performance across World of Warcraft’s most tactical bracket.",
        "3v3Content":
            "Explore 3v3 Arena PvP rankings — real-time stats, top comps, and guild leaderboard insights for World of Warcraft competitive players.",
        blitzContent:
            "View Blitz Battleground PvP rankings — fast-paced rated battlegrounds with live guild stats and top WoW team compositions.",
        BGContent:
            "Browse Rated Battleground PvP leaderboards — discover the top-performing teams, class breakdowns, and guild contributions in real time.",
    };

    const slugs = {
        shuffleContent: "solo-shuffle",
        "2v2Content": "2v2",
        "3v3Content": "3v3",
        blitzContent: "blitz",
        BGContent: "rated-bg",
    };

    const title = titles[content] || "PvP Scalpel — Leaderboard Rankings";
    const description =
        descriptions[content] ||
        "Explore real-time World of Warcraft PvP leaderboards — view rankings, class stats, and guild progress across all rated brackets.";
    const slug = slugs[content] || "leaderboard";

    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={`https://pvpscalpel.com/leaderboard/${slug}`} />
            <link rel="canonical" href={`https://pvpscalpel.com/leaderboard/${slug}`} />
        </Helmet>
    );
}
