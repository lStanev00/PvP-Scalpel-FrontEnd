import { useCallback, useId, useState } from "react";
import { FiUploadCloud } from "react-icons/fi";

import Style from "./VideoInput.module.css";

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

export default function VideoInput({ videoInputRef }) {
    const inputId = useId();
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

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
            if (!isAcceptedVideo(file)) {
                setSelectedFile(null);
                setErrorMessage("Drop or select an MP4, WebM, or Ogg video.");

                if (videoInputRef.current) {
                    videoInputRef.current.value = "";
                }

                return;
            }

            if (shouldSyncInput) {
                setInputFile(file);
            }

            setSelectedFile(file);
            setErrorMessage("");
        },
        [setInputFile, videoInputRef],
    );

    const handleInputChange = useCallback(
        (event) => {
            selectFile(event.target.files?.[0]);
        },
        [selectFile],
    );

    const handleDragEnter = useCallback((event) => {
        event.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((event) => {
        if (event.currentTarget.contains(event.relatedTarget)) return;
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        (event) => {
            event.preventDefault();
            setIsDragging(false);

            const files = Array.from(event.dataTransfer.files);
            const videoFile = files.find(isAcceptedVideo);

            selectFile(videoFile, true);
        },
        [selectFile],
    );

    const handleKeyDown = useCallback(
        (event) => {
            if (event.key !== "Enter" && event.key !== " ") return;
            event.preventDefault();
            videoInputRef.current?.click();
        },
        [videoInputRef],
    );

    const statusMessage =
        errorMessage ||
        (selectedFile
            ? selectedFile.name +
              (formatFileSize(selectedFile.size) ? " - " + formatFileSize(selectedFile.size) : "")
            : "MP4, WebM, or Ogg");

    return (
        <section className={Style.uploadSection}>
            <input
                id={inputId}
                className={Style.videoInput}
                type="file"
                accept={ACCEPT_ATTRIBUTE}
                ref={videoInputRef}
                onChange={handleInputChange}
            />

            <label
                className={[Style.dropBox, isDragging ? Style.dropBoxActive : ""]
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
            </label>
        </section>
    );
}
