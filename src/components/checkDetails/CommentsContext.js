/* eslint-disable react/prop-types */

import {
    createContext,
    createElement,
    useContext,
    useEffect,
    useMemo,
    useOptimistic,
    useRef,
    useState,
} from "react";
import { useSearchParams } from "react-router-dom";

export const CommentsContext = createContext(null);

export function CommentsProvider({ initialPosts, entryID, children }) {
    const [posts, setPosts] = useState(() =>
        Array.isArray(initialPosts) ? initialPosts : [],
    );
    const [optimisticPosts, addOptimisticPost] = useOptimistic(
        posts,
        (currentPosts, newPost) => [...currentPosts, newPost],
    );
    const commentsRef = useRef([]);
    const [searchParams] = useSearchParams();
    const commentID = searchParams.get("comment");

    useEffect(() => {
        setPosts(Array.isArray(initialPosts) ? initialPosts : []);
    }, [initialPosts]);

    useEffect(() => {
        if (!commentID) return undefined;

        const commentElement = commentsRef.current?.[commentID];
        if (!commentElement) return undefined;

        commentElement.scrollIntoView({ behavior: "smooth" });
        commentElement.dataset.highlighted = "true";

        const resetTimer = window.setTimeout(() => {
            delete commentElement.dataset.highlighted;
        }, 3000);

        return () => {
            window.clearTimeout(resetTimer);
            delete commentElement.dataset.highlighted;
        };
    }, [commentID, optimisticPosts]);

    const value = useMemo(
        () => ({
            entryID,
            posts,
            setPosts,
            optimisticPosts,
            addOptimisticPost,
            commentsRef,
        }),
        [addOptimisticPost, entryID, optimisticPosts, posts],
    );

    return createElement(
        CommentsContext.Provider,
        { value },
        children,
    );
}

export function useComments() {
    const context = useContext(CommentsContext);

    if (!context) {
        throw new Error("useComments must be used inside CommentsProvider");
    }

    return context;
}
