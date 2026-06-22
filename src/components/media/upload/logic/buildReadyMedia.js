export function buildReadyMedia(state) {
    const thumbnailUrl = URL.createObjectURL(state.selectedThumbnail.file);

    return {
        title: state.title.trim(),
        description: state.description.trim(),
        videoUrl: state.videoUrl,
        chunks: state.preparedVideo.chunks,
        chunkManifest: state.preparedVideo.manifest,
        thumbnailFile: state.selectedThumbnail.file,
        thumbnailUrl,
        duration: state.duration,
        characters: [...state.characters],
        characterIds: state.characters.map((character) => character.id),
    };
}
