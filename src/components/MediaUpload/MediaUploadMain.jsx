import { FiUploadCloud } from "react-icons/fi";
import { useMediaUploadContext } from "./MediaUploadContext.js";
import VideoInput from "./VideoInput/VideoInput.jsx";
import Style from "./MediaUploadMain.module.css";
import { useState } from "react";
import VideoUpload from "./VideoUpload/VideoUpload.jsx";
import VideoDetails from "./VideoDetails/VideoDetails.jsx";
import { VideoDetailsProvider } from "./VideoDetails/VideoDetailsProvider.js";
import VideoFinnalize from "./VideoFinnalize/VideoFinnalize.jsx";

export default function MediaUploadMain() {
    const { videoInputRef } = useMediaUploadContext();
    const [activeStage, setStage] = useState(0);

    const stages = [
        [
            () => <VideoInput videoInputRef={videoInputRef} setStage={setStage} />,
            "Select a file first. Details and publishing settings come after the file is ready.",
        ],
        [
            () => <VideoUpload setStage={setStage} />,
            "Video selected. Upload the prepared media parts next.",
        ],
        [
            () => (
                <VideoDetailsProvider>
                    <VideoDetails setStage={setStage} />
                </VideoDetailsProvider>
            ),
            "Give your video a name and description. Select the bracket and the characters involved.",
        ],
        [
            () => <VideoFinnalize />,
            "Review your video and confirm the content statement before finalizing.",
        ],
    ];

    return (
        <main className={Style.page}>
            <div className={Style.backdrop} aria-hidden="true">
                <span className={`${Style.glow} ${Style.glowTop}`} />
                <span className={`${Style.glow} ${Style.glowSide}`} />
                <span className={Style.pattern} />
            </div>

            <section className={Style.shell} aria-labelledby="media-upload-title">
                <header className={Style.hero}>
                    <div className={Style.heroInner}>
                        <div className={Style.badge}>
                            <FiUploadCloud className={Style.badgeIcon} />
                            <span>Media upload</span>
                        </div>

                        <h1 className={Style.title} id="media-upload-title">
                            Upload WoW video
                            <span className={Style.titleUnderline} />
                        </h1>

                        <p className={Style.heroText}>
                            {stages[activeStage] && stages[activeStage][1]}
                        </p>
                    </div>
                </header>

                {stages[activeStage] && stages[activeStage][0]()}
            </section>
        </main>
    );
}
