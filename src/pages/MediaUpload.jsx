import { useCallback, useEffect, useRef, useState } from "react";
import {
    FaArrowLeft,
    FaArrowRight,
    FaArrowRotateRight,
    FaCheck,
    FaCloudArrowUp,
    FaFilm,
    FaImage,
    FaTrash,
} from "react-icons/fa6";
import DataTravelLoader from "../components/DataTravelLoader.jsx";
import CharacterMultiSelect from "../components/media/CharacterMultiSelect.jsx";
import PvPScalpelVideoPlayer from "../components/media/PvPScalpelVideoPlayer.jsx";
import {
    MAX_CHUNK_BYTES,
    splitFileIntoEqualChunks,
} from "../helpers/fileChunking.js";
import { formatMediaTime } from "../helpers/mediaFormatting.js";
import { generateVideoThumbnails } from "../helpers/mediaProcessing.js";
import Style from "../Styles/modular/MediaUpload.module.css";

const LONG_VIDEO_SECONDS = 30 * 60;
const STAGES = [
    { id: 1, label: "Select video", detail: "Preview and prepare" },
    { id: 2, label: "Metadata", detail: "Describe and attach" },
    { id: 3, label: "Thumbnail", detail: "Choose the cover" },
];

function formatBytes(bytes) {
    if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    return `${(bytes / 1024 ** index).toFixed(index > 1 ? 1 : 0)} ${units[index]}`;
}

function formatMiB(bytes) {
    if (!Number.isFinite(bytes) || bytes <= 0) return "0 MiB";
    return `${(bytes / (1024 * 1024)).toFixed(2)} MiB`;
}

function isVideoFile(file) {
    if (file?.type?.startsWith("video/")) return true;
    return /\.(mp4|m4v|mov|webm|avi|mkv|ogv)$/i.test(file?.name || "");
}

function formatVideoType(source) {
    const mimeType = source?.mimeType || source?.type;
    const filename = source?.originalName || source?.name;

    if (mimeType && mimeType !== "application/octet-stream") return mimeType;
    const extension = filename?.split(".").pop()?.toUpperCase();
    return extension ? `${extension} video` : "Original video";
}

export default function MediaUpload() {
    const fileInputRef = useRef(null);
    const thumbnailRequestRef = useRef(0);
    const [currentStage, setCurrentStage] = useState(1);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [characters, setCharacters] = useState([]);
    const [metadataComplete, setMetadataComplete] = useState(false);
    const [videoFile, setVideoFile] = useState(null);
    const [videoUrl, setVideoUrl] = useState("");
    const [duration, setDuration] = useState(0);
    const [preparedVideo, setPreparedVideo] = useState(null);
    const [preparingVideo, setPreparingVideo] = useState(false);
    const [thumbnails, setThumbnails] = useState([]);
    const [selectedThumbnail, setSelectedThumbnail] = useState(null);
    const [generatingThumbnails, setGeneratingThumbnails] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState("");
    const [readyMedia, setReadyMedia] = useState(null);

    useEffect(() => {
        if (!videoFile) {
            setVideoUrl("");
            return undefined;
        }

        const objectUrl = URL.createObjectURL(videoFile);
        setVideoUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [videoFile]);

    useEffect(() => {
        if (!videoFile) {
            setPreparedVideo(null);
            setPreparingVideo(false);
            return undefined;
        }

        let cancelled = false;
        setPreparedVideo(null);
        setPreparingVideo(true);

        const preparationTimer = window.setTimeout(() => {
            try {
                const prepared = splitFileIntoEqualChunks(videoFile);
                if (!cancelled) setPreparedVideo(prepared);
            } catch (preparationError) {
                if (!cancelled) {
                    setPreparedVideo(null);
                    setError(
                        preparationError.message
                        || "Unable to prepare video chunks.",
                    );
                }
            } finally {
                if (!cancelled) setPreparingVideo(false);
            }
        }, 0);

        return () => {
            cancelled = true;
            window.clearTimeout(preparationTimer);
        };
    }, [videoFile]);

    useEffect(() => {
        return () => {
            thumbnails.forEach((entry) => URL.revokeObjectURL(entry.url));
        };
    }, [thumbnails]);

    useEffect(() => {
        return () => {
            if (readyMedia?.thumbnailUrl) URL.revokeObjectURL(readyMedia.thumbnailUrl);
        };
    }, [readyMedia]);

    const clearThumbnails = () => {
        thumbnailRequestRef.current += 1;
        setGeneratingThumbnails(false);
        setThumbnails([]);
        setSelectedThumbnail(null);
    };

    const invalidateSourceResults = () => {
        clearThumbnails();
        setPreparedVideo(null);
        setPreparingVideo(false);
        setMetadataComplete(false);
        setReadyMedia(null);
    };

    const captureThumbnails = useCallback(async () => {
        if (!videoUrl || !duration) return;

        const requestId = thumbnailRequestRef.current + 1;
        thumbnailRequestRef.current = requestId;
        setGeneratingThumbnails(true);
        setSelectedThumbnail(null);
        setError("");

        try {
            const captures = await generateVideoThumbnails({
                src: videoUrl,
                start: 0,
                end: duration,
                sourceDuration: duration,
            });
            const next = captures.map((entry) => ({
                ...entry,
                url: URL.createObjectURL(entry.file),
            }));

            if (requestId !== thumbnailRequestRef.current) {
                next.forEach((entry) => URL.revokeObjectURL(entry.url));
                return;
            }

            setThumbnails(next);
            setSelectedThumbnail(next[0] || null);
        } catch (captureError) {
            if (requestId === thumbnailRequestRef.current) {
                setThumbnails([]);
                setError(captureError.message || "Unable to generate cover images.");
            }
        } finally {
            if (requestId === thumbnailRequestRef.current) {
                setGeneratingThumbnails(false);
            }
        }
    }, [duration, videoUrl]);

    const selectVideo = (file) => {
        setError("");

        if (!file || !isVideoFile(file)) {
            setError("Choose a valid video file.");
            return;
        }

        invalidateSourceResults();
        setDuration(0);
        setPreparingVideo(true);
        setVideoFile(file);
        setCurrentStage(1);
    };

    const removeVideo = () => {
        invalidateSourceResults();
        setVideoFile(null);
        setDuration(0);
        setError("");
        setCurrentStage(1);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const updateMetadata = (setter) => (value) => {
        setter(value);
        setMetadataComplete(false);
        setReadyMedia(null);
    };

    const continueToThumbnails = (event) => {
        event.preventDefault();
        setError("");

        if (!title.trim()) return setError("Add a video title.");
        if (!description.trim()) return setError("Add a video description.");
        if (characters.length === 0) return setError("Attach at least one character.");
        if (!preparedVideo) return setError("Prepare the video parts first.");

        setMetadataComplete(true);
        setReadyMedia(null);
        setCurrentStage(3);
        if (thumbnails.length === 0) void captureThumbnails();
    };

    const finishPackage = () => {
        setError("");

        if (!videoFile || !videoUrl || !duration) return setError("Select a playable video first.");
        if (!preparedVideo) return setError("Prepare the video parts first.");
        if (!metadataComplete) return setError("Complete the metadata stage first.");
        if (!selectedThumbnail) return setError("Choose a cover image.");

        const thumbnailUrl = URL.createObjectURL(selectedThumbnail.file);
        setReadyMedia({
            title: title.trim(),
            description: description.trim(),
            videoUrl,
            chunks: preparedVideo.chunks,
            chunkManifest: preparedVideo.manifest,
            thumbnailFile: selectedThumbnail.file,
            thumbnailUrl,
            duration,
            characters: [...characters],
            characterIds: characters.map((character) => character.id),
        });
    };

    const canOpenStage = (stage) => {
        if (stage === 1) return true;
        if (stage === 2) return Boolean(preparedVideo && duration);
        return Boolean(preparedVideo && duration && metadataComplete);
    };

    const stageComplete = (stage) => {
        if (stage === 1) return Boolean(preparedVideo && duration);
        if (stage === 2) return metadataComplete;
        return Boolean(readyMedia);
    };

    const openStage = (stage) => {
        if (preparingVideo) return;
        if (!canOpenStage(stage)) return;
        setError("");
        setCurrentStage(stage);
    };

    return (
        <section className={Style.page}>
            <div className={Style.ambient} aria-hidden="true">
                <div className={Style.glowOne} />
                <div className={Style.glowTwo} />
            </div>

            <header className={Style.hero}>
                <div className={Style.eyebrow}>
                    <FaFilm />
                    Admin media studio
                </div>
                <h1>
                    Upload <span>Combat Media</span>
                </h1>
                <p>
                    Choose gameplay footage, add its context, and select a cover frame.
                </p>
            </header>

            <nav className={Style.stageNav} aria-label="Media editor stages">
                {STAGES.map((stage) => {
                    const active = currentStage === stage.id;
                    const complete = stageComplete(stage.id);
                    const unlocked = canOpenStage(stage.id);
                    return (
                        <button
                            type="button"
                            key={stage.id}
                            className={`${Style.stageButton} ${
                                active ? Style.stageActive : ""
                            } ${complete ? Style.stageComplete : ""}`}
                            disabled={preparingVideo || !unlocked}
                            onClick={() => openStage(stage.id)}
                            aria-current={active ? "step" : undefined}
                        >
                            <span>{complete ? <FaCheck /> : stage.id}</span>
                            <strong>{stage.label}</strong>
                            <small>{stage.detail}</small>
                        </button>
                    );
                })}
            </nav>

            <div className={Style.editor}>
                {currentStage === 1 && (
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
                                        const nextDuration = event.currentTarget.duration;
                                        setDuration(nextDuration);
                                        setError("");
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
                                            onClick={removeVideo}
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
                                            <dd>
                                                {formatMiB(
                                                    preparedVideo.manifest.totalBytes,
                                                )}
                                            </dd>
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
                                disabled={
                                    preparingVideo
                                    || !preparedVideo
                                    || !duration
                                }
                                onClick={() => openStage(2)}
                            >
                                Continue to metadata
                                <FaArrowRight />
                            </button>
                        </div>
                    </section>
                )}

                {currentStage === 2 && (
                    <form className={Style.panel} onSubmit={continueToThumbnails}>
                        <div className={Style.sectionTitle}>
                            <span>02</span>
                            <div>
                                <h2>Media metadata</h2>
                                <p>Give the source video context and attach featured characters.</p>
                            </div>
                        </div>

                        <div className={Style.fields}>
                            <label>
                                <span>Title</span>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(event) => updateMetadata(setTitle)(event.target.value)}
                                    placeholder="Example: The perfect flag-room counter"
                                    maxLength={120}
                                    required
                                />
                                <small>{title.length}/120</small>
                            </label>

                            <label>
                                <span>Description</span>
                                <textarea
                                    value={description}
                                    onChange={(event) => updateMetadata(setDescription)(
                                        event.target.value,
                                    )}
                                    placeholder="Describe the match, bracket, strategy, and key moment..."
                                    maxLength={2000}
                                    required
                                />
                                <small>{description.length}/2000</small>
                            </label>

                            <div className={Style.characterField}>
                                <div className={Style.fieldLabel}>
                                    <span>Featured characters</span>
                                    <small>{characters.length} selected</small>
                                </div>
                                <CharacterMultiSelect
                                    selected={characters}
                                    onChange={updateMetadata(setCharacters)}
                                    styles={Style}
                                />
                            </div>
                        </div>

                        {error && <p className={Style.error} role="alert">{error}</p>}

                        <div className={Style.stageActions}>
                            <button
                                type="button"
                                className={Style.secondaryButton}
                                onClick={() => openStage(1)}
                            >
                                <FaArrowLeft />
                                Back to video
                            </button>
                            <button type="submit" className={Style.primaryButton}>
                                Continue to thumbnails
                                <FaArrowRight />
                            </button>
                        </div>
                    </form>
                )}

                {currentStage === 3 && (
                    <section className={Style.panel}>
                        <div className={Style.sectionTitle}>
                            <span>03</span>
                            <div>
                                <h2>Choose thumbnail</h2>
                                <p>Select a generated frame from the original video.</p>
                            </div>
                        </div>

                        <div className={Style.coverToolbar}>
                            <span>
                                {duration >= LONG_VIDEO_SECONDS
                                    ? "Five frames generated for long-form footage"
                                    : "Three frames generated for this clip"}
                            </span>
                            <button
                                type="button"
                                onClick={captureThumbnails}
                                disabled={generatingThumbnails || !videoFile || !duration}
                            >
                                <FaArrowRotateRight />
                                Refresh frames
                            </button>
                        </div>

                        {generatingThumbnails ? (
                            <DataTravelLoader
                                label="Capturing thumbnail frames"
                                detail="Reading the source video and preparing cover options."
                                steps={[
                                    "Seeking frames",
                                    "Rendering images",
                                    "Preparing choices",
                                ]}
                                activeStep={1}
                            />
                        ) : thumbnails.length > 0 ? (
                            <div className={Style.thumbnailGrid}>
                                {thumbnails.map((thumbnail) => {
                                    const selected = selectedThumbnail?.url === thumbnail.url;
                                    return (
                                        <button
                                            type="button"
                                            key={thumbnail.url}
                                            className={selected ? Style.thumbnailSelected : ""}
                                            onClick={() => {
                                                setSelectedThumbnail(thumbnail);
                                                setReadyMedia(null);
                                            }}
                                            aria-pressed={selected}
                                        >
                                            <img src={thumbnail.url} alt="" />
                                            <span>{formatMediaTime(thumbnail.time)}</span>
                                            {selected && <FaCheck />}
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className={Style.emptyState}>
                                <FaImage />
                                <span>No frames are available. Refresh to try again.</span>
                            </div>
                        )}

                        {error && <p className={Style.error} role="alert">{error}</p>}

                        <div className={Style.stageActions}>
                            <button
                                type="button"
                                className={Style.secondaryButton}
                                onClick={() => openStage(2)}
                            >
                                <FaArrowLeft />
                                Back to metadata
                            </button>
                            <button
                                type="button"
                                className={Style.primaryButton}
                                disabled={generatingThumbnails || !selectedThumbnail}
                                onClick={finishPackage}
                            >
                                <FaCheck />
                                Finish local package
                            </button>
                        </div>
                    </section>
                )}
            </div>

            {readyMedia && (
                <section className={Style.ready}>
                    <div className={Style.readyBadge}>
                        <FaCheck />
                        Media package ready
                    </div>
                    <div className={Style.readyGrid}>
                        <div>
                            <PvPScalpelVideoPlayer
                                src={readyMedia.videoUrl}
                                poster={readyMedia.thumbnailUrl}
                                title={readyMedia.title}
                            />
                        </div>
                        <article className={Style.readyDetails}>
                            <img src={readyMedia.thumbnailUrl} alt="Selected video cover" />
                            <h2>{readyMedia.title}</h2>
                            <p>{readyMedia.description}</p>
                            <dl>
                                <div>
                                    <dt>Source</dt>
                                    <dd>{formatVideoType(readyMedia.chunkManifest)}</dd>
                                </div>
                                <div>
                                    <dt>Duration</dt>
                                    <dd>{formatMediaTime(readyMedia.duration)}</dd>
                                </div>
                                <div>
                                    <dt>Size</dt>
                                    <dd>
                                        {formatBytes(
                                            readyMedia.chunkManifest.totalBytes,
                                        )}
                                    </dd>
                                </div>
                                <div>
                                    <dt>Parts</dt>
                                    <dd>{readyMedia.chunkManifest.chunkCount}</dd>
                                </div>
                                <div>
                                    <dt>Part size</dt>
                                    <dd>
                                        {formatMiB(
                                            readyMedia.chunkManifest.totalBytes
                                                / readyMedia.chunkManifest.chunkCount,
                                        )}{" "}
                                        approx.
                                    </dd>
                                </div>
                                <div>
                                    <dt>Characters</dt>
                                    <dd>{readyMedia.characterIds.length}</dd>
                                </div>
                            </dl>
                            <div className={Style.readyCharacters}>
                                {readyMedia.characters.map((character) => (
                                    <span key={character.id}>
                                        <img src={character.image} alt="" />
                                        {character.name}
                                    </span>
                                ))}
                            </div>
                        </article>
                    </div>
                </section>
            )}
        </section>
    );
}
