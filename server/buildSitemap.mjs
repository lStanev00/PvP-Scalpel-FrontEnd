
export function buildSitemap(lastmod, urls = sitemapUrls) {
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
    
    const entries = urls
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
