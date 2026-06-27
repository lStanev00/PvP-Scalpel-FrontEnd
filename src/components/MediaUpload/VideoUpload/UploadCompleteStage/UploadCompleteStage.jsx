import { FiCheckCircle } from "react-icons/fi";

import Style from "./UploadCompleteStage.module.css";

export default function UploadCompleteStage({ progressPercent }) {
    return (
        <section className={Style.uploadPanel} aria-labelledby="video-upload-complete-title">
            <span className={Style.iconBadge} aria-hidden="true">
                <FiCheckCircle />
            </span>

            <div className={Style.copy}>
                <span className={Style.eyebrow}>Upload stage</span>
                <h2 id="video-upload-complete-title">Upload complete</h2>
                <p>Your video has been uploaded successfully.</p>
            </div>

            <div className={Style.progressWrap}>
                <div className={Style.progressTrack} aria-hidden="true">
                    <span
                        className={Style.progressFill}
                        style={{ width: `${Math.max(0, Math.min(100, progressPercent))}%` }}
                    />
                </div>
                <span className={Style.progressText}>100%</span>
            </div>
        </section>
    );
}
