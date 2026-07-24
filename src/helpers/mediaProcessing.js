function waitForMediaEvent(element, eventName, errorMessage) {
    return new Promise((resolve, reject) => {
        const handleSuccess = () => {
            cleanup();
            resolve();
        };
        const handleError = () => {
            cleanup();
            reject(new Error(errorMessage));
        };
        const cleanup = () => {
            element.removeEventListener(eventName, handleSuccess);
            element.removeEventListener("error", handleError);
        };

        element.addEventListener(eventName, handleSuccess, { once: true });
        element.addEventListener("error", handleError, { once: true });
    });
}

function buildSampleTimes(start, end, count) {
    const span = Math.max(0.1, end - start);
    return Array.from({ length: count }, (_, index) => {
        const bucketStart = start + (span * index) / count;
        const bucketSize = span / count;
        const position = bucketStart + bucketSize * (0.25 + Math.random() * 0.5);
        return Math.min(end - 0.02, Math.max(start, position));
    });
}

function canvasToJpeg(canvas) {
    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (blob) resolve(blob);
                else reject(new Error("The browser could not create a cover image."));
            },
            "image/jpeg",
            0.88,
        );
    });
}

export async function generateVideoThumbnails({
    src,
    start,
    end,
    sourceDuration,
}) {
    const video = document.createElement("video");
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    const metadataPromise = waitForMediaEvent(
        video,
        "loadedmetadata",
        "Unable to read video metadata.",
    );
    video.src = src;

    await metadataPromise;
    const count = sourceDuration < 30 * 60 ? 3 : 5;
    const times = buildSampleTimes(start, end, count);
    const maxWidth = 1280;
    const scale = Math.min(1, maxWidth / Math.max(1, video.videoWidth));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
    canvas.height = Math.max(1, Math.round(video.videoHeight * scale));
    const context = canvas.getContext("2d");

    if (!context) throw new Error("Canvas image capture is unavailable.");

    const results = [];
    for (let index = 0; index < times.length; index += 1) {
        const time = times[index];
        const seekPromise = waitForMediaEvent(video, "seeked", "Unable to seek the video.");
        video.currentTime = time;
        await seekPromise;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const blob = await canvasToJpeg(canvas);
        const file = new File([blob], `cover-${index + 1}.jpg`, {
            type: "image/jpeg",
            lastModified: Date.now(),
        });
        results.push({ file, time });
    }

    video.removeAttribute("src");
    video.load();
    return results;
}
