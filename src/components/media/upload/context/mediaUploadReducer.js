export const MEDIA_UPLOAD_ACTION = Object.freeze({
    SET_ERROR: "error/set",
    SET_DRAG_ACTIVE: "drag/set",
    OPEN_STAGE: "stage/open",
    SELECT_VIDEO: "video/select",
    REMOVE_VIDEO: "video/remove",
    SET_VIDEO_URL: "video/url",
    SET_DURATION: "video/duration",
    START_PREPARATION: "prepare/start",
    COMPLETE_PREPARATION: "prepare/success",
    FAIL_PREPARATION: "prepare/error",
    RESET_PREPARATION: "prepare/reset",
    UPDATE_TITLE: "metadata/title",
    UPDATE_DESCRIPTION: "metadata/description",
    UPDATE_CHARACTERS: "metadata/characters",
    COMPLETE_METADATA: "metadata/complete",
    CLEAR_THUMBNAILS: "thumbnails/clear",
    START_THUMBNAILS: "thumbnails/start",
    COMPLETE_THUMBNAILS: "thumbnails/success",
    FAIL_THUMBNAILS: "thumbnails/error",
    FINISH_THUMBNAILS: "thumbnails/finish",
    SELECT_THUMBNAIL: "thumbnail/select",
    SET_READY_MEDIA: "ready/set",
});

export const initialMediaUploadState = {
    currentStage: 1,
    title: "",
    description: "",
    characters: [],
    metadataComplete: false,
    videoFile: null,
    videoUrl: "",
    duration: 0,
    preparedVideo: null,
    preparingVideo: false,
    thumbnails: [],
    selectedThumbnail: null,
    generatingThumbnails: false,
    dragActive: false,
    error: "",
    readyMedia: null,
};

export const mediaUploadActions = {
    setError: (error) => ({ type: MEDIA_UPLOAD_ACTION.SET_ERROR, error }),
    setDragActive: (dragActive) => ({
        type: MEDIA_UPLOAD_ACTION.SET_DRAG_ACTIVE,
        dragActive,
    }),
    openStage: (stage) => ({ type: MEDIA_UPLOAD_ACTION.OPEN_STAGE, stage }),
    selectVideo: (file) => ({ type: MEDIA_UPLOAD_ACTION.SELECT_VIDEO, file }),
    removeVideo: () => ({ type: MEDIA_UPLOAD_ACTION.REMOVE_VIDEO }),
    setVideoUrl: (videoUrl) => ({ type: MEDIA_UPLOAD_ACTION.SET_VIDEO_URL, videoUrl }),
    setDuration: (duration) => ({ type: MEDIA_UPLOAD_ACTION.SET_DURATION, duration }),
    startPreparation: () => ({ type: MEDIA_UPLOAD_ACTION.START_PREPARATION }),
    completePreparation: (preparedVideo) => ({
        type: MEDIA_UPLOAD_ACTION.COMPLETE_PREPARATION,
        preparedVideo,
    }),
    failPreparation: (error) => ({
        type: MEDIA_UPLOAD_ACTION.FAIL_PREPARATION,
        error,
    }),
    resetPreparation: () => ({ type: MEDIA_UPLOAD_ACTION.RESET_PREPARATION }),
    updateTitle: (title) => ({ type: MEDIA_UPLOAD_ACTION.UPDATE_TITLE, title }),
    updateDescription: (description) => ({
        type: MEDIA_UPLOAD_ACTION.UPDATE_DESCRIPTION,
        description,
    }),
    updateCharacters: (characters) => ({
        type: MEDIA_UPLOAD_ACTION.UPDATE_CHARACTERS,
        characters,
    }),
    completeMetadata: () => ({ type: MEDIA_UPLOAD_ACTION.COMPLETE_METADATA }),
    clearThumbnails: () => ({ type: MEDIA_UPLOAD_ACTION.CLEAR_THUMBNAILS }),
    startThumbnails: () => ({ type: MEDIA_UPLOAD_ACTION.START_THUMBNAILS }),
    completeThumbnails: (thumbnails, selectedThumbnail) => ({
        type: MEDIA_UPLOAD_ACTION.COMPLETE_THUMBNAILS,
        thumbnails,
        selectedThumbnail,
    }),
    failThumbnails: (error) => ({ type: MEDIA_UPLOAD_ACTION.FAIL_THUMBNAILS, error }),
    finishThumbnails: () => ({ type: MEDIA_UPLOAD_ACTION.FINISH_THUMBNAILS }),
    selectThumbnail: (thumbnail) => ({
        type: MEDIA_UPLOAD_ACTION.SELECT_THUMBNAIL,
        thumbnail,
    }),
    setReadyMedia: (readyMedia) => ({
        type: MEDIA_UPLOAD_ACTION.SET_READY_MEDIA,
        readyMedia,
    }),
};

export function mediaUploadReducer(state, action) {
    switch (action.type) {
        case MEDIA_UPLOAD_ACTION.SET_ERROR:
            return { ...state, error: action.error || "" };
        case MEDIA_UPLOAD_ACTION.SET_DRAG_ACTIVE:
            return { ...state, dragActive: Boolean(action.dragActive) };
        case MEDIA_UPLOAD_ACTION.OPEN_STAGE:
            return { ...state, currentStage: action.stage, error: "" };
        case MEDIA_UPLOAD_ACTION.SELECT_VIDEO:
            return {
                ...state,
                currentStage: 1,
                videoFile: action.file,
                duration: 0,
                preparedVideo: null,
                preparingVideo: true,
                thumbnails: [],
                selectedThumbnail: null,
                generatingThumbnails: false,
                metadataComplete: false,
                readyMedia: null,
                error: "",
            };
        case MEDIA_UPLOAD_ACTION.REMOVE_VIDEO:
            return { ...initialMediaUploadState };
        case MEDIA_UPLOAD_ACTION.SET_VIDEO_URL:
            return { ...state, videoUrl: action.videoUrl || "" };
        case MEDIA_UPLOAD_ACTION.SET_DURATION:
            return { ...state, duration: action.duration || 0, error: "" };
        case MEDIA_UPLOAD_ACTION.START_PREPARATION:
            return { ...state, preparedVideo: null, preparingVideo: true };
        case MEDIA_UPLOAD_ACTION.COMPLETE_PREPARATION:
            return { ...state, preparedVideo: action.preparedVideo, preparingVideo: false };
        case MEDIA_UPLOAD_ACTION.FAIL_PREPARATION:
            return {
                ...state,
                preparedVideo: null,
                preparingVideo: false,
                error: action.error || "Unable to prepare video chunks.",
            };
        case MEDIA_UPLOAD_ACTION.RESET_PREPARATION:
            return { ...state, preparedVideo: null, preparingVideo: false };
        case MEDIA_UPLOAD_ACTION.UPDATE_TITLE:
            return { ...state, title: action.title, metadataComplete: false, readyMedia: null };
        case MEDIA_UPLOAD_ACTION.UPDATE_DESCRIPTION:
            return {
                ...state,
                description: action.description,
                metadataComplete: false,
                readyMedia: null,
            };
        case MEDIA_UPLOAD_ACTION.UPDATE_CHARACTERS:
            return {
                ...state,
                characters: action.characters,
                metadataComplete: false,
                readyMedia: null,
            };
        case MEDIA_UPLOAD_ACTION.COMPLETE_METADATA:
            return { ...state, metadataComplete: true, readyMedia: null, currentStage: 3 };
        case MEDIA_UPLOAD_ACTION.CLEAR_THUMBNAILS:
            return {
                ...state,
                thumbnails: [],
                selectedThumbnail: null,
                generatingThumbnails: false,
            };
        case MEDIA_UPLOAD_ACTION.START_THUMBNAILS:
            return {
                ...state,
                generatingThumbnails: true,
                selectedThumbnail: null,
                error: "",
            };
        case MEDIA_UPLOAD_ACTION.COMPLETE_THUMBNAILS:
            return {
                ...state,
                thumbnails: action.thumbnails,
                selectedThumbnail: action.selectedThumbnail || null,
            };
        case MEDIA_UPLOAD_ACTION.FAIL_THUMBNAILS:
            return {
                ...state,
                thumbnails: [],
                error: action.error || "Unable to generate cover images.",
            };
        case MEDIA_UPLOAD_ACTION.FINISH_THUMBNAILS:
            return { ...state, generatingThumbnails: false };
        case MEDIA_UPLOAD_ACTION.SELECT_THUMBNAIL:
            return {
                ...state,
                selectedThumbnail: action.thumbnail,
                readyMedia: null,
            };
        case MEDIA_UPLOAD_ACTION.SET_READY_MEDIA:
            return { ...state, readyMedia: action.readyMedia };
        default:
            return state;
    }
}
