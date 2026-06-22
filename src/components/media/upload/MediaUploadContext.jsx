/* eslint-disable react/prop-types, react-refresh/only-export-components */

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useReducer,
    useRef,
} from "react";
import { splitFileIntoEqualChunks } from "../../../helpers/fileChunking.js";
import { generateVideoThumbnails } from "../../../helpers/mediaProcessing.js";
import { isVideoFile } from "./mediaUploadFormatting.js";

const MediaUploadContext = createContext(null);

const initialState = {
    currentStage: 1,
    title: "",
    description: "",
    characters: [],
    metadataComplete: false,
    videoFile: null,
    videoUrl: "",
    duration: 0,
    preparedVideo: null,
    preparingVideo: false,
    thumbnails: [],
    selectedThumbnail: null,
    generatingThumbnails: false,
    dragActive: false,
    error: "",
    readyMedia: null,
};

function reducer(state, action) {
    switch (action.type) {
        case "error/set":
            return { ...state, error: action.error || "" };
        case "drag/set":
            return { ...state, dragActive: Boolean(action.dragActive) };
        case "stage/open":
            return { ...state, currentStage: action.stage, error: "" };
        case "video/select":
            return {
                ...state,
                currentStage: 1,
                videoFile: action.file,
                duration: 0,
                preparedVideo: null,
                preparingVideo: true,
                thumbnails: [],
                selectedThumbnail: null,
                generatingThumbnails: false,
                metadataComplete: false,
                readyMedia: null,
                error: "",
            };
        case "video/remove":
            return {
                ...initialState,
            };
        case "video/url":
            return { ...state, videoUrl: action.videoUrl || "" };
        case "video/duration":
            return { ...state, duration: action.duration || 0, error: "" };
        case "prepare/start":
            return { ...state, preparedVideo: null, preparingVideo: true };
        case "prepare/success":
            return { ...state, preparedVideo: action.preparedVideo, preparingVideo: false };
        case "prepare/error":
            return {
                ...state,
                preparedVideo: null,
                preparingVideo: false,
                error: action.error || "Unable to prepare video chunks.",
            };
        case "prepare/reset":
            return { ...state, preparedVideo: null, preparingVideo: false };
        case "metadata/title":
            return { ...state, title: action.title, metadataComplete: false, readyMedia: null };
        case "metadata/description":
            return {
                ...state,
                description: action.description,
                metadataComplete: false,
                readyMedia: null,
            };
        case "metadata/characters":
            return {
                ...state,
                characters: action.characters,
                metadataComplete: false,
                readyMedia: null,
            };
        case "metadata/complete":
            return { ...state, metadataComplete: true, readyMedia: null, currentStage: 3 };
        case "thumbnails/clear":
            return {
                ...state,
                thumbnails: [],
                selectedThumbnail: null,
                generatingThumbnails: false,
            };
        case "thumbnails/start":
            return {
                ...state,
                generatingThumbnails: true,
                selectedThumbnail: null,
                error: "",
            };
        case "thumbnails/success":
            return {
                ...state,
                thumbnails: action.thumbnails,
                selectedThumbnail: action.selectedThumbnail || null,
            };
        case "thumbnails/error":
            return {
                ...state,
                thumbnails: [],
                error: action.error || "Unable to generate cover images.",
            };
        case "thumbnails/finish":
            return { ...state, generatingThumbnails: false };
        case "thumbnail/select":
            return {
                ...state,
                selectedThumbnail: action.thumbnail,
                readyMedia: null,
            };
        case "ready/set":
            return { ...state, readyMedia: action.readyMedia };
        default:
            return state;
    }
}

function isLocalObjectUrl(url) {
    return typeof url === "string" && url.startsWith("blob:");
}

export function MediaUploadProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const thumbnailRequestRef = useRef(0);

    useEffect(() => {
        if (!state.videoFile) {
            dispatch({ type: "video/url", videoUrl: "" });
            return undefined;
        }

        const objectUrl = URL.createObjectURL(state.videoFile);
        dispatch({ type: "video/url", videoUrl: objectUrl });
        return () => URL.revokeObjectURL(objectUrl);
    }, [state.videoFile]);

    useEffect(() => {
        if (!state.videoFile) {
            dispatch({ type: "prepare/reset" });
            return undefined;
        }

        let cancelled = false;
        dispatch({ type: "prepare/start" });

        const preparationTimer = window.setTimeout(() => {
            try {
                const preparedVideo = splitFileIntoEqualChunks(state.videoFile);
                if (!cancelled) {
                    dispatch({ type: "prepare/success", preparedVideo });
                }
            } catch (preparationError) {
                if (!cancelled) {
                    dispatch({
                        type: "prepare/error",
                        error:
                            preparationError.message
                            || "Unable to prepare video chunks.",
                    });
                }
            }
        }, 0);

        return () => {
            cancelled = true;
            window.clearTimeout(preparationTimer);
        };
    }, [state.videoFile]);

    useEffect(() => {
        return () => {
            state.thumbnails.forEach((entry) => {
                if (isLocalObjectUrl(entry.url)) URL.revokeObjectURL(entry.url);
            });
        };
    }, [state.thumbnails]);

    useEffect(() => {
        return () => {
            if (isLocalObjectUrl(state.readyMedia?.thumbnailUrl)) {
                URL.revokeObjectURL(state.readyMedia.thumbnailUrl);
            }
        };
    }, [state.readyMedia]);

    const clearThumbnails = useCallback(() => {
        thumbnailRequestRef.current += 1;
        dispatch({ type: "thumbnails/clear" });
    }, []);

    const selectVideo = useCallback((file) => {
        dispatch({ type: "error/set", error: "" });

        if (!file || !isVideoFile(file)) {
            dispatch({ type: "error/set", error: "Choose a valid video file." });
            return;
        }

        thumbnailRequestRef.current += 1;
        dispatch({ type: "video/select", file });
    }, []);

    const removeVideo = useCallback(() => {
        thumbnailRequestRef.current += 1;
        dispatch({ type: "video/remove" });
    }, []);

    const setDuration = useCallback((duration) => {
        dispatch({ type: "video/duration", duration });
    }, []);

    const setError = useCallback((error) => {
        dispatch({ type: "error/set", error });
    }, []);

    const setDragActive = useCallback((dragActive) => {
        dispatch({ type: "drag/set", dragActive });
    }, []);

    const updateTitle = useCallback((title) => {
        dispatch({ type: "metadata/title", title });
    }, []);

    const updateDescription = useCallback((description) => {
        dispatch({ type: "metadata/description", description });
    }, []);

    const updateCharacters = useCallback((characters) => {
        dispatch({ type: "metadata/characters", characters });
    }, []);

    const canOpenStage = useCallback((stage) => {
        if (stage === 1) return true;
        if (stage === 2) return Boolean(state.preparedVideo && state.duration);
        return Boolean(state.preparedVideo && state.duration && state.metadataComplete);
    }, [state.duration, state.metadataComplete, state.preparedVideo]);

    const stageComplete = useCallback((stage) => {
        if (stage === 1) return Boolean(state.preparedVideo && state.duration);
        if (stage === 2) return state.metadataComplete;
        return Boolean(state.readyMedia);
    }, [state.duration, state.metadataComplete, state.preparedVideo, state.readyMedia]);

    const openStage = useCallback((stage) => {
        if (state.preparingVideo) return;
        if (!canOpenStage(stage)) return;
        dispatch({ type: "stage/open", stage });
    }, [canOpenStage, state.preparingVideo]);

    const captureThumbnails = useCallback(async () => {
        if (!state.videoUrl || !state.duration) return;

        const requestId = thumbnailRequestRef.current + 1;
        thumbnailRequestRef.current = requestId;
        dispatch({ type: "thumbnails/start" });

        try {
            const captures = await generateVideoThumbnails({
                src: state.videoUrl,
                start: 0,
                end: state.duration,
                sourceDuration: state.duration,
            });
            const thumbnails = captures.map((entry) => ({
                ...entry,
                url: URL.createObjectURL(entry.file),
            }));

            if (requestId !== thumbnailRequestRef.current) {
                thumbnails.forEach((entry) => URL.revokeObjectURL(entry.url));
                return;
            }

            dispatch({
                type: "thumbnails/success",
                thumbnails,
                selectedThumbnail: thumbnails[0] || null,
            });
        } catch (captureError) {
            if (requestId === thumbnailRequestRef.current) {
                dispatch({
                    type: "thumbnails/error",
                    error: captureError.message || "Unable to generate cover images.",
                });
            }
        } finally {
            if (requestId === thumbnailRequestRef.current) {
                dispatch({ type: "thumbnails/finish" });
            }
        }
    }, [state.duration, state.videoUrl]);

    const continueToThumbnails = useCallback((event) => {
        event?.preventDefault?.();
        dispatch({ type: "error/set", error: "" });

        if (!state.title.trim()) {
            dispatch({ type: "error/set", error: "Add a video title." });
            return;
        }
        if (!state.description.trim()) {
            dispatch({ type: "error/set", error: "Add a video description." });
            return;
        }
        if (state.characters.length === 0) {
            dispatch({ type: "error/set", error: "Attach at least one character." });
            return;
        }
        if (!state.preparedVideo) {
            dispatch({ type: "error/set", error: "Prepare the video parts first." });
            return;
        }

        dispatch({ type: "metadata/complete" });
        if (state.thumbnails.length === 0) void captureThumbnails();
    }, [
        captureThumbnails,
        state.characters.length,
        state.description,
        state.preparedVideo,
        state.thumbnails.length,
        state.title,
    ]);

    const selectThumbnail = useCallback((thumbnail) => {
        dispatch({ type: "thumbnail/select", thumbnail });
    }, []);

    const finishPackage = useCallback(() => {
        dispatch({ type: "error/set", error: "" });

        if (!state.videoFile || !state.videoUrl || !state.duration) {
            dispatch({ type: "error/set", error: "Select a playable video first." });
            return;
        }
        if (!state.preparedVideo) {
            dispatch({ type: "error/set", error: "Prepare the video parts first." });
            return;
        }
        if (!state.metadataComplete) {
            dispatch({ type: "error/set", error: "Complete the metadata stage first." });
            return;
        }
        if (!state.selectedThumbnail) {
            dispatch({ type: "error/set", error: "Choose a cover image." });
            return;
        }

        const thumbnailUrl = URL.createObjectURL(state.selectedThumbnail.file);
        dispatch({
            type: "ready/set",
            readyMedia: {
                title: state.title.trim(),
                description: state.description.trim(),
                videoUrl: state.videoUrl,
                chunks: state.preparedVideo.chunks,
                chunkManifest: state.preparedVideo.manifest,
                thumbnailFile: state.selectedThumbnail.file,
                thumbnailUrl,
                duration: state.duration,
                characters: [...state.characters],
                characterIds: state.characters.map((character) => character.id),
            },
        });
    }, [
        state.characters,
        state.description,
        state.duration,
        state.metadataComplete,
        state.preparedVideo,
        state.selectedThumbnail,
        state.title,
        state.videoFile,
        state.videoUrl,
    ]);

    const value = useMemo(() => ({
        ...state,
        canOpenStage,
        captureThumbnails,
        clearThumbnails,
        continueToThumbnails,
        finishPackage,
        openStage,
        removeVideo,
        selectThumbnail,
        selectVideo,
        setDragActive,
        setDuration,
        setError,
        stageComplete,
        updateCharacters,
        updateDescription,
        updateTitle,
    }), [
        canOpenStage,
        captureThumbnails,
        clearThumbnails,
        continueToThumbnails,
        finishPackage,
        openStage,
        removeVideo,
        selectThumbnail,
        selectVideo,
        setDragActive,
        setDuration,
        setError,
        stageComplete,
        state,
        updateCharacters,
        updateDescription,
        updateTitle,
    ]);

    return (
        <MediaUploadContext.Provider value={value}>
            {children}
        </MediaUploadContext.Provider>
    );
}

export function useMediaUpload() {
    const context = useContext(MediaUploadContext);
    if (!context) {
        throw new Error("useMediaUpload must be used inside MediaUploadProvider.");
    }
    return context;
}

/**
 * Developer notes: backend wiring for the media upload flow
 *
 * Current behavior
 * - This feature is currently a browser-only packaging flow.
 * - `MediaUploadProvider` owns state, object URL cleanup, and workflow actions.
 * - `selectVideo(file)` stores the source video and triggers local chunking.
 * - `videoUrl` is a temporary `URL.createObjectURL(videoFile)` preview URL.
 * - `preparedVideo` is produced by `splitFileIntoEqualChunks(videoFile)`.
 * - `captureThumbnails()` generates local thumbnail candidates.
 * - `finishPackage()` validates the local package and writes `readyMedia`.
 *
 * Where backend integration belongs
 * - Keep `PvPScalpelVideoPlayer` as a presentational player.
 * - Add backend calls in provider actions or in a helper called by those actions.
 * - Use `UserContext.httpFetch` for authenticated JSON metadata requests.
 * - Do not upload `File`, `Blob`, or `FormData` through `httpFetch` while it
 *   applies the default `Content-Type: application/json` header.
 *
 * Expected backend save flow
 * - Extend `finishPackage()` or add a `saveMedia()` provider action.
 * - Send metadata: title, description, duration, and character IDs.
 * - Upload or register `selectedThumbnail.file`.
 * - Upload or register ordered chunks from `preparedVideo.chunks`.
 * - Store backend response URLs or IDs in `readyMedia`.
 * - Preserve player inputs: `readyMedia.videoUrl`, `readyMedia.thumbnailUrl`,
 *   and `readyMedia.title`.
 */
