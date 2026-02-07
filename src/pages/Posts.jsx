import { useContext, useEffect, useState } from "react";
import { UserContext } from "../hooks/ContextVariables";
import style from "../Styles/modular/Posts.module.css";
import { useNavigate } from "react-router-dom";
import { FiClock, FiUser } from "react-icons/fi";
import { FaGlobeEurope } from "react-icons/fa";
import SEOPosts from "../SEO/SEOPosts";
import Loading from "../components/loading.jsx";

export default function Posts() {
    const navigate = useNavigate();
    const { httpFetch } = useContext(UserContext);
    const [posts, setPosts] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        (async function fetchPosts() {
            setError(null);

            const res = await httpFetch(`/get/posts`);
            if (cancelled) return;

            if (res.status !== 200) {
                setError(res.data?.msg || `Request failed (${res.status})`);
                setPosts([]);
                return;
            }

            const dataPosts = Array.isArray(res.data?.posts) ? res.data.posts : res.data;
            setPosts(Array.isArray(dataPosts) ? dataPosts : []);
        })().catch((err) => {
            if (cancelled) return;
            setError(err?.message || "Failed to load posts.");
            setPosts([]);
        });

        return () => {
            cancelled = true;
        };
    }, [httpFetch]);

    if (posts === null) return <Loading height={260} />;

    return (
        <>
            <SEOPosts />
            {error && <p style={{ padding: "0 2rem" }}>{error}</p>}

            {posts.length === 0 ? (
                <p style={{ padding: "0 2rem" }}>No posts yet.</p>
            ) : (
                <div className={style["post-grid"]}>
                    {posts.map((post) => (
                        <div
                            key={post._id}
                            onClick={() =>
                                navigate(
                                    `/check/${post?.character?.server}/${post?.character?.playerRealm?.slug}/${post?.character?.name}?comment=${post._id}`
                                )
                            }
                            className={style["post-card"]}>
                            <div className={style["post-header"]}>
                                <span className={style["author"]}>
                                    <FiUser size={14} /> {post?.author?.username || "Anonymous"}
                                </span>
                                <span className={style["date"]}>
                                    <FiClock size={14} />{" "}
                                    {post?.createdAt
                                        ? new Date(post.createdAt).toLocaleDateString()
                                        : ""}
                                </span>
                            </div>

                            <h3 className={style["title"]}>{post?.title}</h3>
                            <p className={style["content"]}>{post?.content}</p>

                            <div className={style["char-meta"]}>
                                <span className={style["char-info"]}>
                                    <img
                                        className={style["char-avatar"]}
                                        src={post?.character?.media?.avatar}
                                        alt={`${post?.character?.name || "Character"} avatar`}
                                    />
                                    {post?.character?.name}
                                </span>
                                <span className={style["realm-info"]}>
                                    <FaGlobeEurope size={13} />{" "}
                                    {post?.character?.playerRealm?.name} / {post?.character?.server}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
