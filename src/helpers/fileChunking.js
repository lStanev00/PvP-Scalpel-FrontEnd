export const MAX_CHUNK_BYTES = 90 * 1024 * 1024;

export function splitFileIntoEqualChunks(file, maxChunkBytes = MAX_CHUNK_BYTES) {
    if (!(file instanceof Blob)) {
        throw new TypeError("A File or Blob is required.");
    }
    if (!Number.isSafeInteger(maxChunkBytes) || maxChunkBytes <= 0) {
        throw new RangeError("Maximum chunk size must be a positive integer.");
    }

    const chunkCount = Math.max(1, Math.ceil(file.size / maxChunkBytes));
    const baseSize = Math.floor(file.size / chunkCount);
    const largerChunkCount = file.size % chunkCount;
    const chunks = [];
    let start = 0;

    for (let index = 0; index < chunkCount; index += 1) {
        const size = baseSize + (index < largerChunkCount ? 1 : 0);
        const end = start + size;

        chunks.push({
            index,
            start,
            end,
            size,
            blob: file.slice(start, end, file.type),
        });
        start = end;
    }

    return {
        chunks,
        manifest: {
            originalName: file.name || "video",
            mimeType: file.type || "application/octet-stream",
            totalBytes: file.size,
            chunkCount,
            chunkSizes: chunks.map((chunk) => chunk.size),
        },
    };
}
