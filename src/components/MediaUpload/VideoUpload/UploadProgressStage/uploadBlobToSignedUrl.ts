type UploadProgressEvent = {
    loaded: number;
    total: number;
};

type UploadProgressCallback = (event: UploadProgressEvent) => void;

export default function uploadBlobToSignedUrl(
    file: Blob,
    signedUrl: string,
    onProgress?: UploadProgressCallback,
) {
    return new Promise<boolean>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open("PUT", signedUrl);
        xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");

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

            reject(new Error(`Upload failed: ${xhr.status} ${xhr.responseText || ""}`.trim()));
        };

        xhr.onerror = () => {
            reject(new Error("Upload failed: network error"));
        };

        xhr.onabort = () => {
            reject(new Error("Upload failed: request aborted"));
        };

        xhr.send(file);
    });
}
