import { FiAlertTriangle, FiLoader } from "react-icons/fi";

import Style from "./UploadInitializeStage.module.css";

export default function UploadInitializeStage({ progressPercent, error }) {
    return (
        <section className={Style.uploadPanel} aria-labelledby="video-upload-initialize-title">
            <span className={Style.iconBadge} aria-hidden="true">
                <FiLoader />
            </span>

            <div className={Style.copy}>
                <span className={Style.eyebrow}>Upload stage</span>
                <h2 id="video-upload-initialize-title">Preparing upload</h2>
                <p>Your video is being prepared for upload.</p>
            </div>

            <div className={Style.progressWrap}>
                <div className={Style.progressTrack} aria-hidden="true">
                    <span
                        className={Style.progressFill}
                        style={{ width: `${Math.max(0, Math.min(100, progressPercent))}%` }}
                    />
                </div>
                <span className={Style.progressText}>{progressPercent}%</span>
            </div>

            {error && (
                <p className={Style.errorMessage} role="alert">
                    <FiAlertTriangle aria-hidden="true" />
                    {error}
                </p>
            )}
        </section>
    );
}
