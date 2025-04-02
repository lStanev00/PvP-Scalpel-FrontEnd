import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../hooks/ContextVariables";
import style from '../../Styles/modular/Posts.module.css'
import { useNavigate } from "react-router-dom";

export default function ViewUserPosts() {
    const {httpFetch} = useContext(UserContext);
    const [ posts, setPosts ] = useState();
    const [ error, setError ] = useState(undefined);
    const navigate = useNavigate()


    useEffect(() => {
        (async function getUserPosts() {
            const url = `/get/user/posts`;

            try {
                const req = await httpFetch(url);

                const status = req.status;

                if (status === 200) {
                    console.log(req.data.posts)
                    return setPosts(req.data.posts);
                }else {
                    return setError(`Fail to load Posts`)
                }
            } catch (error) {
                console.warn(error);
                return setError(error);
            }
        })()
    }, [])


    if (error) return (<><p>Error fetching data</p></>);
    console.log(posts)
    if (!posts) return (<><p>Loading...</p></>)
    if(posts.length == 0) return (<><p>You don't have yet posts, go write some.</p></>)
    if (posts) return (<>
        <div className={style["post-grid"]}>
            {Object.entries(posts).map(([key, post]) => (
                <div onClick={(e) => navigate(`/check/${post?.character?.server}/${post?.character?.playerRealm?.slug}/${post?.character?.name}?comment=${post._id}`)} key={post._id} className={style["post-card"]}>
                    <div className={style["post-header"]}>
                        <span className={style["author"]}>Posted by User:🧑 {post?.author?.username}</span>
                        <span className={style["date"]}>🕓 {new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className={style["title"]}>{post?.title}</h3>
                    <p className={style["content"]}>{post?.content}</p>
                    <div className={style["char-meta"]}>
                        <span style={{fontSize: "1rem" , display:"flex", flexDirection: "row", alignItems: "center", gap: "0.5rem"}}>
                            <img style={{borderRadius:"1rem", width: "2rem"}} src={post?.character?.media?.avatar} alt="Character image" /> 
                            {post?.character?.name}
                        </span>
                        <span span style={{fontSize: "1rem" , display:"flex", flexDirection: "row", alignItems: "center", gap: "0.5rem"}}>🌍 {post?.character?.playerRealm?.name} / {post?.character?.server}</span>
                    </div>
                </div>
            ))}
        </div>
    
    </>)
}