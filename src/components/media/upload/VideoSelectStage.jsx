// Stage 1 upload file and split on parts then exec an api call to get links

import { useRef } from "react";
import {
    FaArrowRight,
    FaCloudArrowUp,
    FaFilm,
    FaTrash,
} from "react-icons/fa6";
import DataTravelLoader from "../../DataTravelLoader.jsx";
import PvPScalpelVideoPlayer from "../PvPScalpelVideoPlayer.jsx";
import { MAX_CHUNK_BYTES } from "../../../helpers/fileChunking.js";
import { formatMediaTime } from "../../../helpers/mediaFormatting.js";
import Style from "../../../Styles/modular/MediaUpload.module.css";
import { formatBytes, formatMiB } from "./mediaUploadFormatting.js";
import { useMediaUpload } from "./MediaUploadContext.jsx";

export default function VideoSelectStage() {
    const fileInputRef = useRef(null);
    const {
        dragActive,
        duration,
        error,
        openStage,
        preparedVideo,
        preparingVideo,
        removeVideo,
        selectVideo,
        setDragActive,
        setDuration,
        setError,
        videoFile,
        videoUrl,
    } = useMediaUpload();

    const handleRemoveVideo = () => {
        removeVideo();
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <section className={Style.panel}>
            <div className={Style.sectionTitle}>
                <span>01</span>
                <div>
                    <h2>Select video</h2>
                    <p>Drop a capture and confirm that your browser can preview it.</p>
                </div>
            </div>

            {!videoFile ? (
                <button
                    type="button"
                    className={`${Style.dropzone} ${
                        dragActive ? Style.dropzoneActive : ""
                    }`}
                    disabled={preparingVideo}
                    onClick={() => fileInputRef.current?.click()}
                    onDragEnter={(event) => {
                        if (preparingVideo) return;
                        event.preventDefault();
                        setDragActive(true);
                    }}
                    onDragOver={(event) => {
                        if (preparingVideo) return;
                        event.preventDefault();
                    }}
                    onDragLeave={() => {
                        if (!preparingVideo) setDragActive(false);
                    }}
                    onDrop={(event) => {
                        if (preparingVideo) return;
                        event.preventDefault();
                        setDragActive(false);
                        selectVideo(event.dataTransfer.files?.[0]);
                    }}
                >
                    <span className={Style.dropIcon}><FaCloudArrowUp /></span>
                    <strong>Drop gameplay footage here</strong>
                    <span>or browse a video from this device</span>
                    <small>No hard size or duration limit</small>
                </button>
            ) : (
                <div className={Style.videoWorkspace}>
                    <PvPScalpelVideoPlayer
                        src={videoUrl}
                        title={videoFile.name}
                        bufferGate={{
                            enabled: true,
                            longVideoSeconds: 600,
                            shortThreshold: 0.5,
                            longThreshold: 0.2,
                        }}
                        onLoadedMetadata={(event) => {
                            setDuration(event.currentTarget.duration);
                        }}
                        onError={() => {
                            setDuration(0);
                            setError(
                                "This browser cannot decode the selected video. "
                                + "Conversion is unavailable, so choose a browser-playable file.",
                            );
                        }}
                    />

                    <div className={Style.fileBar}>
                        <div>
                            <FaFilm />
                            <span>
                                <strong>{videoFile.name}</strong>
                                <small>
                                    {formatBytes(videoFile.size)}
                                    {duration ? ` - ${formatMediaTime(duration)}` : ""}
                                </small>
                            </span>
                        </div>
                        <div className={Style.fileActions}>
                            <button
                                type="button"
                                disabled={preparingVideo}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Replace
                            </button>
                            <button
                                type="button"
                                disabled={preparingVideo}
                                onClick={handleRemoveVideo}
                                aria-label="Remove video"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    </div>

                    {preparingVideo && (
                        <DataTravelLoader
                            compact
                            label="Preparing video parts"
                            detail="Splitting the source video into upload-ready chunks."
                            steps={[
                                "Reading source",
                                "Balancing chunks",
                                "Preparing manifest",
                            ]}
                            activeStep={1}
                        />
                    )}

                    {preparedVideo && (
                        <dl
                            className={Style.preparationSummary}
                            aria-label="Prepared video parts"
                        >
                            <div>
                                <dt>Original size</dt>
                                <dd>{formatMiB(preparedVideo.manifest.totalBytes)}</dd>
                            </div>
                            <div>
                                <dt>Parts</dt>
                                <dd>{preparedVideo.manifest.chunkCount}</dd>
                            </div>
                            <div>
                                <dt>Approx. per part</dt>
                                <dd>
                                    {formatMiB(
                                        preparedVideo.manifest.totalBytes
                                            / preparedVideo.manifest.chunkCount,
                                    )}
                                </dd>
                            </div>
                            <div>
                                <dt>Maximum</dt>
                                <dd>{formatMiB(MAX_CHUNK_BYTES)} per part</dd>
                            </div>
                        </dl>
                    )}
                </div>
            )}

            <input
                ref={fileInputRef}
                className={Style.hiddenInput}
                type="file"
                accept="video/*,.mkv,.avi"
                disabled={preparingVideo}
                onChange={(event) => selectVideo(event.target.files?.[0])}
            />

            {error && <p className={Style.error} role="alert">{error}</p>}

            <div className={Style.submitArea}>
                <div>
                    <strong>
                        {preparingVideo
                            ? "Preparing video parts"
                            : preparedVideo
                            ? "Video parts prepared"
                            : "Local video preparation"}
                    </strong>
                    <span>
                        {preparingVideo
                            ? "Creating balanced parts no larger than 90 MiB."
                            : preparedVideo
                            ? "The ordered binary parts are ready for the local package."
                            : "Select a video to prepare its local package."}
                    </span>
                </div>
                <button
                    type="button"
                    className={Style.primaryButton}
                    disabled={preparingVideo || !preparedVideo || !duration}
                    onClick={() => openStage(2)}
                >
                    Continue to metadata
                    <FaArrowRight />
                </button>
            </div>
        </section>
    );
}
