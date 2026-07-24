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

type MediaMetaDoc = Record<string, unknown> & {
    _id?: string;
};

type MediaUploadContextValue = {
    videoInputRef: RefObject<HTMLInputElement | null>;
    videoFile: VideoFile | null;
    setVideoFile: Dispatch<SetStateAction<VideoFile | null>>;
    isVideoLocked: boolean;
    setIsVideoLocked: Dispatch<SetStateAction<boolean>>;
    videoChunks: VideoChunk[] | null;
    mediaMetaDocRef: RefObject<MediaMetaDoc | null>;
    setMediaMetaDoc: (mediaMetaDoc: MediaMetaDoc | null) => void;
    mergeMediaMetaDoc: (mediaMetaDoc: MediaMetaDoc) => void;
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
    const mediaMetaDocRef = useRef<MediaMetaDoc | null>(null);
    const [videoFile, setVideoFile] = useState<VideoFile | null>(null);
    const [isVideoLocked, setIsVideoLocked] = useState(false);
    const [userMedia, setUserMedia] = useState<unknown[]>([]);

    const setMediaMetaDoc = useCallback((mediaMetaDoc: MediaMetaDoc | null) => {
        mediaMetaDocRef.current = mediaMetaDoc;
    }, []);

    /**
     * Merges partial media metadata into the upload metadata ref without
     * triggering a context rerender. Use this for frequent websocket feedback
     * updates that should stay available to upload code but do not need to
     * redraw the UI on every message.
     */
    const mergeMediaMetaDoc = useCallback((mediaMetaDoc: MediaMetaDoc) => {
        mediaMetaDocRef.current = {
            ...(mediaMetaDocRef.current || {}),
            ...mediaMetaDoc,
        };
    }, []);

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
            mediaMetaDocRef,
            setMediaMetaDoc,
            mergeMediaMetaDoc,
            userMedia,
            setUserMedia,
            retrieveUserMedia,
        };
    }, [isVideoLocked, mergeMediaMetaDoc, retrieveUserMedia, setMediaMetaDoc, userMedia, videoChunks, videoFile]);

    return <MediaUpload.Provider value={value}>{children}</MediaUpload.Provider>;
}

export function useMediaUploadContext() {
    const context = useContext(MediaUpload);

    if (!context) {
        throw new Error("useMediaUpload must be used inside MediaUploadProvider");
    }

    return context;
}
