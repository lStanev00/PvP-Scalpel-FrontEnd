import { useCallback, useId, useState } from "react";
import { FiArrowRight, FiCheck, FiUploadCloud } from "react-icons/fi";

import Style from "./VideoInput.module.css";
import { useMediaUploadContext } from "../MediaUploadContext.js";

const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg"];
const ACCEPTED_VIDEO_EXTENSIONS = [".mp4", ".webm", ".ogg"];
const ACCEPT_ATTRIBUTE = ACCEPTED_VIDEO_TYPES.join(",");

function isAcceptedVideo(file) {
    if (!file) return false;
    if (ACCEPTED_VIDEO_TYPES.includes(file.type)) return true;

    const fileName = file.name.toLowerCase();
    return ACCEPTED_VIDEO_EXTENSIONS.some((extension) => fileName.endsWith(extension));
}

function formatFileSize(bytes) {
    if (!Number.isFinite(bytes) || bytes <= 0) return "";

    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex += 1;
    }

    return size.toFixed(size >= 10 || unitIndex === 0 ? 0 : 1) + " " + units[unitIndex];
}

export default function VideoInput({ videoInputRef, setStage }) {
    const inputId = useId();
    const [isDragging, setIsDragging] = useState(false);
    const { videoFile, setVideoFile, isVideoLocked, setIsVideoLocked } = useMediaUploadContext();
    const [errorMessage, setErrorMessage] = useState("");

    const goToStage = useCallback(
        (nextStage) => {
            setStage((currentStage) => {
                const resolvedStage = typeof nextStage === "function"
                    ? nextStage(currentStage)
                    : nextStage;

                return resolvedStage === 1 ? 1 : 0;
            });
        },
        [setStage],
    );

    const setInputFile = useCallback(
        (file) => {
            if (!videoInputRef.current) return;

            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            videoInputRef.current.files = dataTransfer.files;
            videoInputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
        },
        [videoInputRef],
    );

    const selectFile = useCallback(
        (file, shouldSyncInput = false) => {
            if (isVideoLocked) return;

            if (!isAcceptedVideo(file)) {
                setVideoFile(null);
                setErrorMessage("Drop or select an MP4, WebM, or Ogg video.");

                if (videoInputRef.current) {
                    videoInputRef.current.value = "";
                }

                return;
            }

            if (shouldSyncInput) {
                setInputFile(file);
            }

            setVideoFile(file);
            setErrorMessage("");
        },
        [isVideoLocked, setInputFile, setVideoFile, videoInputRef],
    );

    const handleInputChange = useCallback(
        (event) => {
            selectFile(event.target.files?.[0]);
        },
        [selectFile],
    );

    const handleDragEnter = useCallback((event) => {
        event.preventDefault();
        if (isVideoLocked) return;
        setIsDragging(true);
    }, [isVideoLocked]);

    const handleDragOver = useCallback((event) => {
        event.preventDefault();
        if (isVideoLocked) return;
        event.dataTransfer.dropEffect = "copy";
        setIsDragging(true);
    }, [isVideoLocked]);

    const handleDragLeave = useCallback((event) => {
        if (event.currentTarget.contains(event.relatedTarget)) return;
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        (event) => {
            event.preventDefault();
            setIsDragging(false);
            if (isVideoLocked) return;

            const files = Array.from(event.dataTransfer.files);
            const videoFile = files.find(isAcceptedVideo);

            selectFile(videoFile, true);
        },
        [isVideoLocked, selectFile],
    );

    const handleKeyDown = useCallback(
        (event) => {
            if (event.key !== "Enter" && event.key !== " ") return;
            event.preventDefault();
            if (isVideoLocked) return;
            videoInputRef.current?.click();
        },
        [isVideoLocked, videoInputRef],
    );

    const selectedFileSize = videoFile ? formatFileSize(videoFile.size) : "";
    const selectedFileType = videoFile?.type?.replace("video/", "").toUpperCase() || "VIDEO";
    const statusMessage =
        errorMessage ||
        (videoFile
            ? videoFile.name + (selectedFileSize ? " - " + selectedFileSize : "")
            : "MP4, WebM, or Ogg");

    return (
        <>
            <section
                className={[
                    Style.uploadSection,
                    videoFile ? Style.uploadSectionSelected : "",
                ]
                    .filter(Boolean)
                    .join(" ")}>
                <input
                    id={inputId}
                    className={Style.videoInput}
                    type="file"
                    accept={ACCEPT_ATTRIBUTE}
                    ref={videoInputRef}
                    disabled={isVideoLocked}
                    onChange={handleInputChange}
                />

                <label
                    className={[
                        Style.dropBox,
                        isDragging ? Style.dropBoxActive : "",
                        videoFile ? Style.dropBoxSelected : "",
                        isVideoLocked ? Style.dropBoxLocked : "",
                    ]
                        .filter(Boolean)
                        .join(" ")}
                    htmlFor={inputId}
                    role="button"
                    tabIndex={0}
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onKeyDown={handleKeyDown}>
                    {videoFile ? (
                        <span className={Style.selectedSummary}>
                            <span className={Style.selectedMark} aria-hidden="true">
                                <FiCheck />
                            </span>
                            <span className={Style.selectedDetails}>
                                <span className={Style.selectedName}>{videoFile.name}</span>
                                <span className={Style.selectedMeta}>
                                    {selectedFileSize}
                                    {selectedFileSize ? " - " : ""}
                                    {selectedFileType}
                                </span>
                            </span>
                            <span className={Style.selectedAction}>
                                {isVideoLocked ? "Video locked" : "Change video"}
                            </span>
                        </span>
                    ) : (
                        <>
                            <span className={Style.plusMark} aria-hidden="true">
                                <FiUploadCloud />
                            </span>
                            <span className={Style.selectText}>
                                {isDragging ? "Drop video" : "Select or drop video"}
                            </span>
                            <p
                                className={[Style.fileStatus, errorMessage ? Style.fileStatusError : ""]
                                    .filter(Boolean)
                                    .join(" ")}
                                aria-live="polite">
                                {statusMessage}
                            </p>
                        </>
                    )}
                </label>
            </section>

            <button
                type="button"
                className={[
                    Style.nextActionButton,
                    videoFile ? Style.nextActionButtonSelected : Style.nextActionButtonDisabled,
                ]
                    .filter(Boolean)
                    .join(" ")}
                onClick={() =>
                    goToStage((now) => {
                        setIsVideoLocked(true);
                        const newVal = now + 1;
                        return newVal;
                    })
                }
                disabled={!videoFile}
                title={videoFile ? undefined : "Select video first"}
                aria-label={videoFile ? "Next" : "Select video first"}>
                {videoFile ? (
                    <>
                        <span>Next</span>
                        <FiArrowRight className={Style.nextActionIcon} aria-hidden="true" />
                    </>
                ) : (
                    <>
                        <span className={Style.nextActionIdle}>Continue</span>
                        <span className={Style.nextActionHint}>Select video first</span>
                    </>
                )}
            </button>
        </>
    );
}
