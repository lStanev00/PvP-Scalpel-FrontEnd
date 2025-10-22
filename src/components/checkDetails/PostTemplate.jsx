import { useContext, useState, useEffect, forwardRef } from "react";
import { UserContext } from "../../hooks/ContextVariables";
import { DetailsProvider } from "./Details";
import { FiUser, FiCalendar, FiEdit2, FiTrash2, FiClock } from "react-icons/fi";
import Style from "../../Styles/modular/PostTemplate.module.css";

const PostTemplate = forwardRef(function PostTemplate({ postValue, optimistic, innerRef }, ref) {
    const { user, httpFetch } = useContext(UserContext);
    const { setPosts } = useContext(DetailsProvider);

    const [editMode, setEditMode] = useState(false);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");
    const [post, setPost] = useState(postValue);

    const isOwner = user?._id === post?.author?._id;

    useEffect(() => {
        if (editMode) {
            setEditTitle(post.title || "");
            setEditContent(post.content || "");
        }
    }, [editMode]);

    const onDelete = async (e) => {
        e.preventDefault();
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
        if (!editTitle.trim() || !editContent.trim()) return;

        try {
            const res = await httpFetch("/edit/post", {
                method: "PATCH",
                body: JSON.stringify({
                    postID: post._id,
                    title: editTitle.trim(),
                    content: editContent.trim(),
                }),
            });
            if (res.status === 200) {
                setPost(res.data);
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
                <header className={Style.commentHeader}>
                    <div className={Style.metaLeft}>
                        <FiUser className={Style.icon} />
                        <span className={Style.author}>
                            {post?.author?.username || "Anonymous"}
                        </span>
                    </div>

                    <div className={Style.metaRight}>
                        {optimistic && (
                            <span className={Style.optimisticTag}>
                                <FiClock className={Style.clockIcon} />
                                Pending...
                            </span>
                        )}
                        <FiCalendar className={Style.icon} />
                        <span className={Style.date}>
                            {new Date(post?.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </header>

                <div className={Style.commentBody}>
                    <h3 className={Style.commentTitle}>{post.title || "Untitled Post"}</h3>
                    <p className={Style.commentText}>
                        {post.content || "No content provided."}
                    </p>
                </div>

                {isOwner && (
                    <footer className={Style.commentFooter}>
                        <button
                            className={`${Style.actionBtn} ${Style.editBtn}`}
                            onClick={() => setEditMode(true)}
                        >
                            <FiEdit2 /> Edit
                        </button>
                        <button
                            className={`${Style.actionBtn} ${Style.deleteBtn}`}
                            onClick={onDelete}
                        >
                            <FiTrash2 /> Delete
                        </button>
                    </footer>
                )}
            </article>
        );
    }

    /* ---------- EDIT MODE ---------- */
    return (
        <article ref={innerRef} className={`${Style.commentItem} ${Style.editing}`}>
            <form onSubmit={onSubmit} className={Style.editForm}>
                <h3 className={Style.editHeading}>Edit Comment</h3>

                <input
                    type="text"
                    className={Style.editInput}
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Post title"
                    required
                />

                <textarea
                    className={Style.editTextarea}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="Write your content..."
                    required
                />

                <div className={Style.editActions}>
                    <button type="submit" className={Style.confirmBtn}>
                        Confirm
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
});

export default PostTemplate;
