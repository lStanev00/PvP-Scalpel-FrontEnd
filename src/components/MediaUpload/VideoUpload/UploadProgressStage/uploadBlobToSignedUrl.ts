type UploadProgressEvent = {
    loaded: number;
    total: number;
};

type UploadProgressCallback = (event: UploadProgressEvent) => void;

const UPLOAD_TIMEOUT_MS = 10 * 60 * 1000;

export default function uploadBlobToSignedUrl(
    file: Blob,
    signedUrl: string,
    onProgress?: UploadProgressCallback,
) {
    return new Promise<boolean>((resolve, reject) => {
        if (!(file instanceof Blob) || file.size <= 0) {
            reject(new TypeError("A non-empty upload part is required."));
            return;
        }
        if (typeof signedUrl !== "string" || !signedUrl.startsWith("https://")) {
            reject(new TypeError("A valid HTTPS upload URL is required."));
            return;
        }

        const xhr = new XMLHttpRequest();
        xhr.open("PUT", signedUrl);
        xhr.timeout = UPLOAD_TIMEOUT_MS;
        xhr.setRequestHeader("Content-Type", "application/octet-stream");

        xhr.upload.onprogress = (event) => {
            if (!event.lengthComputable) return;
            onProgress?.({
                loaded: event.loaded,
                total: event.total,
            });
        };

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(true);
                return;
            }

            reject(new Error(`Upload failed with HTTP ${xhr.status}`));
        };

        xhr.onerror = () => {
            reject(new Error("Upload failed because of a network error."));
        };
        xhr.ontimeout = () => {
            reject(new Error("Upload exceeded the ten-minute part timeout."));
        };
        xhr.onabort = () => {
            reject(new Error("Upload was aborted."));
        };

        xhr.send(file);
    });
}
