/**
 * Dev note:
 * Browser-only thumbnail helper for local video files or an already-rendered
 * video element. The default export creates an off-DOM video element from a
 * file. The named export reuses an existing HTMLVideoElement, such as the one
 * exposed by VideoPlayer's mediaRef. Both paths sample one frame from the
 * start, middle, and end thirds of the media and return three JPEG blobs. This
 * helper does not upload, persist, or create preview URLs for the thumbnails.
 */

const THUMBNAIL_MIME_TYPE = "image/jpeg";
const THUMBNAIL_QUALITY = 0.8;
const EDGE_PADDING_SECONDS = 0.25;

/**
 * Generate three thumbnail blobs from randomized start, middle, and end
 * timestamps in a provided video file.
 *
 * @param {File} file - Browser video file selected by the user.
 * @returns {Promise<Blob[]>} Resolves with exactly three JPEG thumbnail blobs.
 * @throws {TypeError} When the provided value is not a File/Blob.
 * @throws {Error} When the video cannot load, seek, or render to a blob.
 */
export default async function thumbnailGenerate(file) {
    if (!(file instanceof Blob)) {
        throw new TypeError("thumbnailGenerate expects a browser File or Blob.");
    }

    const objectUrl = URL.createObjectURL(file);
    const video = document.createElement("video");

    video.muted = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.src = objectUrl;

    try {
        await waitForVideoMetadata(video, true);
        return generateThumbnailsFromLoadedVideo(video);
    } finally {
        cleanupVideo(video);
        URL.revokeObjectURL(objectUrl);
    }
}

/**
 * Generate three thumbnail blobs from randomized start, middle, and end
 * timestamps using an existing video element.
 *
 * This avoids creating a second video element when the upload flow already has
 * a rendered player. The function pauses while seeking and restores the
 * original playback time/play state after capture.
 *
 * @param {HTMLVideoElement} video - Existing loaded or loading video element.
 * @returns {Promise<Blob[]>} Resolves with exactly three JPEG thumbnail blobs.
 * @throws {TypeError} When the provided value is not an HTMLVideoElement.
 * @throws {Error} When the video cannot load metadata, seek, or render to a blob.
 */
export async function generateThumbnailsFromVideoElement(video) {
    if (!(video instanceof HTMLVideoElement)) {
        throw new TypeError("generateThumbnailsFromVideoElement expects an HTMLVideoElement.");
    }

    await waitForVideoMetadata(video, false);

    const originalTime = video.currentTime;
    const wasPaused = video.paused;

    video.pause();

    try {
        return await generateThumbnailsFromLoadedVideo(video);
    } finally {
        await restoreVideoPlayback(video, originalTime, wasPaused);
    }
}

async function generateThumbnailsFromLoadedVideo(video) {
    if (!Number.isFinite(video.duration) || video.duration <= 0) {
        throw new Error("Video duration is not available.");
    }

    const timestamps = getRandomSegmentTimestamps(video.duration);
    const thumbnails = [];

    for (const time of timestamps) {
        await seekVideo(video, time);
        thumbnails.push(await captureVideoFrame(video));
    }

    return thumbnails;
}

function waitForVideoMetadata(video, shouldLoad) {
    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
        const cleanup = () => {
            video.removeEventListener("loadedmetadata", handleLoadedMetadata);
            video.removeEventListener("error", handleError);
        };

        const handleLoadedMetadata = () => {
            cleanup();
            resolve();
        };

        const handleError = () => {
            cleanup();
            reject(new Error("Video metadata failed to load."));
        };

        video.addEventListener("loadedmetadata", handleLoadedMetadata, { once: true });
        video.addEventListener("error", handleError, { once: true });

        if (shouldLoad) {
            video.load();
        }
    });
}

function seekVideo(video, time) {
    if (Math.abs(video.currentTime - time) < 0.01) {
        return new Promise((resolve) => {
            requestAnimationFrame(resolve);
        });
    }

    return new Promise((resolve, reject) => {
        const cleanup = () => {
            video.removeEventListener("seeked", handleSeeked);
            video.removeEventListener("error", handleError);
        };

        const handleSeeked = () => {
            cleanup();
            resolve();
        };

        const handleError = () => {
            cleanup();
            reject(new Error(`Video failed to seek to ${time.toFixed(2)}s.`));
        };

        video.addEventListener("seeked", handleSeeked, { once: true });
        video.addEventListener("error", handleError, { once: true });

        video.currentTime = time;
    });
}

function captureVideoFrame(video) {
    const canvas = document.createElement("canvas");
    const width = video.videoWidth;
    const height = video.videoHeight;

    if (!width || !height) {
        throw new Error("Video frame dimensions are not available.");
    }

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");

    if (!context) {
        throw new Error("Could not create a canvas rendering context.");
    }

    context.drawImage(video, 0, 0, width, height);

    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error("Canvas failed to generate a thumbnail blob."));
                return;
            }

            resolve(blob);
        }, THUMBNAIL_MIME_TYPE, THUMBNAIL_QUALITY);
    });
}

function getRandomSegmentTimestamps(duration) {
    const segmentLength = duration / 3;

    return [0, 1, 2].map((segmentIndex) => {
        const segmentStart = segmentIndex * segmentLength;
        const segmentEnd = segmentIndex === 2
            ? duration
            : (segmentIndex + 1) * segmentLength;

        return getRandomTimeInSegment(segmentStart, segmentEnd, duration);
    });
}

function getRandomTimeInSegment(segmentStart, segmentEnd, duration) {
    const safeStart = Math.min(segmentStart + EDGE_PADDING_SECONDS, segmentEnd);
    const safeEnd = Math.max(segmentEnd - EDGE_PADDING_SECONDS, safeStart);
    const fallbackTime = segmentStart + ((segmentEnd - segmentStart) / 2);
    const randomTime = safeEnd > safeStart
        ? safeStart + (Math.random() * (safeEnd - safeStart))
        : fallbackTime;

    return clamp(randomTime, 0, Math.max(0, duration - 0.05));
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function cleanupVideo(video) {
    video.pause();
    video.removeAttribute("src");
    video.load();
}

async function restoreVideoPlayback(video, originalTime, wasPaused) {
    try {
        if (Number.isFinite(originalTime)) {
            await seekVideo(video, originalTime);
        }

        if (!wasPaused) {
            await video.play();
        }
    } catch {
        // Thumbnail generation succeeded; restore failures should not hide that.
    }
}
