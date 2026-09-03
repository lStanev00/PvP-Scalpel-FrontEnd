import { useContext, useEffect, useMemo, useState } from "react";
import { FiVideo } from "react-icons/fi";
import { Link } from "react-router-dom";

import { UserContext } from "../hooks/ContextVariables.jsx";
import Style from "../Styles/modular/ScalpelTV.module.css";
import {
    GAME_DATA_STORAGE_EVENT,
    getGameBrackets,
} from "../helpers/storageOperations/gameData.js";
import { publicAssetUrl } from "../helpers/assets.js";

const CONTENT_ROOT = "https://bucket.pvpscalpel.com/pvp-scalpel-frontend/";
const VIEW_ICON_URL = publicAssetUrl("user_action_icons/View_Count.png");
const SKELETON_ITEMS = Array.from({ length: 8 }, (_, index) => index);
const compactNumber = new Intl.NumberFormat(undefined, {
    notation: "compact",
    maximumFractionDigits: 1,
});
const relativeTime = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

function buildPath(path) {
    if (typeof path !== "string" || !path.trim()) return null;

    try {
        return new URL(path, CONTENT_ROOT).href;
    } catch {
        return null;
    }
}

function getViewLabel(value) {
    if (value === null || value === undefined || value === "") return null;

    const views = Number(value);
    if (!Number.isFinite(views) || views < 0) return null;

    return `${compactNumber.format(views)} ${views === 1 ? "view" : "views"}`;
    // return `${compactNumber.format(views)}`;
}

function getRelativeDate(value) {
    if (value === null || value === undefined || value === "") return null;

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
        value: String(value),
        exact: date.toLocaleString(),
        label: interval
            ? relativeTime.format(Math.round(difference / interval[1]), interval[0])
            : "just now",
    };
}

function getBracketDetails(value, brackets) {
    const bracketObject = value && typeof value === "object" ? value : null;
    const rawBracket = bracketObject?._id ?? bracketObject?.id ?? bracketObject?.slug ?? value;
    const normalizedRaw = rawBracket === null || rawBracket === undefined
        ? ""
        : String(rawBracket);
    const matchingBracket = brackets.find((entry) => {
        return (
            String(entry?._id) === normalizedRaw ||
            (entry?.slug && String(entry.slug) === normalizedRaw)
        );
    });
    const objectName =
        typeof bracketObject?.name === "string" ? bracketObject.name.trim() : "";
    const matchingName =
        typeof matchingBracket?.name === "string" ? matchingBracket.name.trim() : "";
    const isGeneralVideo = normalizedRaw === "0";
    const name = isGeneralVideo
        ? "PvP-S Video"
        : objectName || matchingName || "Other";
    const isKnown = Boolean(isGeneralVideo || objectName || matchingName);
    const identity = normalizedRaw || name.toLowerCase();

    return {
        key: isKnown ? `bracket:${identity}` : "other",
        name,
    };
}

function normalizeVideos(videos, brackets) {
    const normalized = videos.flatMap((entry, index) => {
        if (!entry?._id) return [];

        const date = getRelativeDate(entry.createdAt);

        return [{
            id: String(entry._id),
            sourceIndex: index,
            title: entry?.title?.trim() || "Untitled video",
            thumbnail: buildPath(entry?.manifest?.thumbnail),
            bracket: getBracketDetails(entry?.bracket, brackets),
            views: getViewLabel(entry?.views),
            date,
        }];
    });
    const dated = normalized
        .filter((entry) => entry.date)
        .sort((a, b) => b.date.timestamp - a.date.timestamp || a.sourceIndex - b.sourceIndex);
    const undated = normalized.filter((entry) => !entry.date);

    return [...dated, ...undated];
}

export default function ScalpelTV() {
    const { httpFetch } = useContext(UserContext);
    const [videosMeta, setVideosMeta] = useState(null);
    const [error, setError] = useState("");
    const [activeBracket, setActiveBracket] = useState("all");
    const [retryCount, setRetryCount] = useState(0);
    const [brackets, setBrackets] = useState(() => {
        const initialBrackets = getGameBrackets();
        return Array.isArray(initialBrackets) ? initialBrackets : [];
    });

    useEffect(() => {
        const syncBrackets = () => {
            const nextBrackets = getGameBrackets();
            setBrackets(Array.isArray(nextBrackets) ? nextBrackets : []);
        };

        window.addEventListener(GAME_DATA_STORAGE_EVENT, syncBrackets);
        return () => window.removeEventListener(GAME_DATA_STORAGE_EVENT, syncBrackets);
    }, []);

    useEffect(() => {
        let cancelled = false;

        const retrieveVideoMeta = async () => {
            try {
                const request = await httpFetch("/videos");
                if (cancelled) return;

                if (request.status === 200 && Array.isArray(request.data)) {
                    setVideosMeta(request.data);
                    return;
                }

                setVideosMeta([]);
                setError("The video feed could not be loaded right now.");
            } catch {
                if (cancelled) return;
                setVideosMeta([]);
                setError("The video feed could not be loaded right now.");
            }
        };

        retrieveVideoMeta();

        return () => {
            cancelled = true;
        };
    }, [httpFetch, retryCount]);

    const videos = useMemo(
        () => normalizeVideos(Array.isArray(videosMeta) ? videosMeta : [], brackets),
        [brackets, videosMeta],
    );
    const bracketFilters = useMemo(() => {
        const representedBrackets = new Map();

        videos.forEach((video) => {
            if (!representedBrackets.has(video.bracket.key)) {
                representedBrackets.set(video.bracket.key, video.bracket);
            }
        });

        return [...representedBrackets.values()];
    }, [videos]);
    const selectedBracket = bracketFilters.some((bracket) => bracket.key === activeBracket)
        ? activeBracket
        : "all";
    const visibleVideos = selectedBracket === "all"
        ? videos
        : videos.filter((video) => video.bracket.key === selectedBracket);

    return (
        <section className={Style.page} aria-labelledby="scalpel-tv-title">
            <h1 id="scalpel-tv-title" className={Style.visuallyHidden}>
                Scalpel TV videos
            </h1>

            {videosMeta === null && (
                <div className={Style.loading} role="status" aria-live="polite">
                    <span className={Style.visuallyHidden}>Loading videos</span>
                    <ul className={Style.grid} aria-hidden="true">
                        {SKELETON_ITEMS.map((item) => (
                            <li className={Style.skeletonCard} key={item}>
                                <span className={Style.skeletonThumbnail} />
                                <span className={`${Style.skeletonLine} ${Style.skeletonTitle}`} />
                                <span className={`${Style.skeletonLine} ${Style.skeletonMeta}`} />
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {videosMeta !== null && error && (
                <div className={Style.status} role="alert">
                    <FiVideo aria-hidden="true" />
                    <h2>Feed unavailable</h2>
                    <p>{error}</p>
                    <button
                        type="button"
                        onClick={() => {
                            setVideosMeta(null);
                            setError("");
                            setRetryCount((count) => count + 1);
                        }}
                    >
                        Try again
                    </button>
                </div>
            )}

            {videosMeta !== null && !error && videos.length === 0 && (
                <div className={Style.status} role="status">
                    <FiVideo aria-hidden="true" />
                    <h2>No videos yet</h2>
                    <p>New community uploads will appear here.</p>
                </div>
            )}

            {videos.length > 0 && !error && (
                <div className={Style.library}>
                    <div
                        className={Style.filters}
                        role="toolbar"
                        aria-label="Filter videos by bracket"
                    >
                        <button
                            type="button"
                            className={`${Style.filterButton} ${
                                selectedBracket === "all" ? Style.activeFilter : ""
                            }`}
                            aria-pressed={selectedBracket === "all"}
                            onClick={() => setActiveBracket("all")}
                        >
                            All
                        </button>

                        {bracketFilters.map((bracket) => (
                            <button
                                type="button"
                                className={`${Style.filterButton} ${
                                    selectedBracket === bracket.key ? Style.activeFilter : ""
                                }`}
                                aria-pressed={selectedBracket === bracket.key}
                                onClick={() => setActiveBracket(bracket.key)}
                                key={bracket.key}
                            >
                                {bracket.name}
                            </button>
                        ))}
                    </div>

                    <ul className={Style.grid}>
                        {visibleVideos.map((video) => (
                            <li className={Style.card} key={video.id}>
                                <Link
                                    className={Style.cardLink}
                                    to={`/watch/${encodeURIComponent(video.id)}`}
                                >
                                    <div className={Style.thumbnail}>
                                        {video.thumbnail ? (
                                            <img
                                                src={video.thumbnail}
                                                alt=""
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        ) : (
                                            <span className={Style.thumbnailFallback}>
                                                <FiVideo aria-hidden="true" />
                                            </span>
                                        )}
                                    </div>

                                    <div className={Style.cardBody}>
                                        <h2>{video.title}</h2>
                                        <p className={Style.metadata}>
                                            <span title="Views count">{video.bracket.name}</span>
                                            {video.views && (
                                                <span className={Style.views}>
                                                    <img src={VIEW_ICON_URL} alt="Views icon" aria-hidden="true" />
                                                    {video.views}
                                                    
                                                </span>
                                            )}
                                            {video.date && (
                                                <time
                                                    dateTime={video.date.value}
                                                    title={video.date.exact}
                                                    aria-label={`${video.date.label}, ${video.date.exact}`}
                                                >
                                                    {video.date.label}
                                                </time>
                                            )}
                                        </p>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </section>
    );
}
