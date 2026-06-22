/* eslint-disable react/prop-types */

import { useCallback, useMemo, useReducer } from "react";
import { isVideoFile } from "../mediaUploadFormatting.js";
import { useThumbnailCapture } from "../hooks/useThumbnailCapture.js";
import { useVideoPreparation } from "../hooks/useVideoPreparation.js";
import { buildReadyMedia } from "../logic/buildReadyMedia.js";
import {
    validateMetadata,
    validateReadyPackage,
} from "../logic/mediaUploadValidation.js";
import {
    initialMediaUploadState,
    mediaUploadActions,
    mediaUploadReducer,
} from "./mediaUploadReducer.js";
import {
    MediaUploadActionsContext,
    MediaUploadStateContext,
} from "./useMediaUpload.js";

export function MediaUploadProvider({ children }) {
    const [state, dispatch] = useReducer(mediaUploadReducer, initialMediaUploadState);

    useVideoPreparation({
        dispatch,
        videoFile: state.videoFile,
    });

    const {
        captureThumbnails,
        clearThumbnails,
        invalidateThumbnailRequests,
    } = useThumbnailCapture({ dispatch, state });

    const selectVideo = useCallback((file) => {
        dispatch(mediaUploadActions.setError(""));

        // Stage 1 accepts only browser-recognized video files or known video
        // extensions; invalid input stops before state changes trigger effects.
        if (!file || !isVideoFile(file)) {
            dispatch(mediaUploadActions.setError("Choose a valid video file."));
            return;
        }

        // Invalidate pending thumbnail work because a new source video changes
        // every derived artifact: chunks, thumbnails, duration, and ready media.
        invalidateThumbnailRequests();
        dispatch(mediaUploadActions.selectVideo(file));
    }, [invalidateThumbnailRequests]);

    const removeVideo = useCallback(() => {
        invalidateThumbnailRequests();
        dispatch(mediaUploadActions.removeVideo());
    }, [invalidateThumbnailRequests]);

    const setDuration = useCallback((duration) => {
        dispatch(mediaUploadActions.setDuration(duration));
    }, []);

    const setError = useCallback((error) => {
        dispatch(mediaUploadActions.setError(error));
    }, []);

    const setDragActive = useCallback((dragActive) => {
        dispatch(mediaUploadActions.setDragActive(dragActive));
    }, []);

    const updateTitle = useCallback((title) => {
        dispatch(mediaUploadActions.updateTitle(title));
    }, []);

    const updateDescription = useCallback((description) => {
        dispatch(mediaUploadActions.updateDescription(description));
    }, []);

    const updateCharacters = useCallback((characters) => {
        dispatch(mediaUploadActions.updateCharacters(characters));
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
        dispatch(mediaUploadActions.openStage(stage));
    }, [canOpenStage, state.preparingVideo]);

    const continueToThumbnails = useCallback((event) => {
        event?.preventDefault?.();
        dispatch(mediaUploadActions.setError(""));

        const validationError = validateMetadata(state);
        if (validationError) {
            dispatch(mediaUploadActions.setError(validationError));
            return;
        }

        dispatch(mediaUploadActions.completeMetadata());
        if (state.thumbnails.length === 0) void captureThumbnails();
    }, [captureThumbnails, state]);

    const selectThumbnail = useCallback((thumbnail) => {
        dispatch(mediaUploadActions.selectThumbnail(thumbnail));
    }, []);

    const finishPackage = useCallback(() => {
        dispatch(mediaUploadActions.setError(""));

        const validationError = validateReadyPackage(state);
        if (validationError) {
            dispatch(mediaUploadActions.setError(validationError));
            return;
        }

        dispatch(mediaUploadActions.setReadyMedia(buildReadyMedia(state)));
    }, [state]);

    const actions = useMemo(() => ({
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
        updateCharacters,
        updateDescription,
        updateTitle,
    ]);

    return (
        <MediaUploadStateContext.Provider value={state}>
            <MediaUploadActionsContext.Provider value={actions}>
                {children}
            </MediaUploadActionsContext.Provider>
        </MediaUploadStateContext.Provider>
    );
}
