import {
    FaArrowLeft,
    FaArrowRotateRight,
    FaCheck,
    FaImage,
} from "react-icons/fa6";
import DataTravelLoader from "../../DataTravelLoader.jsx";
import { formatMediaTime } from "../../../helpers/mediaFormatting.js";
import Style from "../../../Styles/modular/MediaUpload.module.css";
import { LONG_VIDEO_SECONDS } from "./mediaUploadConstants.js";
import { useMediaUpload } from "./MediaUploadContext.jsx";

export default function ThumbnailStage() {
    const {
        captureThumbnails,
        duration,
        error,
        finishPackage,
        generatingThumbnails,
        openStage,
        selectThumbnail,
        selectedThumbnail,
        thumbnails,
        videoFile,
    } = useMediaUpload();

    return (
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
                                onClick={() => selectThumbnail(thumbnail)}
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
    );
}
