import express from "express";
import { engine } from "express-handlebars";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.disable("x-powered-by");

const rootDir = __dirname;
const seoDir = path.join(rootDir, "SEO");
const distDir = path.join(rootDir, "dist");

const apiBase = ("http://" + process.env.API_URL || "").trim().replace(/\/+$/, "");
const manifestPath = path.join(distDir, "manifest.json");
const indexPath = path.join(distDir, "index.html");

const LOG_LEVEL = (process.env.LOG_LEVEL || "warn").toLowerCase();
const LOG_REQUEST_HEADERS = process.env.LOG_REQUEST_HEADERS === "true";
const LOG_REQUESTS = (process.env.LOG_REQUESTS || "errors").toLowerCase();
const SLOW_REQUEST_MS = Number(process.env.SLOW_REQUEST_MS) || 1500;
const levelRank = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
};

function shouldLog(level) {
    const current = levelRank[LOG_LEVEL] ?? levelRank.info;
    const target = levelRank[level] ?? levelRank.info;
    return target <= current;
}

function log(level, message, meta = {}) {
    if (!shouldLog(level)) return;
    const payload = {
        level,
        message,
        time: new Date().toISOString(),
        ...meta,
    };
    const line = JSON.stringify(payload);
    if (level === "error") {
        console.error(line);
    } else if (level === "warn") {
        console.warn(line);
    } else {
        console.log(line);
    }
}

function newRequestId() {
    try {
        return randomUUID();
    } catch {
        return `${Date.now().toString(36)}-${Math.random()
            .toString(36)
            .slice(2, 10)}`;
    }
}

function extractBuildAssets() {
    if (!fs.existsSync(indexPath)) {
        log("warn", "build.index.missing", { indexPath });
        return {
            headTags: "",
            scriptTag: "",
            scriptSrc: "",
        };
    }

    try {
        const html = fs.readFileSync(indexPath, "utf-8");
        const headTags = [];

        const preloadMatches =
            html.match(/<link[^>]+rel="modulepreload"[^>]*>/gi) || [];
        const styleMatches =
            html.match(/<link[^>]+rel="stylesheet"[^>]*>/gi) || [];

        headTags.push(...preloadMatches, ...styleMatches);

        const scriptMatch = html.match(
            /<script[^>]*type="module"[^>]*src="[^"]+"[^>]*>\s*<\/script>/i
        );
        const scriptTag = scriptMatch?.[0] || "";

        const srcMatch = scriptTag.match(/src="([^"]+)"/i);
        const scriptSrc = srcMatch?.[1] || "";

        return {
            headTags: headTags.join("\n"),
            scriptTag,
            scriptSrc,
        };
    } catch {
        log("error", "build.index.read_failed", { indexPath });
        return {
            headTags: "",
            scriptTag: "",
            scriptSrc: "",
        };
    }
}

const buildAssets = extractBuildAssets();

function resolveScriptSrc() {
    if (fs.existsSync(manifestPath)) {
        try {
            const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
            const entry = manifest["src/main.jsx"] || manifest["index.html"];
            if (entry?.file) {
                return `/${entry.file}`;
            }
        } catch {
            log("warn", "build.manifest.read_failed", { manifestPath });
            // Fall back to the default Vite entry.
        }
    }

    if (buildAssets.scriptSrc) {
        return buildAssets.scriptSrc;
    }

    return "";
}

const scriptSrc = resolveScriptSrc();
log("info", "server.assets", {
    distExists: fs.existsSync(distDir),
    manifestExists: fs.existsSync(manifestPath),
    indexExists: fs.existsSync(indexPath),
    scriptSrc: scriptSrc || "none",
    headTags: Boolean(buildAssets.headTags),
});

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

app.use((req, res, next) => {
    const requestId = newRequestId();
    const start = process.hrtime.bigint();
    req.requestId = requestId;

    const meta = {
        id: requestId,
        method: req.method,
        path: req.originalUrl,
        ip: req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim() ||
            req.socket?.remoteAddress,
        ua: req.headers["user-agent"],
        referer: req.headers.referer,
    };

    if (LOG_REQUEST_HEADERS) {
        meta.headers = req.headers;
    }

    if (LOG_REQUESTS === "all" && shouldLog("info")) {
        log("info", "request.start", meta);
    }

    res.on("finish", () => {
        const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
        const payload = {
            id: requestId,
            status: res.statusCode,
            durationMs: Math.round(durationMs),
            length: res.getHeader("content-length") || undefined,
            method: req.method,
            path: req.originalUrl,
        };

        if (LOG_REQUESTS === "none") {
            return;
        }

        if (res.statusCode >= 500) {
            log("error", "request.end", payload);
            return;
        }

        if (res.statusCode >= 400) {
            log("warn", "request.end", payload);
            return;
        }

        if (durationMs >= SLOW_REQUEST_MS) {
            log("warn", "request.slow", payload);
            return;
        }

        if (LOG_REQUESTS === "all" && shouldLog("info")) {
            log("info", "request.end", payload);
        }
    });

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
        headExtra: buildAssets.headTags,
        bodyScripts: buildAssets.scriptTag,
        scriptSrc,
        ...data,
    });
    log("debug", "render.page", {
        id: res.req?.requestId,
        view,
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
app.get("/desktop-beta", (req, res) => {
    res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
    renderPage(res, "desktop-beta", {
        title: "PvP Scalpel Desktop — Closed Beta",
        description:
            "Private closed beta information for the PvP Scalpel Desktop companion application.",
        canonical: "https://pvpscalpel.com/desktop-beta",
        robots: "noindex, nofollow, noarchive",
    });
});
app.get("/leaderboard", (req, res) => {
    renderPage(res, "leaderboard");
});

app.get("/leaderboard/:slug", (req, res) => {
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
        log("warn", "character.api_base_missing", {
            id: req.requestId,
        });
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
            log("warn", "character.fetch_failed", {
                id: req.requestId,
                endpoint,
                status: response.status,
            });
            res.status(response.status);
            return renderPage(res, "char", buildCharNotFoundSeo(canonical));
        }

        const contentType = response.headers.get("content-type") || "";
        const data = contentType.includes("application/json")
            ? await response.json()
            : null;

        if (!data || data?.errorMSG) {
            log("warn", "character.not_found", {
                id: req.requestId,
                endpoint,
            });
            res.status(404);
            return renderPage(res, "char", buildCharNotFoundSeo(canonical));
        }

        log("info", "character.found", {
            id: req.requestId,
            name: data?.name,
            server,
            realm,
        });
        return renderPage(res, "char", buildCharSeo(data, canonical));
    } catch (error) {
        log("error", "character.fetch_error", {
            id: req.requestId,
            error: error?.message || "unknown",
        });
        res.status(500);
        return renderPage(res, "char", buildCharNotFoundSeo(canonical));
    }
});

app.use((req, res) => {
    const indexPath = path.join(distDir, "index.html");
    if (fs.existsSync(indexPath)) {
        return res.sendFile(indexPath);
    }
    return renderPage(res, "home");
});

const port = Number(process.env.PORT) || 4173;
app.listen(port, () => {
    log("info", "server.start", {
        port,
        apiBase: apiBase || "missing",
        node: process.version,
    });
});

app.use((err, req, res, next) => {
    log("error", "server.error", {
        id: req?.requestId,
        error: err?.message || "unknown",
        stack: err?.stack,
    });
    res.status(500).type("text/plain").send("Internal Server Error");
});
