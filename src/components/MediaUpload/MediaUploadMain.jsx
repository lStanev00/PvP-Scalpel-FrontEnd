import { FiUploadCloud } from "react-icons/fi";
import { useMediaUploadContext } from "./MediaUploadContext.js";
import VideoInput from "./VideoInput/VideoInput.jsx";
import Style from "./MediaUploadMain.module.css";
import { useEffect, useMemo, useState } from "react";
import VideoDetails from "./VideoDetails/VideoDetails.jsx";
import { VideoDetailsProvider } from "./VideoDetails/VideoDetailsProvider.js";

export default function MediaUploadMain() {
    const { videoInputRef, videoFile } = useMediaUploadContext();
    const [activeStage, setStage] = useState(0);

    const stages = [
        [
            () => <VideoInput videoInputRef={videoInputRef} setStage={setStage} />,
            "Select a file first. Details and publishing settings come after the file is ready.",
        ],
        [() => <VideoDetails />, "Video selected. Continue with details next."],
    ];

    return (
        <VideoDetailsProvider>
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
        </VideoDetailsProvider>
    );
}
