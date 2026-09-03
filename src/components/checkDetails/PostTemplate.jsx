import { useContext, useState } from "react";
import { UserContext } from "../../hooks/ContextVariables";
import { FiClock, FiEdit2, FiTrash2 } from "react-icons/fi";
import Style from "../../Styles/modular/PostTemplate.module.css";
import { useComments } from "./CommentsContext.js";

const relativeTime = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

function getCommentDate(value) {
    const date = new Date(value);
    const timestamp = date.getTime();

    if (!Number.isFinite(timestamp)) {
        return { label: "Unknown date", exact: "Unknown date" };
    }

    const difference = timestamp - Date.now();
    const absoluteDifference = Math.abs(difference);
    const intervals = [
        ["year", 365 * 24 * 60 * 60 * 1000],
        ["month", 30 * 24 * 60 * 60 * 1000],
        ["day", 24 * 60 * 60 * 1000],
        ["hour", 60 * 60 * 1000],
        ["minute", 60 * 1000],
    ];

    const interval = intervals.find(([, milliseconds]) => absoluteDifference >= milliseconds);
    const label = interval
        ? relativeTime.format(Math.round(difference / interval[1]), interval[0])
        : "just now";

    return {
        label,
        exact: date.toLocaleString(),
    };
}

export default function PostTemplate({ postValue, optimistic, innerRef }) {
    const { user, httpFetch } = useContext(UserContext);
    const { setPosts } = useComments();

    const [editMode, setEditMode] = useState(false);
    const [editContent, setEditContent] = useState("");
    const post = postValue;

    const isOwner = user?._id === post?.author?._id;
    const authorName = post?.author?.username || "Anonymous";
    const authorInitial = authorName.trim().charAt(0).toUpperCase() || "?";
    const commentDate = getCommentDate(post?.createdAt);

    const startEditing = () => {
        setEditContent(post?.content || "");
        setEditMode(true);
    };

    const onDelete = async () => {
        try {
            const res = await httpFetch("/delete/post", {
                method: "DELETE",
                body: JSON.stringify({ postID: post._id }),
            });
            if (res.status === 200) {
                setPosts((prev) => prev.filter((p) => p._id !== post._id));
            }
        } catch (err) {
            console.warn("Delete failed:", err);
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!editContent.trim()) return;

        try {
            const res = await httpFetch("/edit/post", {
                method: "PATCH",
                body: JSON.stringify({
                    postID: post._id,
                    content: editContent.trim(),
                }),
            });
            if (res.status === 200) {
                const updatedPost = { ...post, ...res.data };
                setPosts((prev) =>
                    prev.map((entry) => (entry._id === post._id ? updatedPost : entry)),
                );
                setEditMode(false);
            }
        } catch (err) {
            console.warn("Edit failed:", err);
        }
    };

    /* ---------- VIEW MODE ---------- */
    if (!editMode) {
        return (
            <article
                ref={innerRef}
                className={`${Style.commentItem} ${optimistic ? Style.optimistic : ""}`}
            >
                <span className={Style.avatar} aria-hidden="true">
                    {authorInitial}
                </span>

                <div className={Style.commentContent}>
                    <header className={Style.commentHeader}>
                        <span className={Style.author}>{authorName}</span>
                        <time
                            className={Style.date}
                            dateTime={post?.createdAt}
                            title={commentDate.exact}
                            aria-label={`${commentDate.label}, ${commentDate.exact}`}
                        >
                            {commentDate.label}
                        </time>
                        {optimistic && (
                            <span className={Style.optimisticTag}>
                                <FiClock className={Style.clockIcon} />
                                Pending
                            </span>
                        )}
                    </header>

                    <p className={Style.commentText}>
                        {post.content || "No content provided."}
                    </p>

                    {isOwner && !optimistic && (
                        <footer className={Style.commentFooter}>
                            <button
                                type="button"
                                className={Style.actionBtn}
                                onClick={startEditing}
                            >
                                <FiEdit2 /> Edit
                            </button>
                            <button
                                type="button"
                                className={`${Style.actionBtn} ${Style.deleteBtn}`}
                                onClick={onDelete}
                            >
                                <FiTrash2 /> Delete
                            </button>
                        </footer>
                    )}
                </div>
            </article>
        );
    }

    /* ---------- EDIT MODE ---------- */
    return (
        <article ref={innerRef} className={Style.commentItem}>
            <span className={Style.avatar} aria-hidden="true">
                {authorInitial}
            </span>

            <form onSubmit={onSubmit} className={Style.editForm}>
                <textarea
                    className={Style.editTextarea}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="Edit your comment..."
                    aria-label="Edit comment"
                    required
                />

                <div className={Style.editActions}>
                    <button type="submit" className={Style.confirmBtn}>
                        Save
                    </button>
                    <button
                        type="button"
                        onClick={() => setEditMode(false)}
                        className={Style.cancelBtn}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </article>
    );
}
