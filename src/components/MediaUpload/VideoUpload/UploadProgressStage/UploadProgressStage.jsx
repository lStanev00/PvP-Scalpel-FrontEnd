import { FiAlertTriangle, FiLoader } from "react-icons/fi";

import Style from "./UploadProgressStage.module.css";

function formatUploadSpeed(bytesPerSecond) {
    if (!Number.isFinite(bytesPerSecond) || bytesPerSecond <= 0) return "";

    const units = ["B/s", "KB/s", "MB/s", "GB/s"];
    let speed = bytesPerSecond;
    let unitIndex = 0;

    while (speed >= 1024 && unitIndex < units.length - 1) {
        speed /= 1024;
        unitIndex += 1;
    }

    const precision = speed >= 10 || unitIndex === 0 ? 0 : 1;
    return `${speed.toFixed(precision)} ${units[unitIndex]}`;
}

export default function UploadProgressStage({
    progressPercent,
    error,
    isUploading,
    uploadSpeedBytesPerSecond,
}) {
    const uploadSpeed = formatUploadSpeed(uploadSpeedBytesPerSecond);

    return (
        <section className={Style.uploadPanel} aria-labelledby="video-upload-progress-title">
            <span className={Style.iconBadge} aria-hidden="true">
                <FiLoader />
            </span>

            <div className={Style.copy}>
                <span className={Style.eyebrow}>Upload stage</span>
                <h2 id="video-upload-progress-title">
                    {isUploading ? "Uploading video" : "Waiting for upload service"}
                </h2>
                <p>Keep this page open while the upload finishes.</p>
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

            {isUploading && uploadSpeed && (
                <p className={Style.speedText}>Upload speed {uploadSpeed}</p>
            )}

            {error && (
                <p className={Style.errorMessage} role="alert">
                    <FiAlertTriangle aria-hidden="true" />
                    {error}
                </p>
            )}
        </section>
    );
}
