import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type Dispatch,
    type ReactNode,
    type SetStateAction,
} from "react";

export type VideoDetailsCharacterId = string | number;

export type VideoDetailsFormState = {
    title: string;
    description: string;
    bracket: string;
    isPrivate: boolean;
    characters: VideoDetailsCharacterId[];
};

type VideoDetailsProviderProps = {
    children: ReactNode;
};

type VideoDetailsContextValue = VideoDetailsFormState & {
    setTitle: Dispatch<SetStateAction<string>>;
    setDescription: Dispatch<SetStateAction<string>>;
    setBracket: Dispatch<SetStateAction<string>>;
    setIsPrivate: Dispatch<SetStateAction<boolean>>;
    setCharacters: Dispatch<SetStateAction<VideoDetailsCharacterId[]>>;
    addCharacter: (characterId: VideoDetailsCharacterId) => void;
    removeCharacter: (characterId: VideoDetailsCharacterId) => void;
    resetVideoDetails: () => void;
};

const DEFAULT_VIDEO_DETAILS: VideoDetailsFormState = {
    title: "",
    description: "",
    bracket: "0",
    isPrivate: false,
    characters: [],
};

export const VideoDetailsContext = createContext<VideoDetailsContextValue | null>(null);

export function VideoDetailsProvider({ children }: VideoDetailsProviderProps) {
    const [title, setTitle] = useState(DEFAULT_VIDEO_DETAILS.title);
    const [description, setDescription] = useState(DEFAULT_VIDEO_DETAILS.description);
    const [bracket, setBracket] = useState(DEFAULT_VIDEO_DETAILS.bracket);
    const [isPrivate, setIsPrivate] = useState(DEFAULT_VIDEO_DETAILS.isPrivate);
    const [characters, setCharacters] = useState<VideoDetailsCharacterId[]>(
        DEFAULT_VIDEO_DETAILS.characters,
    );

    const addCharacter = useCallback((characterId: VideoDetailsCharacterId) => {
        setCharacters((current) => {
            if (current.includes(characterId)) return current;
            return [...current, characterId];
        });
    }, []);

    const removeCharacter = useCallback((characterId: VideoDetailsCharacterId) => {
        setCharacters((current) => current.filter((id) => id !== characterId));
    }, []);

    const resetVideoDetails = useCallback(() => {
        setTitle(DEFAULT_VIDEO_DETAILS.title);
        setDescription(DEFAULT_VIDEO_DETAILS.description);
        setBracket(DEFAULT_VIDEO_DETAILS.bracket);
        setIsPrivate(DEFAULT_VIDEO_DETAILS.isPrivate);
        setCharacters(DEFAULT_VIDEO_DETAILS.characters);
    }, []);

    const value = useMemo<VideoDetailsContextValue>(() => {
        return {
            title,
            description,
            bracket,
            isPrivate,
            characters,
            setTitle,
            setDescription,
            setBracket,
            setIsPrivate,
            setCharacters,
            addCharacter,
            removeCharacter,
            resetVideoDetails,
        };
    }, [addCharacter, bracket, characters, description, isPrivate, removeCharacter, resetVideoDetails, title]);

    return (
        <VideoDetailsContext.Provider value={value}>
            {children}
        </VideoDetailsContext.Provider>
    );
}

export function useVideoDetailsContext() {
    const context = useContext(VideoDetailsContext);

    if (!context) {
        throw new Error("useVideoDetailsContext must be used inside VideoDetailsProvider");
    }

    return context;
}
