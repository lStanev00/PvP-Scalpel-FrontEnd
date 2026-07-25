import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../../hooks/ContextVariables.jsx";
import { useMediaUploadContext } from "../MediaUploadContext.js";
import { sha256VideoChunk } from "../VideoInput/videoSlicer.js";
import uploadBlobToSignedUrl from "./UploadProgressStage/uploadBlobToSignedUrl.js";
import UploadCompleteStage from "./UploadCompleteStage/UploadCompleteStage.jsx";
import UploadInitializeStage from "./UploadInitializeStage/UploadInitializeStage.jsx";
import UploadProgressStage from "./UploadProgressStage/UploadProgressStage.jsx";

function inferVideoMimeType(file) {
    if (typeof file?.type === "string" && file.type.startsWith("video/")) {
        return file.type;
    }

    const extension = file?.name?.split(".").pop()?.toLowerCase();
    const mimeTypes = {
        mp4: "video/mp4",
        mov: "video/quicktime",
        ogg: "video/ogg",
        webm: "video/webm",
    };

    return mimeTypes[extension] || "";
}

function validateUploadTargets(uploads, chunks, mediaId) {
    if (!Array.isArray(uploads) || uploads.length !== chunks.length) {
        throw new Error("The server returned an incomplete upload target set.");
    }

    return chunks.map((chunk, index) => {
        const target = uploads[index];
        const expectedKey = `videos/${mediaId}/part_${index}`;

        if (
            !target ||
            target.index !== index ||
            target.keyId !== expectedKey ||
            typeof target.uploadUrl !== "string" ||
            !target.uploadUrl.startsWith("https://")
        ) {
            throw new Error(`The server returned an invalid target for part ${index}.`);
        }

        return target;
    });
}

export default function VideoUpload({ setStage }) {
    const { httpFetch } = useContext(UserContext);
    const {
        videoChunks,
        videoFile,
        mediaMetaDocRef,
        setMediaMetaDoc,
        mergeMediaMetaDoc,
    } = useMediaUploadContext();
    const [uploadStage, setUploadStage] = useState(0);
    const [uploadTargets, setUploadTargets] = useState([]);
    const [uploadParts, setUploadParts] = useState([]);
    const [error, setError] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [uploadFailed, setUploadFailed] = useState(false);
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
        if (
            isInitializingRef.current ||
            uploadStage !== 0 ||
            !videoFile ||
            !videoChunks?.length
        ) {
            return;
        }

        isInitializingRef.current = true;
        setError("");
        setUploadFailed(false);

        try {
            const mimeType = inferVideoMimeType(videoFile);
            if (!mimeType) {
                throw new Error("The selected file has an unsupported video type.");
            }

            const fileData = [];
            for (const chunk of videoChunks) {
                fileData.push({
                    index: chunk.index,
                    start: chunk.start,
                    end: chunk.end,
                    size: chunk.size,
                    sha256: await sha256VideoChunk(chunk.blob),
                });
            }

            const response = await httpFetch("/media", {
                method: "POST",
                body: JSON.stringify({
                    file: {
                        originalName: videoFile.name || "video",
                        mimeType,
                        totalBytes: videoFile.size,
                    },
                    fileData,
                }),
            });

            if (response.status !== 201) {
                throw new Error(
                    response.data?.message || "Failed to initialize the media upload.",
                );
            }

            const mediaDoc = response.data?.mediaObj;
            if (!mediaDoc?._id) {
                throw new Error("The server did not return media upload metadata.");
            }

            const targets = validateUploadTargets(
                response.data?.uploads,
                videoChunks,
                mediaDoc._id,
            );

            setUploadTargets(targets);
            setUploadParts(fileData);
            setMediaMetaDoc(mediaDoc);
            setUploadStage(1);
        } catch (initializationError) {
            isInitializingRef.current = false;
            setUploadFailed(true);
            setError(initializationError?.message || "Failed to initialize upload.");
        }
    }, [
        httpFetch,
        setMediaMetaDoc,
        uploadStage,
        videoChunks,
        videoFile,
    ]);

    const startUpload = useCallback(async () => {
        if (hasStartedUploadRef.current || uploadFailed) return;
        if (
            !videoChunks?.length ||
            uploadTargets.length !== videoChunks.length ||
            uploadParts.length !== videoChunks.length ||
            !mediaMetaDocRef.current?._id
        ) {
            setUploadFailed(true);
            setError("Upload initialization is incomplete.");
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

        try {
            const mediaId = mediaMetaDocRef.current._id;
            const totalParts = videoChunks.length;
            const percentPerPart = 100 / totalParts;

            for (let index = 0; index < totalParts; index += 1) {
                const target = uploadTargets[index];
                const chunk = videoChunks[index];
                const part = uploadParts[index];

                await uploadBlobToSignedUrl(
                    chunk.blob,
                    target.uploadUrl,
                    ({ loaded, total }) => {
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

                        const baseProgress = index * percentPerPart;
                        const chunkProgress = (loaded / total) * percentPerPart;
                        setUploadProgressPercent(
                            Math.max(
                                0,
                                Math.min(100, Math.round(baseProgress + chunkProgress)),
                            ),
                        );
                    },
                );

                const acknowledgement = await httpFetch("/media/upload-part", {
                    method: "PATCH",
                    body: JSON.stringify({
                        _id: mediaId,
                        index: part.index,
                        size: part.size,
                        sha256: part.sha256,
                    }),
                });

                if (acknowledgement.status !== 200) {
                    throw new Error(
                        acknowledgement.data?.message ||
                            `The server did not acknowledge part ${index}.`,
                    );
                }
                const expectedKey = `videos/${mediaId}/part_${index}`;
                const expectedState =
                    index + 1 === totalParts ? "await_data" : "uploading";
                if (
                    acknowledgement.data?.acknowledged?.index !== index ||
                    acknowledgement.data?.acknowledged?.keyId !== expectedKey ||
                    acknowledgement.data?.mediaObj?.state !== expectedState
                ) {
                    throw new Error(
                        `The server returned an invalid acknowledgement for part ${index}.`,
                    );
                }
                if (acknowledgement.data?.mediaObj) {
                    mergeMediaMetaDoc(acknowledgement.data.mediaObj);
                }

                setUploadProgressPercent(Math.round(((index + 1) / totalParts) * 100));
                speedSampleRef.current = {
                    loaded: 0,
                    time: performance.now(),
                    speed: speedSampleRef.current.speed,
                };
            }

            setUploadProgressPercent(100);
            setUploadStage(2);
        } catch (uploadError) {
            setUploadFailed(true);
            setError(uploadError?.message || "Failed to upload video.");
        } finally {
            setIsUploading(false);
            setUploadSpeedBytesPerSecond(0);
        }
    }, [
        httpFetch,
        mediaMetaDocRef,
        mergeMediaMetaDoc,
        uploadFailed,
        uploadParts,
        uploadTargets,
        videoChunks,
    ]);

    const progressPercent =
        uploadStage === 2 ? 100 : uploadStage === 1 ? uploadProgressPercent : 8;
    const retryUpload = useCallback(() => {
        setError("");
        setUploadFailed(false);

        if (uploadStage === 0) {
            isInitializingRef.current = false;
        } else {
            hasStartedUploadRef.current = false;
        }
    }, [uploadStage]);

    useEffect(() => {
        if (uploadStage !== 0 || !videoChunks?.length || uploadFailed) return;
        initializeUpload();
    }, [initializeUpload, uploadFailed, uploadStage, videoChunks]);

    useEffect(() => {
        if (
            uploadStage !== 1 ||
            uploadTargets.length !== videoChunks?.length ||
            uploadParts.length !== videoChunks?.length ||
            isUploading ||
            uploadFailed
        ) {
            return;
        }
        startUpload();
    }, [
        isUploading,
        startUpload,
        uploadFailed,
        uploadParts.length,
        uploadStage,
        uploadTargets.length,
        videoChunks?.length,
    ]);

    if (uploadStage === 0) {
        return (
            <>
                <UploadInitializeStage
                    progressPercent={progressPercent}
                    error={error}
                />
                {uploadFailed && (
                    <button type="button" onClick={retryUpload}>
                        Retry upload initialization
                    </button>
                )}
            </>
        );
    }

    if (uploadStage === 1) {
        return (
            <>
                <UploadProgressStage
                    progressPercent={progressPercent}
                    error={error}
                    isUploading={isUploading}
                    uploadSpeedBytesPerSecond={uploadSpeedBytesPerSecond}
                />
                {uploadFailed && (
                    <button type="button" onClick={retryUpload}>
                        Retry upload
                    </button>
                )}
            </>
        );
    }

    return (
        <>
            <UploadCompleteStage progressPercent={progressPercent} />
            <button onClick={() => setStage(2)}>Continue to details</button>
        </>
    );
}
