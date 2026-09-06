import express from "express";
import { engine } from "express-handlebars";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { buildSitemap } from "./server/buildSitemap.mjs";
import {
    buildCharNotFoundSeo,
    buildCharSeo,
} from "./server/characterSeo.mjs";
import { createRenderPage } from "./server/createRenderPage.mjs";
import { extractBuildAssets } from "./server/extractBuildAssets.mjs";
import { log } from "./server/logger.mjs";
import { requestLogger } from "./server/requestLogger.mjs";
import { resolveApiBase } from "./server/resolveApiBase.mjs";
import {
    assetUrl,
    resolveAssetBase,
} from "./server/resolveAssetBase.mjs";
import { resolveScriptSrc } from "./server/resolveScriptSrc.mjs";
import { securityHeaders } from "./server/securityHeaders.mjs";
import {
    buildUnavailableVideoSeo,
    buildVideoSeo,
} from "./server/videoSeo.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.disable("x-powered-by");

const rootDir = __dirname;
const seoDir = path.join(rootDir, "SEO");
const distDir = path.join(rootDir, "dist");
const assetBase = resolveAssetBase();
const publicAssetBase = assetUrl(assetBase, "public");
const logoUrl = `${publicAssetBase}/logo/logo_resized.png`;
const assetOrigin = new URL(assetBase).origin;
const apiBase = resolveApiBase();
const manifestPath = path.join(distDir, "manifest.json");
const indexPath = path.join(distDir, "index.html");
const buildAssets = extractBuildAssets(indexPath);
const scriptSrc = resolveScriptSrc(manifestPath, buildAssets);
log("info", "server.assets", {
    distExists: fs.existsSync(distDir),
    manifestExists: fs.existsSync(manifestPath),
    indexExists: fs.existsSync(indexPath),
    scriptSrc: scriptSrc || "none",
    headTags: Boolean(buildAssets.headTags),
});

app.use(securityHeaders);
app.use(requestLogger);

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
const renderPage = createRenderPage({
    buildAssets,
    scriptSrc,
    assetBase,
    publicAssetBase,
    logoUrl,
    assetOrigin,
});

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

app.get("/robots.txt", (req, res) => {
    const robots = `
User-agent: *
Allow: /

Sitemap: https://www.pvpscalpel.com/sitemap.xml
`.trim();

    res.status(200).type("text/plain").send(robots);
});

const lastmod = new Date().toISOString().slice(0, 10); // out of route so it dont lie
app.get("/sitemap.xml", (req, res) => {
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.status(200).type("application/xml").send(buildSitemap(lastmod));
});

app.get("/check/:server/:realm/:name", async (req, res) => {
    req.suppress404Log = true;
    const { server, realm, name } = req.params;
    const canonical = `https://pvpscalpel.com/check/${encodeURIComponent(
        server
    )}/${encodeURIComponent(realm)}/${encodeURIComponent(name)}`;

    if (!apiBase) {
        log("warn", "character.api_base_missing", {
            id: req.requestId,
        });
        return renderPage(
            res,
            "char",
            buildCharNotFoundSeo(canonical, logoUrl)
        );
    }

    try {
        const endpoint = `${apiBase}/checkCharacter/${encodeURIComponent(
            server
        )}/${encodeURIComponent(realm)}/${encodeURIComponent(name)}`;
        const response = await fetch(endpoint, {
            headers: {
                "600": "BasicPass",
                "Content-Type": "application/json",
                "fe-ping": "front-end"
            },
        });

        if (response.status === 404) {
            const title = "Analyze Any Character | PvP Scalpel";
            const description =
                "Analyze any World of Warcraft character on PvP Scalpel. Check ratings, specs, guild data, and PvP performance insights.";

            res.status(200);
            return renderPage(res, "char", {
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
            });
        }

        if (!response.ok) {
            log("warn", "character.fetch_failed", {
                id: req.requestId,
                endpoint,
                status: response.status,
            });
            res.status(response.status);
            return renderPage(
                res,
                "char",
                buildCharNotFoundSeo(canonical, logoUrl)
            );
        }

        const contentType = response.headers.get("content-type") || "";
        const data = contentType.includes("application/json")
            ? await response.json()
            : null;

        if (!data || data?.errorMSG) {
            res.status(200);
            return renderPage(
                res,
                "char",
                buildCharNotFoundSeo(canonical, logoUrl)
            );
        }

        log("info", "character.found", {
            id: req.requestId,
            name: data?.name,
            server,
            realm,
        });
        return renderPage(res, "char", buildCharSeo(data, canonical, logoUrl));
    } catch (error) {
        log("error", "character.fetch_error", {
            id: req.requestId,
            error: error?.message || "unknown",
        });
        res.status(500);
        return renderPage(
            res,
            "char",
            buildCharNotFoundSeo(canonical, logoUrl)
        );
    }
});

app.get("/watch/:videoID", async (req, res) => {
    req.suppress404Log = true;
    const { videoID } = req.params;

    const renderUnavailableVideo = (status) => {
        res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
        res.status(status);
        return renderPage(
            res,
            "watch",
            buildUnavailableVideoSeo(videoID, logoUrl)
        );
    };

    if (!apiBase) {
        log("warn", "video.api_base_missing", {
            id: req.requestId,
        });
        return renderUnavailableVideo(503);
    }

    const endpoint = `${apiBase}/video/${encodeURIComponent(videoID)}`;

    try {
        const response = await fetch(endpoint, {
            headers: {
                "600": "BasicPass",
                "Content-Type": "application/json",
                "fe-ping": "front-end",
            },
        });

        if (!response.ok) {
            log("warn", "video.fetch_failed", {
                id: req.requestId,
                endpoint,
                status: response.status,
            });
            return renderUnavailableVideo(response.status);
        }

        const contentType = response.headers.get("content-type") || "";
        const video = contentType.includes("application/json")
            ? await response.json()
            : null;

        if (!video?._id) {
            log("warn", "video.response_invalid", {
                id: req.requestId,
                endpoint,
            });
            return renderUnavailableVideo(502);
        }

        if (video.isPrivate) {
            return renderUnavailableVideo(403);
        }

        if (video.censored) {
            return renderUnavailableVideo(451);
        }

        return renderPage(
            res,
            "watch",
            buildVideoSeo(video, { assetBase, logoUrl })
        );
    } catch (error) {
        log("error", "video.fetch_error", {
            id: req.requestId,
            endpoint,
            error: error?.message || "unknown",
        });
        return renderUnavailableVideo(502);
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
