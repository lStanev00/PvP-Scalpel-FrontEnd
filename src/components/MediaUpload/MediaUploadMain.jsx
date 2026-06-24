import { FiUploadCloud } from "react-icons/fi";
import { useMediaUploadContext } from "./MediaUploadContext.js";
import VideoInput from "./VideoInput/VideoInput.jsx";
import Style from "./MediaUploadMain.module.css";

export default function MediaUploadMain() {
    const { videoInputRef } = useMediaUploadContext();

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
                            Select a file first. Details and publishing settings come after the file is ready.
                        </p>
                    </div>
                </header>

                {/* <div className={Style.uploadPanel}> */}
                    <VideoInput videoInputRef={videoInputRef} />
                {/* </div> */}
            </section>
        </main>
    );
}
