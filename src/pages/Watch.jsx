import { useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import { UserContext } from "../hooks/ContextVariables.jsx";
import VideoPlayer from "../components/VideoPlayer/VideoPlayer.jsx";
import SuggestedClips from "../components/SuggestedClips/SuggestedClips.jsx";
import VideoShareDialog from "../components/VideoShareDialog/VideoShareDialog.jsx";
import UserDataContainer from "../components/checkDetails/UserDataContainer.jsx";
import Loading from "../components/loading.jsx";
import Comments from "../components/checkDetails/Comments.jsx";
import { CommentsProvider } from "../components/checkDetails/CommentsContext.js";
import Style from "../Styles/modular/Watch.module.css";
import mappedVideos from "../helpers/normalizeVideoObj.js";
import { GAME_DATA_STORAGE_EVENT, getGameBrackets } from "../helpers/storageOperations/gameData.js";
import NotFound from "./NotFound.jsx";
import SEOVideo, { SEOUnavailableVideo } from "../SEO/SEOVideo.jsx";

export default function Watch() {
    const { videoID } = useParams();
    const { httpFetch } = useContext(UserContext);
    const [videoDoc, setVideoDoc] = useState(undefined);
    const [brackets, setBrackets] = useState(getGameBrackets);
    const [shareTime, setShareTime] = useState(null);
    const [searchParams] = useSearchParams();
    const timestamp = searchParams.get("t");
    const mediaRef = useRef(null);
    const appliedTimestamp = useRef(null);
    const suggestedVideos = useMemo(
        () => mappedVideos(videoDoc?.suggestedList, brackets),
        [videoDoc?.suggestedList, brackets],
    );
    const displayVideo = useMemo(
        () => mappedVideos(videoDoc?._id ? [videoDoc] : [], brackets)[0],
        [videoDoc, brackets],
    );
    const CONTENT_ROOT = "https://bucket.pvpscalpel.com/pvp-scalpel-frontend/";
    function buildPath(path) {
        if (typeof path !== "string" || !path.trim()) return null;

        try {
            return new URL(path, CONTENT_ROOT).href;
        } catch {
            return null;
        }
    }

    useEffect(() => {
        const syncBrackets = () => setBrackets(getGameBrackets());
        window.addEventListener(GAME_DATA_STORAGE_EVENT, syncBrackets);
        return () => window.removeEventListener(GAME_DATA_STORAGE_EVENT, syncBrackets);
    }, []);

    const applyTimestamp = useCallback(
        (media) => {
            // Wait for this video's metadata; query changes must not seek the previous clip.
            if (String(videoDoc?._id) !== videoID || !media || media.readyState < 1) return;
            const requestKey = `${videoID}:${timestamp ?? ""}`;
            if (appliedTimestamp.current === requestKey) return;
            appliedTimestamp.current = requestKey;

            if (!/^\d+$/.test(timestamp ?? "")) return;
            const seconds = Number(timestamp);
            if (
                !Number.isSafeInteger(seconds) ||
                !Number.isFinite(media.duration) ||
                media.duration <= 0
            )
                return;

            media.currentTime = Math.min(seconds, Math.max(0, Math.ceil(media.duration) - 1));
        },
        [videoDoc?._id, videoID, timestamp],
    );

    useEffect(() => {
        applyTimestamp(mediaRef.current);
    }, [applyTimestamp]);

    useEffect(() => {
        let cancelled = false;

        const retriveVideo = async () => {
            setVideoDoc(undefined);
            setShareTime(null);
            appliedTimestamp.current = null;
            const response = await httpFetch(`/video/${videoID}`);
            if (cancelled) return;

            if (response.status === 200 && response.data?.isPrivate) {
                setVideoDoc(403);
            } else if (response.status === 200 && response.data?.censored) {
                setVideoDoc(451);
            } else if (response.status === 200 && response.data?._id) {
                setVideoDoc(response.data);
            } else if (response.status === 403) {
                setVideoDoc(403);
            } else if (response.status === 451) {
                setVideoDoc(451);
            } else if (response.status === 404) {
                setVideoDoc(404);
            } else if (response.status === 500) {
                setVideoDoc(500);
            } else {
                console.warn(response);
                setVideoDoc(500);
            }
        };

        retriveVideo();

        return () => {
            cancelled = true;
        };
    }, [httpFetch, videoID]);

    if (videoDoc && typeof videoDoc !== "number") {
        const title = displayVideo?.title || "Untitled video";
        const contextWindow = {
            data: {
                ...videoDoc,
                checkedCount: videoDoc.views ?? videoDoc.checkedCount ?? 0,
            },
            location: `/watch/${videoDoc._id}`,
        };

        return (
            <CommentsProvider initialPosts={videoDoc.comments} entryID={videoDoc._id}>
                <SEOVideo video={displayVideo} />
                <div className={Style.note}></div>
                <article
                    className={`${Style.page} ${suggestedVideos.length > 0 ? Style.withSuggestions : ""}`}
                    aria-labelledby="watch-video-title">
                    <div className={Style.entry}>
                        <VideoPlayer
                            key={videoDoc._id}
                            src={buildPath(videoDoc.manifest.video)}
                            poster={displayVideo?.thumbnail}
                            title={title}
                            brackedId={videoDoc.bracket?._id ?? videoDoc.bracket ?? 0}
                            mediaRef={mediaRef}
                            onLoadedMetadata={(event) => applyTimestamp(event.currentTarget)}
                        />
                        <section className={Style.details} aria-labelledby="watch-video-title">
                            <header className={Style.header}>
                                <h1 id="watch-video-title" className={Style.title}>
                                    {title}
                                </h1>
                            </header>
                            <VideoDescription key={videoID} description={videoDoc.description} />
                            <UserDataContainer
                                contextWindow={contextWindow}
                                variant="watch"
                                onShare={(event) => {
                                    event.currentTarget.focus();
                                    setShareTime(Math.floor(mediaRef.current?.currentTime || 0));
                                }}
                            />
                            <Comments variant="watch" />
                        </section>
                    </div>
                    <SuggestedClips videos={suggestedVideos} />
                </article>
                {shareTime !== null && (
                    <VideoShareDialog
                        key={videoID}
                        videoID={videoID}
                        currentTime={shareTime}
                        onClose={() => setShareTime(null)}
                    />
                )}
            </CommentsProvider>
        );
    }

    if (typeof videoDoc === "number") {
        return (
            <>
                <SEOUnavailableVideo videoID={videoID} />
                <NotFound manageSEO={false} />
            </>
        );
    }

    return <Loading />;
}

function getDescriptionPreview(text) {
    const firstLines = text.split("\n").slice(0, 3).join("\n");
    const characters = Array.from(firstLines);
    if (characters.length <= 240) return firstLines.trimEnd();

    const preview = characters.slice(0, 240).join("");
    const endsAtWordBoundary = /\s/.test(characters[240]);
    return (endsAtWordBoundary ? preview : preview.replace(/\s+\S*$/, "")).trimEnd();
}

/* eslint-disable react/prop-types -- Description is validated as plain text below. */
function VideoDescription({ description }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const descriptionID = useId();
    const text = typeof description === "string" ? description.replace(/\r\n?/g, "\n").trim() : "";

    if (!text) return null;

    const preview = getDescriptionPreview(text);
    const isShortened = preview.length < text.length;

    return (
        <section className={Style.description} aria-label="Video description">
            <p id={descriptionID} className={Style.descriptionText}>
                {isExpanded || !isShortened ? text : `${preview}…`}
            </p>
            {isShortened && (
                <button
                    type="button"
                    className={Style.descriptionToggle}
                    aria-expanded={isExpanded}
                    aria-controls={descriptionID}
                    onClick={() => setIsExpanded((expanded) => !expanded)}>
                    {isExpanded ? "Show less" : "Show more"}
                </button>
            )}
        </section>
    );
}
/* eslint-enable react/prop-types */
