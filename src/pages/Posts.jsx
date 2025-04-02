import { useContext, useEffect, useState } from "react";
import { UserContext } from "../hooks/ContextVariables";
import style from '../Styles/modular/Posts.module.css'

export default function Posts() {
    const {httpFetch} = useContext(UserContext);
    const [ posts, setPosts ] = useState(undefined);

    useEffect(() => {
        (async function fetchPosts() {
            const res = await httpFetch(`/get/posts`)
            const status = res.status
            console.log(res.data)
            if (status == 200) return setPosts(res.data);
        })();

    }, [])

    if (posts === undefined) return(<>Loading...</>)


    return (<>
    <div className={style["post-grid"]}>
        {Object.entries(posts).map(([key, post]) => (
            <div key={post._id} className={style["post-card"]}>
            <div className={style["post-header"]}>
                <span className={style["author"]}>🧑 {post.author.username}</span>
                <span className={style["date"]}>🕓 {new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            <h3 className={style["title"]}>{post.title}</h3>
            <p className={style["content"]}>{post.content}</p>
            <div className={style["char-meta"]}>
                <span>🧙‍♂️ {post.character.name}</span>
                <span>🌍 {post.character.playerRealm.name} / {post.character.server}</span>
            </div>
            </div>
        ))}
    </div>

    </>)
}