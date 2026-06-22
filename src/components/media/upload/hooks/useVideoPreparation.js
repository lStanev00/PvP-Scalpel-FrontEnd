import { useEffect } from "react";
import { splitFileIntoEqualChunks } from "../../../../helpers/fileChunking.js";
import { mediaUploadActions } from "../context/mediaUploadReducer.js";

export function useVideoPreparation({ dispatch, videoFile }) {
    useEffect(() => {
        if (!videoFile) {
            dispatch(mediaUploadActions.setVideoUrl(""));
            return undefined;
        }

        const objectUrl = URL.createObjectURL(videoFile);
        dispatch(mediaUploadActions.setVideoUrl(objectUrl));
        return () => URL.revokeObjectURL(objectUrl);
    }, [dispatch, videoFile]);

    useEffect(() => {
        if (!videoFile) {
            dispatch(mediaUploadActions.resetPreparation());
            return undefined;
        }

        let cancelled = false;
        dispatch(mediaUploadActions.startPreparation());

        // Defer chunk preparation by one tick so React can paint the
        // "preparing" state before the synchronous Blob slicing starts.
        const preparationTimer = window.setTimeout(() => {
            try {
                // This is where the selected video is split into ordered
                // upload-ready Blob chunks plus its manifest metadata.
                const preparedVideo = splitFileIntoEqualChunks(videoFile);
                if (!cancelled) {
                    dispatch(mediaUploadActions.completePreparation(preparedVideo));
                }
            } catch (preparationError) {
                if (!cancelled) {
                    dispatch(mediaUploadActions.failPreparation(
                        preparationError.message || "Unable to prepare video chunks.",
                    ));
                }
            }
        }, 0);

        return () => {
            // If the user replaces/removes the video while preparation is queued,
            // ignore the stale result and cancel the pending timer.
            cancelled = true;
            window.clearTimeout(preparationTimer);
        };
    }, [dispatch, videoFile]);
}
