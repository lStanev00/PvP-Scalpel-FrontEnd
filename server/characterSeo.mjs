export function safeJsonStringify(value) {
    return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function buildCharSeo(char, canonical, logoUrl) {
    if (!char) {
        return buildCharNotFoundSeo(canonical, logoUrl);
    }

    const name = char?.name || "Character";
    const realm = char?.playerRealm?.name || "";
    const region = (char?.server || "").toUpperCase();
    const spec = char?.activeSpec?.name || "";
    const charClass = char?.class?.name || "";
    const guild = char?.guildName || "Independent";
    const faction = char?.faction || "";
    const level = char?.level ?? "";

    let bestBracket = null;
    let bestRating = 0;

    if (char?.rating && typeof char.rating === "object") {
        for (const [bracket, data] of Object.entries(char.rating)) {
            const current = data?.currentSeason?.rating ?? 0;
            if (current > bestRating) {
                bestRating = current;
                bestBracket = bracket;
            }
        }
    }

    const displayBracket = bestBracket
        ? bestBracket.replace(/[-_]/g, " ").toUpperCase()
        : "PVP";
    const rating = bestRating || 0;
    const title =
        `${name} - ${spec} ${charClass} (${rating} ${displayBracket}) | PvP Scalpel`
            .replace(/\s+/g, " ")
            .trim();
    const description = [
        `${name}${level ? `, level ${level}` : ""}${
            faction ? ` ${faction}` : ""
        }${charClass ? ` ${charClass}` : ""}${
            realm ? ` on ${realm}` : ""
        }${region ? ` (${region})` : ""}${
            spec ? ` - ${spec} specialization.` : "."
        }`,
        `Currently rated ${rating} in ${displayBracket}, member of ${guild}.`,
        "View detailed gear, talents, achievements, and performance history on PvP Scalpel.",
    ]
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
    const image = char?.media?.charImg || char?.media?.avatar || logoUrl;
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "VideoGameCharacter",
        name,
        description,
        image,
        url: canonical,
        characterClass: charClass || undefined,
        characterLevel: level || undefined,
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
        ].filter((entry) => entry.value),
    };

    return {
        title,
        description,
        canonical,
        ogTitle: title,
        ogDescription: description,
        ogType: "profile",
        ogUrl: canonical,
        ogImage: image,
        twitterCard: "summary_large_image",
        twitterTitle: title,
        twitterDescription: description,
        twitterImage: image,
        jsonLD: safeJsonStringify(structuredData),
    };
}

export function buildCharNotFoundSeo(canonical, logoUrl) {
    const title = "Character Not Found | PvP Scalpel";
    const description =
        "We couldn't find that character. Check the realm, server, and name, then try again.";

    return {
        title,
        description,
        canonical,
        ogTitle: title,
        ogDescription: description,
        ogType: "website",
        ogUrl: canonical,
        ogImage: logoUrl,
        twitterCard: "summary_large_image",
        twitterTitle: title,
        twitterDescription: description,
        twitterImage: logoUrl,
    };
}
