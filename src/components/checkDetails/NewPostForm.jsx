import { startTransition, useContext, useState } from "react";
import styles from "../../Styles/modular/NewPostForm.module.css";
import { UserContext } from "../../hooks/ContextVariables";
import { useLocation, useNavigate } from "react-router-dom";
import { DetailsProvider } from "./Details";
import { FaPaperPlane } from "react-icons/fa";
import { CharacterContext } from "../../pages/CharDetails";

export default function NewPostForm() {
    const { data } = useContext(CharacterContext);
    const characterID = data?._id;
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const { user, httpFetch } = useContext(UserContext);
    const [error, setError] = useState();
    const location = useLocation().pathname;
    const { addOptimisticPost, setPosts } = useContext(DetailsProvider);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(undefined);

        if (!title.trim() || !content.trim()) return;
        if (!user?._id) return navigate(`/login`);

        const fakePost = {
            isOptimistic: true,
            _id: `FAKE-${Math.random().toString(36).slice(2)}`,
            title,
            content,
            author: {
                _id: user._id,
                username: user.username,
            },
            createdAt: new Date().toISOString(),
        };

        startTransition(() => addOptimisticPost(fakePost));

        try {
            // const {  title, content, authorID, characterID  } = req.body;
            const req = await httpFetch(`/new/post`, {
                method: "POST",
                body: JSON.stringify({
                    title: title.trim(),
                    content: content.trim(),
                    authorID: user._id,
                    characterID,
                }),
            });

            if (req.status === 201) {
                const data = req.data;
                setPosts((prev) => [...prev.filter((p) => p._id !== fakePost._id), data]);
                setTitle("");
                setContent("");
            } else {
                setError(req.data?.msg || `Request failed: ${req.status}`);
                setPosts((prev) => prev.filter((p) => p._id !== fakePost._id));
            }
        } catch (err) {
            console.error("Post failed:", err);
            setPosts((prev) => prev.filter((p) => p._id !== fakePost._id));
            setError("Failed to create post. Try again!");
        }
    };

    return (
        <form className={styles.commentForm} onSubmit={handleSubmit}>
            <div className={styles.headerLine}>
                <h1>Add a Comment</h1>
                {error && <p className={styles.errorMsg}>{error}</p>}
            </div>

            <div className={styles.inputs}>
                <input
                    type="text"
                    placeholder="Title your thought..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    name="title"
                    required
                />

                <textarea
                    placeholder="Share your opinion..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    name="description"
                    required
                />
            </div>

            <div className={styles.actions}>
                {user?._id && (
                    <button disabled={!user?._id} type="submit" className={styles.submitBtn}>
                        <FaPaperPlane size={16} />
                        <span> Submit Comment</span>
                    </button>
                )}

                {!user?._id && (
                    <div className={styles.authButtons}>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                navigate(`/login?target=${location}`);
                            }}
                            className={styles.altBtn}>
                            Login
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                navigate("/register");
                            }}
                            className={styles.altBtn}>
                            Register
                        </button>
                    </div>
                )}
            </div>
        </form>
    );
}
