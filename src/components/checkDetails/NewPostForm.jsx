/* eslint-disable react/prop-types -- Optional Watch presentation keeps the default composer unchanged. */
import { startTransition, useContext, useRef, useState } from "react";
import styles from "../../Styles/modular/NewPostForm.module.css";
import { UserContext } from "../../hooks/ContextVariables";
import { useLocation, useNavigate } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { useComments } from "./CommentsContext.js";

export default function NewPostForm({ variant = "default" }) {
    const isWatch = variant === "watch";
    const [content, setContent] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user, httpFetch } = useContext(UserContext);
    const [error, setError] = useState();
    const location = useLocation();
    const { addOptimisticPost, entryID, setPosts } = useComments();
    const navigate = useNavigate();
    const textareaRef = useRef(null);
    const returnTarget = `${location.pathname}${location.search}`;
    const userInitial = user?.username?.trim()?.charAt(0)?.toUpperCase() || "?";

    const resetComposer = () => {
        setContent("");
        setError(undefined);
        setIsExpanded(false);

        if (textareaRef.current) {
            textareaRef.current.style.height = "";
            textareaRef.current.style.overflowY = "hidden";
        }
    };

    const handleContentChange = (event) => {
        const textarea = event.currentTarget;
        setContent(textarea.value);
        textarea.style.height = "auto";
        textarea.style.height = `${Math.min(textarea.scrollHeight, 192)}px`;
        textarea.style.overflowY = textarea.scrollHeight > 192 ? "auto" : "hidden";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(undefined);

        const trimmedContent = content.trim();
        if (!trimmedContent || isSubmitting) return;
        if (!user?._id) {
            return navigate(`/login?target=${encodeURIComponent(returnTarget)}`);
        }
        if (!entryID) return setError("Comments are unavailable for this entry.");

        const fakePost = {
            isOptimistic: true,
            _id: `FAKE-${Math.random().toString(36).slice(2)}`,
            content: trimmedContent,
            author: {
                _id: user._id,
                username: user.username,
            },
            createdAt: new Date().toISOString(),
        };

        setIsSubmitting(true);
        startTransition(() => addOptimisticPost(fakePost));

        try {
            const body = {
                content: trimmedContent,
                authorID: user._id,
            };
            if (variant === "default") {
                body.characterID = entryID;
            } else if (isWatch) {
                body.media = entryID;
            }
            const req = await httpFetch(`/new/post`, {
                method: "POST",
                body: JSON.stringify(body),
            });

            if (req.status === 201) {
                const data = req.data;
                setPosts((prev) => [...prev.filter((p) => p._id !== fakePost._id), data]);
                resetComposer();
            } else {
                setError(req.data?.msg || `Request failed: ${req.status}`);
                setPosts((prev) => prev.filter((p) => p._id !== fakePost._id));
            }
        } catch (err) {
            console.error("Post failed:", err);
            setPosts((prev) => prev.filter((p) => p._id !== fakePost._id));
            setError("Failed to create post. Try again!");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user?._id) {
        return (
            <div className={`${styles.signedOutPrompt} ${isWatch ? styles.watch : ""}`}>
                <span className={styles.guestAvatar} aria-hidden="true">
                    <FiUser />
                </span>
                <button
                    type="button"
                    className={styles.signInButton}
                    onClick={() =>
                        navigate(`/login?target=${encodeURIComponent(returnTarget)}`)
                    }
                >
                    Sign in to comment
                </button>
            </div>
        );
    }

    return (
        <form
            className={`${styles.commentForm} ${isWatch ? styles.watch : ""}`}
            onSubmit={handleSubmit}
            aria-busy={isSubmitting}
        >
            <span className={styles.avatar} aria-hidden="true">
                {userInitial}
            </span>

            <div className={styles.composerBody}>
                <textarea
                    ref={textareaRef}
                    className={styles.commentInput}
                    placeholder="Add a comment..."
                    value={content}
                    onChange={handleContentChange}
                    onFocus={() => setIsExpanded(true)}
                    name="content"
                    rows={1}
                    aria-label="Comment"
                    aria-expanded={isExpanded}
                    required
                />

                {error && (
                    <p className={styles.errorMsg} role="alert">
                        {error}
                    </p>
                )}

                {(isExpanded || isWatch) && (
                    <div className={styles.actions}>
                        {isExpanded && (
                            <button
                                type="button"
                                className={styles.cancelBtn}
                                onClick={resetComposer}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={!content.trim() || isSubmitting}
                        >
                            {isSubmitting ? "Posting..." : isWatch ? "Post comment" : "Comment"}
                        </button>
                    </div>
                )}
            </div>
        </form>
    );
}
