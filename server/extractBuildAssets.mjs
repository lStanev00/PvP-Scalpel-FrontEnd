import fs from "fs";
import { log } from "./logger.mjs";

const emptyBuildAssets = () => ({
    headTags: "",
    scriptTag: "",
    scriptSrc: "",
});

export function extractBuildAssets(indexPath) {
    if (!fs.existsSync(indexPath)) {
        log("warn", "build.index.missing", { indexPath });
        return emptyBuildAssets();
    }

    try {
        const html = fs.readFileSync(indexPath, "utf-8");
        const preloadMatches =
            html.match(/<link[^>]+rel="modulepreload"[^>]*>/gi) || [];
        const styleMatches =
            html.match(/<link[^>]+rel="stylesheet"[^>]*>/gi) || [];
        const scriptMatch = html.match(
            /<script[^>]*type="module"[^>]*src="[^"]+"[^>]*>\s*<\/script>/i
        );
        const scriptTag = scriptMatch?.[0] || "";
        const srcMatch = scriptTag.match(/src="([^"]+)"/i);

        return {
            headTags: [...preloadMatches, ...styleMatches].join("\n"),
            scriptTag,
            scriptSrc: srcMatch?.[1] || "",
        };
    } catch {
        log("error", "build.index.read_failed", { indexPath });
        return emptyBuildAssets();
    }
}
