import { useContext, useState, useEffect, forwardRef } from "react";
import { UserContext } from "../../hooks/ContextVariables";
import { DetailsProvider } from "./Details";
import { FiUser, FiCalendar, FiEdit2, FiTrash2 } from "react-icons/fi";
import postStyle from "../../Styles/modular/PostTemplate.module.css";
import editStyle from "../../Styles/modular/NewPostForm.module.css";

const PostTemplate = forwardRef(function PostTemplate({ postValue, optimistic, innerRef }, ref) {
    const { user, httpFetch } = useContext(UserContext);
    const { setPosts } = useContext(DetailsProvider);

    const [edit, setEdit] = useState(undefined);
    const [editTitle, setEditTitle] = useState(undefined);
    const [editContent, setEditContent] = useState(undefined);
    const [post, setPost] = useState(postValue);

    const isOwner = user?._id === post?.author?._id;

    useEffect(() => {
        if (edit) {
            setEditTitle(post.title);
            setEditContent(post.content);
        }
    }, [edit]);

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
        } catch (error) {
            console.warn(error);
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!editTitle?.trim() || !editContent?.trim()) return;

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
                setEdit(undefined);
            }
        } catch (error) {
            console.warn(error);
        }
    };

    // Read-only comment view
    if (!edit) {
        return (
            <article
                ref={innerRef}
                className={`${postStyle.commentItem} ${optimistic ? postStyle.optimistic : ""}`}
            >
                <header className={postStyle.commentHeader}>
                    <div className={postStyle.metaLeft}>
                        <FiUser className={postStyle.icon} />
                        <span className={postStyle.author}>{post?.author?.username || "Anonymous"}</span>
                    </div>
                    <div className={postStyle.metaRight}>
                        <FiCalendar className={postStyle.icon} />
                        <span className={postStyle.date}>
                            {new Date(post?.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </header>

                <div className={postStyle.commentBody}>
                    <h3 className={postStyle.commentTitle}>{post?.title || "Untitled Post"}</h3>
                    <p className={postStyle.commentText}>
                        {post?.content || "No content provided."}
                    </p>
                </div>

                {isOwner && (
                    <footer className={postStyle.commentFooter}>
                        <button
                            className={`${postStyle.actionBtn} ${postStyle.editBtn}`}
                            onClick={(e) => {
                                e.preventDefault();
                                setEdit(true);
                            }}
                        >
                            <FiEdit2 /> Edit
                        </button>
                        <button
                            className={`${postStyle.actionBtn} ${postStyle.deleteBtn}`}
                            onClick={onDelete}
                        >
                            <FiTrash2 /> Delete
                        </button>
                    </footer>
                )}
            </article>
        );
    }

    // Edit form view
    return (
        <article ref={innerRef} className={postStyle.commentItem}>
            <form onSubmit={onSubmit} className={editStyle.form}>
                <h3 className={editStyle.heading}>Edit Comment</h3>

                <input
                    type="text"
                    placeholder="Post title"
                    className={editStyle.input}
                    defaultValue={post.title}
                    onChange={(e) => setEditTitle(e.target.value)}
                    required
                />

                <textarea
                    placeholder="Write your content..."
                    className={editStyle.textarea}
                    defaultValue={post.content}
                    onChange={(e) => setEditContent(e.target.value)}
                    required
                />

                <div className={postStyle.formActions}>
                    <button type="submit" className={editStyle.button}>
                        Confirm
                    </button>
                    <button
                        type="button"
                        onClick={() => setEdit(undefined)}
                        className={editStyle.button}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </article>
    );
});

export default PostTemplate;
