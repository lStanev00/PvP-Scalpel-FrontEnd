export const MAX_CHUNK_SIZE = 90 * 1024 * 1024;
const MAX_MEDIA_PARTS = 100;
export const MAX_MEDIA_BYTES = 10 * 1024 * 1024 * 1024;

/**
 * Splits a selected video into exact, contiguous byte ranges.
 *
 * The chunks are raw slices of the original file. Concatenating their bytes in
 * ascending index order reconstructs the original file exactly.
 *
 * @param {File} file Browser video file selected by the user.
 * @returns {Array<{
 *     index: number,
 *     totalParts: number,
 *     start: number,
 *     end: number,
 *     size: number,
 *     blob: Blob
 * }>}
 */
export default function splitVideoIntoChunks(file) {
    if (!(file instanceof Blob)) {
        throw new TypeError("A video File or Blob is required.");
    }
    if (
        !Number.isSafeInteger(file.size) ||
        file.size <= 0 ||
        file.size > MAX_MEDIA_BYTES
    ) {
        throw new RangeError("The selected video has an unsupported size.");
    }

    const totalParts = Math.ceil(file.size / MAX_CHUNK_SIZE);
    if (totalParts <= 0 || totalParts > MAX_MEDIA_PARTS) {
        throw new RangeError(`The selected video requires more than ${MAX_MEDIA_PARTS} parts.`);
    }

    const baseChunkSize = Math.floor(file.size / totalParts);
    const remainder = file.size % totalParts;
    const chunks = [];
    let start = 0;

    for (let index = 0; index < totalParts; index += 1) {
        const size = baseChunkSize + (index < remainder ? 1 : 0);
        const end = start + size;
        const blob = file.slice(start, end);

        if (blob.size !== size || start !== (chunks.at(-1)?.end ?? 0)) {
            throw new Error(`Failed to create contiguous video part ${index}.`);
        }

        chunks.push({
            index,
            totalParts,
            start,
            end,
            size,
            blob,
        });
        start = end;
    }

    if (
        start !== file.size ||
        chunks.reduce((total, chunk) => total + chunk.size, 0) !== file.size
    ) {
        throw new Error("Video chunks do not reconstruct the complete selected file.");
    }

    return chunks;
}

/**
 * Calculates the lowercase SHA-256 digest for one exact video part.
 *
 * @param {Blob} blob
 * @returns {Promise<string>}
 */
export async function sha256VideoChunk(blob) {
    if (!(blob instanceof Blob) || blob.size <= 0) {
        throw new TypeError("A non-empty video part is required for hashing.");
    }
    if (!globalThis.crypto?.subtle) {
        throw new Error("This browser cannot verify video upload integrity.");
    }

    const digest = await globalThis.crypto.subtle.digest(
        "SHA-256",
        await blob.arrayBuffer(),
    );

    return Array.from(new Uint8Array(digest), (byte) =>
        byte.toString(16).padStart(2, "0"),
    ).join("");
}
