export function formatBytes(bytes) {
    if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    return `${(bytes / 1024 ** index).toFixed(index > 1 ? 1 : 0)} ${units[index]}`;
}

export function formatMiB(bytes) {
    if (!Number.isFinite(bytes) || bytes <= 0) return "0 MiB";
    return `${(bytes / (1024 * 1024)).toFixed(2)} MiB`;
}

export function isVideoFile(file) {
    if (file?.type?.startsWith("video/")) return true;
    return /\.(mp4|m4v|mov|webm|avi|mkv|ogv)$/i.test(file?.name || "");
}

export function formatVideoType(source) {
    const mimeType = source?.mimeType || source?.type;
    const filename = source?.originalName || source?.name;

    if (mimeType && mimeType !== "application/octet-stream") return mimeType;
    const extension = filename?.split(".").pop()?.toUpperCase();
    return extension ? `${extension} video` : "Original video";
}
