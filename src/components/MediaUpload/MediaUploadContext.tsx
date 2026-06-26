import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    type ReactNode,
    type RefObject,
    type SetStateAction,
    type Dispatch,
    useState,
} from "react";
import splitVideoIntoChunks from "./VideoInput/videoSlicer.js";
import { UserContext } from "../../hooks/ContextVariables.jsx";

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
    userMedia: unknown[];
    setUserMedia: Dispatch<SetStateAction<unknown[]>>;
    retrieveUserMedia: () => Promise<unknown>;
};

type MediaUploadProviderProps = {
    children: ReactNode;
};

export const MediaUpload = createContext<MediaUploadContextValue | null>(null);

export function MediaUploadProvider({ children }: MediaUploadProviderProps) {
    const { httpFetch } = useContext(UserContext);
    const videoInputRef = useRef<HTMLInputElement | null>(null);
    const [videoFile, setVideoFile] = useState<VideoFile | null>(null);
    const [isVideoLocked, setIsVideoLocked] = useState(false);
    const [userMedia, setUserMedia] = useState<unknown[]>([]);

    const retrieveUserMedia = useCallback(async () => {
        const req = await httpFetch("/userMedia");

        if (req.status === 200) {
            setUserMedia(req.data);
        }

        return req;
    }, [httpFetch]);

    const videoChunks = useMemo(() => {
        if (!videoFile) return null;
        return splitVideoIntoChunks(videoFile);
    }, [videoFile]);

    useEffect(() => {
        retrieveUserMedia();
    }, [retrieveUserMedia]);

    const value = useMemo<MediaUploadContextValue>(() => {
        return {
            videoInputRef,
            videoFile,
            setVideoFile,
            isVideoLocked,
            setIsVideoLocked,
            videoChunks,
            userMedia,
            setUserMedia,
            retrieveUserMedia,
        };
    }, [isVideoLocked, retrieveUserMedia, userMedia, videoChunks, videoFile]);

    return <MediaUpload.Provider value={value}>{children}</MediaUpload.Provider>;
}

export function useMediaUploadContext() {
    const context = useContext(MediaUpload);

    if (!context) {
        throw new Error("useMediaUpload must be used inside MediaUploadProvider");
    }

    return context;
}
