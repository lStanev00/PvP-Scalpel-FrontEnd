import { useCallback, useEffect, useRef } from "react";
import { generateVideoThumbnails } from "../../../../helpers/mediaProcessing.js";
import { mediaUploadActions } from "../context/mediaUploadReducer.js";

function isLocalObjectUrl(url) {
    return typeof url === "string" && url.startsWith("blob:");
}

export function useThumbnailCapture({ dispatch, state }) {
    const thumbnailRequestRef = useRef(0);

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

    const invalidateThumbnailRequests = useCallback(() => {
        thumbnailRequestRef.current += 1;
    }, []);

    const clearThumbnails = useCallback(() => {
        invalidateThumbnailRequests();
        dispatch(mediaUploadActions.clearThumbnails());
    }, [dispatch, invalidateThumbnailRequests]);

    const captureThumbnails = useCallback(async () => {
        if (!state.videoUrl || !state.duration) return;

        const requestId = thumbnailRequestRef.current + 1;
        thumbnailRequestRef.current = requestId;
        dispatch(mediaUploadActions.startThumbnails());

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

            dispatch(mediaUploadActions.completeThumbnails(
                thumbnails,
                thumbnails[0] || null,
            ));
        } catch (captureError) {
            if (requestId === thumbnailRequestRef.current) {
                dispatch(mediaUploadActions.failThumbnails(
                    captureError.message || "Unable to generate cover images.",
                ));
            }
        } finally {
            if (requestId === thumbnailRequestRef.current) {
                dispatch(mediaUploadActions.finishThumbnails());
            }
        }
    }, [dispatch, state.duration, state.videoUrl]);

    return {
        captureThumbnails,
        clearThumbnails,
        invalidateThumbnailRequests,
    };
}
