export function validateMetadata(state) {
    if (!state.title.trim()) return "Add a video title.";
    if (!state.description.trim()) return "Add a video description.";
    if (state.characters.length === 0) return "Attach at least one character.";
    if (!state.preparedVideo) return "Prepare the video parts first.";
    return "";
}

export function validateReadyPackage(state) {
    if (!state.videoFile || !state.videoUrl || !state.duration) {
        return "Select a playable video first.";
    }
    if (!state.preparedVideo) return "Prepare the video parts first.";
    if (!state.metadataComplete) return "Complete the metadata stage first.";
    if (!state.selectedThumbnail) return "Choose a cover image.";
    return "";
}
