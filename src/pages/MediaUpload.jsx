import { FaFilm } from "react-icons/fa6";
import {
    MediaUploadProvider,
} from "../components/media/upload/context/MediaUploadProvider.jsx";
import { useMediaUpload } from "../components/media/upload/context/useMediaUpload.js";
import MetadataStage from "../components/media/upload/MetadataStage.jsx";
import ReadyMediaPreview from "../components/media/upload/ReadyMediaPreview.jsx";
import StageNav from "../components/media/upload/StageNav.jsx";
import ThumbnailStage from "../components/media/upload/ThumbnailStage.jsx";
import VideoSelectStage from "../components/media/upload/VideoSelectStage.jsx";
import Style from "../Styles/modular/MediaUpload.module.css";

function MediaUploadEditor() {
    const { currentStage } = useMediaUpload();

    return (
        <>
            <StageNav />

            <div className={Style.editor}>
                {currentStage === 1 && <VideoSelectStage />}
                {currentStage === 2 && <MetadataStage />}
                {currentStage === 3 && <ThumbnailStage />}
            </div>

            <ReadyMediaPreview />
        </>
    );
}

export default function MediaUpload() {
    return (
        <MediaUploadProvider>
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

                <MediaUploadEditor />
            </section>
        </MediaUploadProvider>
    );
}