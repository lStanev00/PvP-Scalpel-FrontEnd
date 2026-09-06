const LOG_LEVEL = (process.env.LOG_LEVEL || "warn").toLowerCase();

const levelRank = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
};

export function shouldLog(level) {
    const current = levelRank[LOG_LEVEL] ?? levelRank.info;
    const target = levelRank[level] ?? levelRank.info;
    return target <= current;
}

export function log(level, message, meta = {}) {
    if (!shouldLog(level)) return;

    const line = JSON.stringify({
        level,
        message,
        time: new Date().toISOString(),
        ...meta,
    });

    if (level === "error") {
        console.error(line);
    } else if (level === "warn") {
        console.warn(line);
    } else {
        console.log(line);
    }
}
