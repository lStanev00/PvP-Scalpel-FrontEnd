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
import splitVideoIntoChunks from "./VideoInput/videoSlicer.js";

type VideoMimeType = "video/mp4" | "video/webm" | "video/ogg";
type VideoChunk = ReturnType<typeof splitVideoIntoChunks>[number];

type VideoFile = File & {
    type: VideoMimeType;
};

type MediaUploadContextValue = {
    videoInputRef: RefObject<HTMLInputElement | null>;
    videoFile: VideoFile | null;
    setVideoFile: Dispatch<SetStateAction<VideoFile | null>>;
    isVideoLocked: boolean;
    setIsVideoLocked: Dispatch<SetStateAction<boolean>>;
    videoChunks: VideoChunk[] | null;
};

type MediaUploadProviderProps = {
    children: ReactNode;
};

export const MediaUpload = createContext<MediaUploadContextValue | null>(null);

export function MediaUploadProvider({ children }: MediaUploadProviderProps) {
    const videoInputRef = useRef<HTMLInputElement | null>(null);
    const [videoFile, setVideoFile] = useState<VideoFile | null>(null);
    const [isVideoLocked, setIsVideoLocked] = useState(false);

    const videoChunks = useMemo(() => {
        if (!videoFile) return null;
        return splitVideoIntoChunks(videoFile);
    }, [videoFile]);

    const value = useMemo<MediaUploadContextValue>(() => {
        return { videoInputRef, videoFile, setVideoFile, isVideoLocked, setIsVideoLocked, videoChunks };
    }, [isVideoLocked, videoChunks, videoFile]);

    return <MediaUpload.Provider value={value}>{children}</MediaUpload.Provider>;
}

export function useMediaUploadContext() {
    const context = useContext(MediaUpload);

    if (!context) {
        throw new Error("useMediaUpload must be used inside MediaUploadProvider");
    }

    return context;
}
