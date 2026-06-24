import {
    createContext,
    useContext,
    useMemo,
    useRef,
    type ReactNode,
    type RefObject,
    type SetStateAction,
    type Dispatch,
    useState,
} from "react";

type VideoMimeType = "video/mp4" | "video/webm" | "video/ogg";

type VideoFile = File & {
    type: VideoMimeType;
};

type MediaUploadContextValue = {
    videoInputRef: RefObject<HTMLInputElement | null>;
    videoFile: VideoFile | null;
    setVideoFile: Dispatch<SetStateAction<VideoFile | null>>;
};

type MediaUploadProviderProps = {
    children: ReactNode;
};

export const MediaUpload = createContext<MediaUploadContextValue | null>(null);

export function MediaUploadProvider({ children }: MediaUploadProviderProps) {
    const videoInputRef = useRef<HTMLInputElement | null>(null);
    const [videoFile, setVideoFile] = useState<VideoFile | null>(null);

    const value = useMemo<MediaUploadContextValue>(() => {
        return { videoInputRef, videoFile, setVideoFile };
    }, []);
    return <MediaUpload.Provider value={value}>{children}</MediaUpload.Provider>;
}

export function useMediaUploadContext() {
    // access in code the values
    const context = useContext(MediaUpload);

    if (!context) {
        throw new Error("useMediaUpload must be used inside MediaUploadProvider");
    }

    return context;
}
