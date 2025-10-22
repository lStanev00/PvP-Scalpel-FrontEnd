import { useContext, useEffect, useState } from "react";
import { UserContext } from "../hooks/ContextVariables";
import style from "../Styles/modular/Posts.module.css";
import { useNavigate } from "react-router-dom";
import { FiClock, FiUser } from "react-icons/fi";
import { FaGlobeEurope } from "react-icons/fa";

export default function Posts() {
    const navigate = useNavigate();
    const { httpFetch } = useContext(UserContext);
    const [posts, setPosts] = useState(undefined);

    useEffect(() => {
        (async function fetchPosts() {
            const res = await httpFetch(`/get/posts`);
            if (res.status === 200) setPosts(res.data);
        })();
    }, []);

    if (posts === undefined) return <>Loading...</>;

    return (
        <div className={style["post-grid"]}>
            {Object.entries(posts).map(([key, post]) => (
                <div
                    key={post._id}
                    onClick={() =>
                        navigate(
                            `/check/${post?.character?.server}/${post?.character?.playerRealm?.slug}/${post?.character?.name}?comment=${post._id}`
                        )
                    }
                    className={style["post-card"]}
                >
                    <div className={style["post-header"]}>
                        <span className={style["author"]}>
                            <FiUser size={14} /> {post?.author?.username || "Anonymous"}
                        </span>
                        <span className={style["date"]}>
                            <FiClock size={14} />{" "}
                            {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                    </div>

                    <h3 className={style["title"]}>{post?.title}</h3>
                    <p className={style["content"]}>{post?.content}</p>

                    <div className={style["char-meta"]}>
                        <span className={style["char-info"]}>
                            <img
                                className={style["char-avatar"]}
                                src={post?.character?.media?.avatar}
                                alt="Character image"
                            />
                            {post?.character?.name}
                        </span>
                        <span className={style["realm-info"]}>
                            <FaGlobeEurope size={13} />{" "}
                            {post?.character?.playerRealm?.name} /{" "}
                            {post?.character?.server}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
