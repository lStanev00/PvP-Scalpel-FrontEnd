import { log, shouldLog } from "./logger.mjs";
import { newRequestId } from "./newRequestId.mjs";

const LOG_REQUEST_HEADERS = process.env.LOG_REQUEST_HEADERS === "true";
const LOG_REQUESTS = (process.env.LOG_REQUESTS || "errors").toLowerCase();
const SLOW_REQUEST_MS = Number(process.env.SLOW_REQUEST_MS) || 1500;

export function requestLogger(req, res, next) {
    const requestId = newRequestId();
    const start = process.hrtime.bigint();
    req.requestId = requestId;

    const meta = {
        id: requestId,
        method: req.method,
        path: req.originalUrl,
        ip:
            req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim() ||
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

        if (LOG_REQUESTS === "none") return;

        if (res.statusCode >= 500) {
            log("error", "request.end", payload);
        } else if (res.statusCode === 404 && req.suppress404Log) {
            return;
        } else if (res.statusCode >= 400) {
            log("warn", "request.end", payload);
        } else if (durationMs >= SLOW_REQUEST_MS) {
            log("warn", "request.slow", payload);
        } else if (LOG_REQUESTS === "all" && shouldLog("info")) {
            log("info", "request.end", payload);
        }
    });

    next();
}
