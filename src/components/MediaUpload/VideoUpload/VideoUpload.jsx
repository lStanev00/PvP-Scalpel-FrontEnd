import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../../hooks/ContextVariables.jsx";
import { useMediaUploadContext } from "../MediaUploadContext.js";
import uploadBlobToSignedUrl from "./UploadProgressStage/uploadBlobToSignedUrl.js";
import UploadCompleteStage from "./UploadCompleteStage/UploadCompleteStage.jsx";
import UploadInitializeStage from "./UploadInitializeStage/UploadInitializeStage.jsx";
import UploadProgressStage from "./UploadProgressStage/UploadProgressStage.jsx";

function getUploadFeedbackMediaDoc(payload) {
    if (payload?.type !== "uploadFeedback") return null;
    if (!payload?.message?.data || typeof payload.message.data !== "object") return null;

    return payload.message.data;
}

export default function VideoUpload({ uploadSocket, uploadSocketStatus, uploadSocketError, setStage }) {
    const { httpFetch } = useContext(UserContext);
    const { videoChunks, mediaMetaDocRef, setMediaMetaDoc, mergeMediaMetaDoc } =
        useMediaUploadContext();
    const [uploadStage, setUploadStage] = useState(0);
    const [uploadLinks, setUploadLinks] = useState([]);
    const [error, setError] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgressPercent, setUploadProgressPercent] = useState(0);
    const [uploadSpeedBytesPerSecond, setUploadSpeedBytesPerSecond] = useState(0);
    const isInitializingRef = useRef(false);
    const hasStartedUploadRef = useRef(false);
    const speedSampleRef = useRef({
        loaded: 0,
        time: 0,
        speed: 0,
    });

    const initializeUpload = useCallback(async () => {
        // stage 0
        if (isInitializingRef.current || uploadStage !== 0) return;
        isInitializingRef.current = true;
        setError("");

        const exportBody = {
            fileData: [],
        };

        if (videoChunks === null) {
            console.warn(`vChunks is null`);
            isInitializingRef.current = false;
            return null;
        }

        for (const chunk of videoChunks) {
            exportBody.fileData.push(`part-${chunk.index}`);
        }

        const req = await httpFetch("/media", {
            method: "POST",
            body: JSON.stringify(exportBody),
        });

        if (req.status === 201) {
            const nextUploadLinks = Array.isArray(req.data?.urls) ? req.data.urls : [];
            const nextMediaMetaDoc = req.data?.mediaObj || null;

            console.info("Media upload initialized", {
                chunks: videoChunks,
                uploadLinks: nextUploadLinks,
                mediaMetaDoc: nextMediaMetaDoc,
            });

            setUploadLinks(nextUploadLinks);
            setMediaMetaDoc(nextMediaMetaDoc);
            setUploadStage(1);
            return;
        }

        isInitializingRef.current = false;
        setError(req.data?.msg || "Failed to initialize upload.");
    }, [httpFetch, uploadStage, videoChunks]);

    const startUpload = useCallback(async () => {
        // stage 1 this will upload the parts and give feedback to the server
        if (hasStartedUploadRef.current) return;

        if (uploadSocketStatus !== "open" || uploadSocket?.readyState !== WebSocket.OPEN) {
            setError(uploadSocketError || "Upload websocket is not ready.");
            return;
        }

        if (!videoChunks?.length || !uploadLinks.length || !mediaMetaDocRef.current?._id) {
            setError("Upload is not initialized.");
            return;
        }

        setError("");
        hasStartedUploadRef.current = true;
        setIsUploading(true);
        setUploadProgressPercent(0);
        setUploadSpeedBytesPerSecond(0);
        speedSampleRef.current = {
            loaded: 0,
            time: performance.now(),
            speed: 0,
        };
        setUploadStage(1);

        try {
            const totalParts = videoChunks.length;
            const percentPerPart = 100 / totalParts;

            for (let i = 0; i < uploadLinks.length; i += 1) {
                const signedUrl = uploadLinks[i];
                const chunk = videoChunks[i];

                if (!signedUrl || !chunk?.blob) {
                    throw new Error("Missing upload part data.");
                }

                await uploadBlobToSignedUrl(chunk.blob, signedUrl, ({ loaded, total }) => {
                    if (!total) return;

                    const now = performance.now();
                    const previousSample = speedSampleRef.current;
                    const elapsedSeconds = (now - previousSample.time) / 1000;
                    const loadedDelta = loaded - previousSample.loaded;

                    if (elapsedSeconds > 0 && loadedDelta >= 0) {
                        const currentSpeed = loadedDelta / elapsedSeconds;
                        const smoothedSpeed = previousSample.speed
                            ? previousSample.speed * 0.72 + currentSpeed * 0.28
                            : currentSpeed;

                        speedSampleRef.current = {
                            loaded,
                            time: now,
                            speed: smoothedSpeed,
                        };
                        setUploadSpeedBytesPerSecond(smoothedSpeed);
                    }

                    const baseProgress = i * percentPerPart;
                    const chunkProgress = (loaded / total) * percentPerPart;
                    const totalProgress = Math.round(baseProgress + chunkProgress);

                    setUploadProgressPercent(Math.max(0, Math.min(100, totalProgress)));
                });

                setUploadProgressPercent(Math.round(((i + 1) / totalParts) * 100));
                speedSampleRef.current = {
                    loaded: 0,
                    time: performance.now(),
                    speed: speedSampleRef.current.speed,
                };

                const mediaID = mediaMetaDocRef.current?._id;

                if (!mediaID) {
                    throw new Error("Missing media metadata for upload feedback.");
                }

                const feedbackPayload = {
                    type: "uploadMedia",
                    data: {
                        type: "uploadFeedback",
                        msgContext: {
                            mediaID,
                            index: chunk.index,
                            route: `videos/${mediaID}/part_${chunk.index}`,
                        },
                    },
                };

                console.info("Media upload part uploaded", {
                    part: chunk.index,
                    signedUrl,
                    feedbackPayload,
                });

                uploadSocket.send(JSON.stringify(feedbackPayload));
            }

            console.info("Media upload complete", {
                mediaMetaDoc: mediaMetaDocRef.current,
                totalParts: videoChunks.length,
            });

            setUploadProgressPercent(100);
            setUploadStage(2);
        } catch (err) {
            hasStartedUploadRef.current = false;
            setError(err?.message || "Failed to upload video.");
            setUploadStage(1);
        } finally {
            setIsUploading(false);
            setUploadSpeedBytesPerSecond(0);
        }
    }, [
        mediaMetaDocRef,
        uploadLinks,
        uploadSocket,
        uploadSocketError,
        uploadSocketStatus,
        videoChunks,
    ]);

    useEffect(() => {
        if (!uploadSocket) return undefined;

        const handleMessage = (event) => {
            if (typeof event.data !== "string") return;

            try {
                const payload = JSON.parse(event.data);
                const nextMediaDoc = getUploadFeedbackMediaDoc(payload);

                if (nextMediaDoc) {
                    mergeMediaMetaDoc(nextMediaDoc);
                }

                console.info("Media upload websocket message", payload);
            } catch {
                setError("Received an invalid websocket payload.");
            }
        };

        uploadSocket.addEventListener("message", handleMessage);

        return () => {
            uploadSocket.removeEventListener("message", handleMessage);
        };
    }, [mergeMediaMetaDoc, uploadSocket]);

    const totalParts = videoChunks?.length || 0;
    const signedParts = uploadLinks.length;
    const isSocketReady =
        uploadSocketStatus === "open" && uploadSocket?.readyState === WebSocket.OPEN;
    const progressPercent = uploadStage === 2 ? 100 : uploadStage === 1 ? uploadProgressPercent : 8;

    useEffect(() => {
        if (uploadStage !== 0 || !videoChunks?.length) return;
        initializeUpload();
    }, [initializeUpload, uploadStage, videoChunks]);

    useEffect(() => {
        if (uploadStage !== 1 || !signedParts || !isSocketReady || isUploading) return;
        startUpload();
    }, [isSocketReady, isUploading, signedParts, startUpload, uploadStage]);

    if (uploadStage === 0) {
        return (
            <UploadInitializeStage
                progressPercent={progressPercent}
                error={error || uploadSocketError}
            />
        );
    }

    if (uploadStage === 1) {
        return (
            <UploadProgressStage
                progressPercent={progressPercent}
                error={error || uploadSocketError}
                isUploading={isUploading}
                uploadSpeedBytesPerSecond={uploadSpeedBytesPerSecond}
            />
        );
    }

    return (
        <>
            <UploadCompleteStage progressPercent={progressPercent} />
            <button onClick={() => setStage(2)}>Continue to details</button>
        </>
    );
}
