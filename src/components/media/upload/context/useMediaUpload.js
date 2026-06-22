import { createContext, useContext } from "react";

export const MediaUploadStateContext = createContext(null);
export const MediaUploadActionsContext = createContext(null);

export function useMediaUploadState() {
    const state = useContext(MediaUploadStateContext);
    if (!state) {
        throw new Error("useMediaUploadState must be used inside MediaUploadProvider.");
    }
    return state;
}

export function useMediaUploadActions() {
    const actions = useContext(MediaUploadActionsContext);
    if (!actions) {
        throw new Error("useMediaUploadActions must be used inside MediaUploadProvider.");
    }
    return actions;
}

export function useMediaUpload() {
    return {
        ...useMediaUploadState(),
        ...useMediaUploadActions(),
    };
}
