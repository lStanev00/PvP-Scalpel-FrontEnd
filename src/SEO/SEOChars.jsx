import { Helmet } from "react-helmet-async";

export default function SEOChars({ char }) {
    if (!char) return null;

    const name = char.name;
    const realm = char.playerRealm?.name || "";
    const region = char.server?.toUpperCase() || "";
    const spec = char.activeSpec?.name || "";
    const charClass = char.class?.name || "";
    const guild = char.guildName || "Independent";
    const faction = char.faction || "";

    // Find the highest rating dynamically
    let bestBracket = null;
    let bestRating = 0;

    if (char.rating && typeof char.rating === "object") {
        for (const [bracket, data] of Object.entries(char.rating)) {
            const current = data?.currentSeason?.rating ?? 0;
            if (current > bestRating) {
                bestRating = current;
                bestBracket = bracket;
            }
        }
    }

    const displayBracket = bestBracket ? bestBracket.replace(/[-_]/g, " ").toUpperCase() : "PvP";
    const rating = bestRating || 0;

    const title = `${name} — ${spec} ${charClass} (${rating} ${displayBracket}) | PvP Scalpel`;

    const description = `${name}, level ${char.level} ${faction} ${charClass} on ${realm} (${region}) — ${spec} specialization. 
Currently rated ${rating} in ${displayBracket}, member of ${guild}. 
View detailed gear, talents, achievements, and performance history on PvP Scalpel.`;

    const image =
        char.media?.charImg || char.media?.avatar || "https://pvpscalpel.com/logo/logo_resized.png";

    const canonical = `https://pvpscalpel.com/check/${region.toLowerCase()}/${
        char.playerRealm?.slug
    }/${name}`;

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "VideoGameCharacter",
        name,
        description,
        image,
        url: canonical,
        characterClass: charClass,
        characterLevel: char.level,
        game: {
            "@type": "VideoGame",
            name: "World of Warcraft",
            url: "https://worldofwarcraft.blizzard.com/",
        },
        additionalProperty: [
            { "@type": "PropertyValue", name: "Faction", value: faction },
            { "@type": "PropertyValue", name: "Spec", value: spec },
            {
                "@type": "PropertyValue",
                name: "Highest Rating",
                value: `${rating} (${displayBracket})`,
            },
            { "@type": "PropertyValue", name: "Guild", value: guild },
        ],
    };

    return (
        <Helmet>
            {/* ======= Core SEO ======= */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={canonical} />

            {/* ======= Open Graph ======= */}
            <meta property="og:type" content="profile" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={canonical} />
            <meta property="og:site_name" content="PvP Scalpel" />

            {/* ======= Twitter Card ======= */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* ======= Structured Data ======= */}
            <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        </Helmet>
    );
}
