import { useContext, useEffect, useMemo, useState } from "react";
import { FiVideo } from "react-icons/fi";
import VideoCard from "../components/VideoCard/VideoCard.jsx";

import { UserContext } from "../hooks/ContextVariables.jsx";
import Style from "../Styles/modular/ScalpelTV.module.css";
import {
    GAME_DATA_STORAGE_EVENT,
    getGameBrackets,
} from "../helpers/storageOperations/gameData.js";
import mappedVideos from "../helpers/normalizeVideoObj.js";
import SEOTV from "../SEO/SEOTV.jsx";

const SKELETON_ITEMS = Array.from({ length: 8 }, (_, index) => index);


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

    const videos = useMemo(() => mappedVideos(videosMeta, brackets), [videosMeta, brackets]);
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
            <SEOTV></SEOTV>
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
                                <VideoCard video={video} />
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </section>
    );
}
