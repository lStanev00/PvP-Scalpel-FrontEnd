import fs from "fs";
import { log } from "./logger.mjs";

export function resolveScriptSrc(manifestPath, buildAssets) {
    if (fs.existsSync(manifestPath)) {
        try {
            const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
            const entry = manifest["src/main.jsx"] || manifest["index.html"];

            if (entry?.file) {
                return `/${entry.file}`;
            }
        } catch {
            log("warn", "build.manifest.read_failed", { manifestPath });
        }
    }

    return buildAssets.scriptSrc || "";
}
