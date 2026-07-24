const MAX_CHUNK_SIZE = 90 * 1024 * 1024;

/**
 * Splits a selected video file into balanced upload chunks.
 *
 * The chunk count is chosen from the 90 MiB maximum target size, then bytes are
 * distributed as evenly as possible so every part is close to the same size.
 *
 * @param {File} file Browser video file selected by the user.
 * @returns {Array<{
 *     index: number,
 *     totalParts: number,
 *     start: number,
 *     end: number,
 *     size: number,
 *     blob: Blob
 * }>} Ordered chunk descriptors. `start` is inclusive and `end` is exclusive.
 */
export default function splitVideoIntoChunks(file) {
    const totalParts = Math.ceil(file.size / MAX_CHUNK_SIZE);
    const baseChunkSize = Math.floor(file.size / totalParts);
    const remainder = file.size % totalParts;

    const chunks = [];
    let start = 0;

    for (let i = 0; i < totalParts; i++) {
        const currentChunkSize = baseChunkSize + (i < remainder ? 1 : 0);
        const end = start + currentChunkSize;

        const blob = file.slice(start, end, file.type);

        chunks.push({
            index: i,
            totalParts,
            start,
            end,
            size: blob.size,
            blob
        });

        start = end;
    }

    return chunks;
}
