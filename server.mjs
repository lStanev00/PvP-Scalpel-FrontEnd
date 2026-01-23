import express from "express";
import { engine } from "express-handlebars";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.disable("x-powered-by");

const rootDir = __dirname;
const seoDir = path.join(rootDir, "SEO");
const distDir = path.join(rootDir, "dist");
const publicDir = path.join(rootDir, "public");

const apiBase =
    (process.env.API_URL ||
        process.env.VITE_API_URL ||
        process.env.BACKEND_URL ||
        "")
        .trim()
        .replace(/\/+$/, "");

const devServerUrl = (process.env.VITE_DEV_SERVER_URL || "").trim();
const manifestPath = path.join(distDir, "manifest.json");

function resolveScriptSrc() {
    if (devServerUrl) {
        try {
            return new URL("/src/main.jsx", devServerUrl).toString();
        } catch {
            return `${devServerUrl.replace(/\/+$/, "")}/src/main.jsx`;
        }
    }

    if (fs.existsSync(manifestPath)) {
        try {
            const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
            const entry = manifest["src/main.jsx"] || manifest["index.html"];
            if (entry?.file) {
                return `/${entry.file}`;
            }
        } catch {
            // Fall back to the default Vite entry.
        }
    }

    return "/src/main.jsx";
}

const scriptSrc = resolveScriptSrc();

app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader(
        "Permissions-Policy",
        "camera=(), microphone=(), geolocation=(), payment=()"
    );
    res.setHeader(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    next();
});

app.engine(
    "hbs",
    engine({
        extname: ".hbs",
        defaultLayout: false,
        layoutsDir: seoDir,
        partialsDir: seoDir,
    })
);
app.set("view engine", "hbs");
app.set("views", seoDir);

if (fs.existsSync(publicDir)) {
    app.use(
        express.static(publicDir, {
            etag: false,
            lastModified: false,
            maxAge: 0,
            setHeaders(res) {
                res.setHeader(
                    "Cache-Control",
                    "no-store, no-cache, must-revalidate, proxy-revalidate"
                );
            },
        })
    );
}
if (fs.existsSync(distDir)) {
    app.use(
        express.static(distDir, {
            etag: false,
            lastModified: false,
            index: false,
            maxAge: 0,
            setHeaders(res) {
                res.setHeader(
                    "Cache-Control",
                    "no-store, no-cache, must-revalidate, proxy-revalidate"
                );
            },
        })
    );
}

function renderPage(res, view, data = {}) {
    res.render(view, {
        appHtml: "",
        scriptSrc,
        ...data,
    });
}

const leaderboardViews = new Map([
    ["solo-shuffle", "leaderboard-solo-shuffle"],
    ["2v2", "leaderboard-2v2"],
    ["3v3", "leaderboard-3v3"],
    ["blitz", "leaderboard-blitz"],
    ["rated-bg", "leaderboard-rated-bg"],
]);

app.get("/", (req, res) => renderPage(res, "home"));
app.get("/download", (req, res) => renderPage(res, "download"));
app.get("/joinGuild", (req, res) => renderPage(res, "joinGuild"));
app.get("/posts", (req, res) => renderPage(res, "posts"));
app.get("/roster", (req, res) => renderPage(res, "roster"));
app.get("/leaderboard/:slug?", (req, res) => {
    const view = leaderboardViews.get(req.params.slug || "") || "leaderboard";
    renderPage(res, view);
});

function safeJsonStringify(value) {
    return JSON.stringify(value).replace(/</g, "\\u003c");
}

function buildCharSeo(char, canonical) {
    if (!char) {
        return buildCharNotFoundSeo(canonical);
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

    const title = `${name} - ${spec} ${charClass} (${rating} ${displayBracket}) | PvP Scalpel`.replace(
        /\s+/g,
        " "
    ).trim();

    const descriptionParts = [
        `${name}${level ? `, level ${level}` : ""}${
            faction ? ` ${faction}` : ""
        }${charClass ? ` ${charClass}` : ""}${
            realm ? ` on ${realm}` : ""
        }${region ? ` (${region})` : ""}${spec ? ` - ${spec} specialization.` : "."}`,
        `Currently rated ${rating} in ${displayBracket}, member of ${guild}.`,
        "View detailed gear, talents, achievements, and performance history on PvP Scalpel.",
    ];

    const description = descriptionParts.join(" ").replace(/\s+/g, " ").trim();

    const image =
        char?.media?.charImg ||
        char?.media?.avatar ||
        "https://pvpscalpel.com/logo/logo_resized.png";

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

function buildCharNotFoundSeo(canonical) {
    const title = "Character Not Found | PvP Scalpel";
    const description =
        "We couldn't find that character. Check the realm, server, and name, then try again.";
    const image = "https://pvpscalpel.com/logo/logo_resized.png";

    return {
        title,
        description,
        canonical,
        ogTitle: title,
        ogDescription: description,
        ogType: "website",
        ogUrl: canonical,
        ogImage: image,
        twitterCard: "summary_large_image",
        twitterTitle: title,
        twitterDescription: description,
        twitterImage: image,
    };
}

app.get("/check/:server/:realm/:name", async (req, res) => {
    const { server, realm, name } = req.params;
    const canonical = `https://pvpscalpel.com/check/${encodeURIComponent(
        server
    )}/${encodeURIComponent(realm)}/${encodeURIComponent(name)}`;

    if (!apiBase) {
        return renderPage(res, "char", buildCharNotFoundSeo(canonical));
    }

    try {
        const endpoint = `${apiBase}/checkCharacter/${encodeURIComponent(
            server
        )}/${encodeURIComponent(realm)}/${encodeURIComponent(name)}`;
        const response = await fetch(endpoint, {
            headers: {
                "600": "BasicPass",
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            res.status(response.status);
            return renderPage(res, "char", buildCharNotFoundSeo(canonical));
        }

        const contentType = response.headers.get("content-type") || "";
        const data = contentType.includes("application/json")
            ? await response.json()
            : null;

        if (!data || data?.errorMSG) {
            res.status(404);
            return renderPage(res, "char", buildCharNotFoundSeo(canonical));
        }

        return renderPage(res, "char", buildCharSeo(data, canonical));
    } catch (error) {
        res.status(500);
        return renderPage(res, "char", buildCharNotFoundSeo(canonical));
    }
});

app.get("*", (req, res) => {
    const indexPath = path.join(distDir, "index.html");
    if (fs.existsSync(indexPath)) {
        return res.sendFile(indexPath);
    }
    return renderPage(res, "home");
});

const port = Number(process.env.PORT) || 4173;
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});
