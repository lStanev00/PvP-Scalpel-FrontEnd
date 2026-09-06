const CONTENT_ROOT = "https://bucket.pvpscalpel.com/pvp-scalpel-frontend/";
const relativeTime = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
const compactNumber = new Intl.NumberFormat(undefined, {
    notation: "compact",
    maximumFractionDigits: 1,
});

/**
 * @typedef {string | number | { _id?: string | number, id?: string | number, slug?: string, name?: string } | null} VideoBracketInput
 * @typedef {import("./storageOperations/gameData.js").GameBracket} GameBracket
 * @typedef {{ timestamp: number, value: string, exact: string, label: string }} VideoDate
 * @typedef {import("../components/VideoCard/VideoCard.jsx").VideoCardData & { sourceIndex: number, username: string, bracket: { key: string, name: string }, date: VideoDate | null }} NormalizedVideo
 */

/**
 * Raw API video metadata consumed by the mapper.
 * @typedef {object} VideoMetadata
 * @property {string | number} [_id] Entries with a missing or falsy ID are skipped.
 * @property {string | null} [title]
 * @property {{ username?: string | null } | null} [author]
 * @property {{ thumbnail?: string | null } | null} [manifest]
 * @property {VideoBracketInput} [bracket]
 * @property {string | number | null} [views]
 * @property {string | number | null} [createdAt] Date string or epoch milliseconds.
 */

/**
 * Maps API metadata to shared video-card values using supplied game brackets.
 * Non-array input produces an empty list. Dated videos come first, newest-first;
 * ties and undated videos retain their input order. Input objects are not mutated.
 * Pure mapping utility; React callers own memoization and cache subscriptions.
 *
 * @param {Array<VideoMetadata | null | undefined> | null | undefined} videosMeta
 * @param {GameBracket[] | null} [brackets=[]] Missing cache is treated as an empty array.
 * @returns {NormalizedVideo[]} Display-ready cards with resolved thumbnail URLs.
 */
export default function mappedVideos(videosMeta, brackets = []) {
    return normalizeVideos(
        Array.isArray(videosMeta) ? videosMeta : [],
        Array.isArray(brackets) ? brackets : [],
    );
}

/**
 * Normalizes eligible entries and sorts them by valid creation date.
 * @param {Array<VideoMetadata | null | undefined>} videos
 * @param {GameBracket[]} brackets Cached bracket definitions; requires an array.
 * @returns {NormalizedVideo[]}
 */
function normalizeVideos(videos, brackets) {
    const normalized = videos.flatMap((entry, index) => {
        if (!entry?._id) return [];

        const date = getRelativeDate(entry.createdAt);

        return [
            {
                id: String(entry._id),
                sourceIndex: index,
                title:
                    typeof entry.title === "string" && entry.title.trim()
                        ? entry.title.trim()
                        : "Untitled video",
                username:
                    typeof entry.author?.username === "string" &&
                    entry.author.username.trim()
                        ? entry.author.username.trim()
                        : "Anonymous",
                thumbnail: buildPath(entry?.manifest?.thumbnail),
                bracket: getBracketDetails(entry?.bracket, brackets),
                views: getViewLabel(entry?.views),
                date,
            },
        ];
    });
    const dated = normalized
        .filter((entry) => entry.date)
        .sort((a, b) => b.date.timestamp - a.date.timestamp || a.sourceIndex - b.sourceIndex);
    const undated = normalized.filter((entry) => !entry.date);

    return [...dated, ...undated];
}

/**
 * Resolves a thumbnail path against the content bucket, preserving absolute URLs.
 * @param {string | null | undefined} path
 * @returns {string | null} Resolved URL, or null for blank/unresolvable input.
 */
function buildPath(path) {
    if (typeof path !== "string" || !path.trim()) return null;

    try {
        return new URL(path, CONTENT_ROOT).href;
    } catch {
        return null;
    }
}

/**
 * Builds localized relative/exact date labels and a timestamp for sorting.
 * The returned value field is an ISO date suitable for a time element.
 * @param {string | number | null | undefined} value Date string or epoch milliseconds.
 * @returns {VideoDate | null} Date metadata, or null for missing/invalid dates.
 */
function getRelativeDate(value) {
    if ((typeof value !== "string" && typeof value !== "number") || value === "") return null;

    const date = new Date(value);
    const timestamp = date.getTime();
    if (!Number.isFinite(timestamp)) return null;

    const difference = timestamp - Date.now();
    const absoluteDifference = Math.abs(difference);
    const intervals = [
        ["year", 365 * 24 * 60 * 60 * 1000],
        ["month", 30 * 24 * 60 * 60 * 1000],
        ["day", 24 * 60 * 60 * 1000],
        ["hour", 60 * 60 * 1000],
        ["minute", 60 * 1000],
    ];
    const interval = intervals.find(([, milliseconds]) => absoluteDifference >= milliseconds);

    return {
        timestamp,
        value: date.toISOString(),
        exact: date.toLocaleString(),
        label: interval
            ? relativeTime.format(Math.round(difference / interval[1]), interval[0])
            : "just now",
    };
}

/**
 * Resolves a bracket ID, slug or populated object to its filter key and label.
 * Bracket 0 is "PvP-S Video"; unresolved brackets share the "Other" filter.
 * @param {VideoBracketInput | undefined} value
 * @param {GameBracket[]} brackets Cached bracket definitions; requires an array.
 * @returns {{ key: string, name: string }}
 */
function getBracketDetails(value, brackets) {
    const bracketObject = value && typeof value === "object" ? value : null;
    const rawBracket = bracketObject?._id ?? bracketObject?.id ?? bracketObject?.slug ?? value;
    const normalizedRaw = rawBracket === null || rawBracket === undefined ? "" : String(rawBracket);
    const matchingBracket = brackets.find((entry) => {
        return (
            String(entry?._id) === normalizedRaw ||
            (entry?.slug && String(entry.slug) === normalizedRaw)
        );
    });
    const objectName = typeof bracketObject?.name === "string" ? bracketObject.name.trim() : "";
    const matchingName =
        typeof matchingBracket?.name === "string" ? matchingBracket.name.trim() : "";
    const isGeneralVideo = normalizedRaw === "0";
    const name = isGeneralVideo ? "PvP-S Video" : objectName || matchingName || "Other";
    const isKnown = Boolean(isGeneralVideo || objectName || matchingName);
    const identity = normalizedRaw || name.toLowerCase();

    return {
        key: isKnown ? `bracket:${identity}` : "other",
        name,
    };
}

/**
 * Formats a non-negative view count with a localized compact number and label.
 * @param {string | number | null | undefined} value Numeric counts/strings, including zero.
 * @returns {string | null} Formatted label, or null for missing/invalid counts.
 */
function getViewLabel(value) {
    if (typeof value !== "string" && typeof value !== "number") return null;
    if (typeof value === "string" && !value.trim()) return null;

    const views = Number(value);
    if (!Number.isFinite(views) || views < 0) return null;

    return `${compactNumber.format(views)} ${views === 1 ? "view" : "views"}`;
}
