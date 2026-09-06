
export async function buildSitemap(lastmod, urls, apiBase) {
    const sitemapUrls = [
        {
            loc: "https://www.pvpscalpel.com/",
            changefreq: "weekly",
            priority: "1.0",
        },
        {
            loc: "https://www.pvpscalpel.com/leaderboard",
            changefreq: "daily",
            priority: "0.9",
        },
        {
            loc: "https://www.pvpscalpel.com/leaderboard/solo-shuffle",
            changefreq: "daily",
            priority: "0.8",
        },
        {
            loc: "https://www.pvpscalpel.com/leaderboard/2v2",
            changefreq: "daily",
            priority: "0.8",
        },
        {
            loc: "https://www.pvpscalpel.com/leaderboard/3v3",
            changefreq: "daily",
            priority: "0.8",
        },
        {
            loc: "https://www.pvpscalpel.com/leaderboard/blitz",
            changefreq: "daily",
            priority: "0.8",
        },
        {
            loc: "https://www.pvpscalpel.com/leaderboard/rated-bg",
            changefreq: "weekly",
            priority: "0.8",
        },
        {
            loc: "https://www.pvpscalpel.com/roster",
            changefreq: "weekly",
            priority: "0.7",
        },
        {
            loc: "https://www.pvpscalpel.com/watch",
            changefreq: "daily",
            priority: "0.9",
        },
        {
            loc: "https://www.pvpscalpel.com/posts",
            changefreq: "monthly",
            priority: "0.1",
        },
        {
            loc: "https://www.pvpscalpel.com/joinGuild",
            changefreq: "monthly",
            priority: "0.6",
        },
    ];

    try {
        const endpoint = `${apiBase}/videosIDs`;
        const response = await fetch(endpoint, {
            headers: {
                "600": "BasicPass",
                "Content-Type": "application/json",
                "fe-ping": "front-end",
            },
            signal: AbortSignal.timeout(5000),
        });

        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data)) {
                const seen = new Set();
                for (const videoID of data) {
                    if (
                        typeof videoID !== "string" ||
                        !/^[a-f\d]{24}$/i.test(videoID) ||
                        seen.has(videoID)
                    ) {
                        continue;
                    }

                    seen.add(videoID);
                    sitemapUrls.push({
                        loc: `https://www.pvpscalpel.com/watch/${encodeURIComponent(videoID)}`,
                        changefreq: "weekly",
                        priority: "0.8",
                    });
                }
            }
        }
    } catch (error) {
        console.warn("Could not enrich sitemap with video URLs", error);
    }

    const entries = (urls ?? sitemapUrls)
        .map(
            (entry) =>
                `  <url>\n` +
                `    <loc>${entry.loc}</loc>\n` +
                `    <lastmod>${lastmod}</lastmod>\n` +
                `    <changefreq>${entry.changefreq}</changefreq>\n` +
                `    <priority>${entry.priority}</priority>\n` +
                `  </url>`
        )
        .join("\n");

    return (
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        entries +
        `\n</urlset>\n`
    );
}
