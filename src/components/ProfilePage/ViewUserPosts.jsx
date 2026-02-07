import { useContext, useEffect, useMemo, useState } from "react";
import { UserContext } from "../../hooks/ContextVariables";
import style from "../../Styles/modular/Posts.module.css";
import { useNavigate } from "react-router-dom";
import { FiUser, FiClock } from "react-icons/fi";
import { FaGlobeEurope } from "react-icons/fa";
import Loading from "../loading.jsx";

const PAGE_SIZE = 12;

export default function ViewUserPosts() {
    const { httpFetch } = useContext(UserContext);
    const [posts, setPosts] = useState(null);
    const [error, setError] = useState(null);
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const navigate = useNavigate();

    const sortedPosts = useMemo(() => {
        const copy = Array.isArray(posts) ? [...posts] : [];
        copy.sort((a, b) => {
            const aTime = a?.createdAt ? Date.parse(a.createdAt) : 0;
            const bTime = b?.createdAt ? Date.parse(b.createdAt) : 0;
            return bTime - aTime;
        });
        return copy;
    }, [posts]);

    const visiblePosts = sortedPosts.slice(0, visibleCount);

    useEffect(() => {
        let cancelled = false;

        (async function getUserPosts() {
            setError(null);
            const url = `/get/user/posts`;

            const req = await httpFetch(url);
            if (cancelled) return;

            if (req.status !== 200) {
                setError(req.data?.msg || `Fail to load posts (${req.status})`);
                setPosts([]);
                return;
            }

            const dataPosts = Array.isArray(req.data?.posts) ? req.data.posts : req.data;
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

    if (error)
        return (
            <>
                <p>{String(error)}</p>
            </>
        );
    if (posts === null)
        return (
            <>
                <Loading height={260} />
            </>
        );
    if (posts.length === 0)
        return (
            <>
                <p>You don&apos;t have yet posts, go write some.</p>
            </>
        );

    return (
        <>
            <p className={style.feedMeta}>
                Showing {Math.min(visiblePosts.length, sortedPosts.length)} of {sortedPosts.length}
            </p>
            <div className={style["post-grid"]}>
                {visiblePosts.map((post) => (
                    <div
                        onClick={() =>
                            navigate(
                                `/check/${post?.character?.server}/${post?.character?.playerRealm?.slug}/${post?.character?.name}?comment=${post._id}`
                            )
                        }
                        key={post._id}
                        className={style["post-card"]}>
                        <div className={style["post-header"]}>
                            <span className={style["author"]}>
                                <FiUser size={14} style={{ marginRight: "0.4rem" }} />
                                Posted by User: {post?.author?.username}
                            </span>

                            <span className={style["date"]}>
                                <FiClock size={14} style={{ marginRight: "0.4rem" }} />
                                {post?.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""}
                            </span>
                        </div>

                        <h3 className={style["title"]}>{post?.title}</h3>
                        <p className={style["content"]}>{post?.content}</p>

                        <div className={style["char-meta"]}>
                            <span
                                style={{
                                    fontSize: "1rem",
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                }}>
                                <img
                                    style={{
                                        borderRadius: "1rem",
                                        width: "2rem",
                                    }}
                                    src={post?.character?.media?.avatar}
                                    alt={`${post?.character?.name || "Character"} avatar`}
                                />
                                {post?.character?.name}
                            </span>

                            <span
                                style={{
                                    fontSize: "1rem",
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                }}>
                                <FaGlobeEurope size={14} />
                                {post?.character?.playerRealm?.name} / {post?.character?.server}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {visibleCount < sortedPosts.length && (
                <div className={style.loadMoreWrap}>
                    <button
                        type="button"
                        className={style.loadMoreBtn}
                        onClick={() =>
                            setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, sortedPosts.length))
                        }
                    >
                        Load more
                    </button>
                </div>
            )}
        </>
    );
}
