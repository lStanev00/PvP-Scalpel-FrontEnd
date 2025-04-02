import postStyle from '../../Styles/modular/PostTemplate.module.css'
import { useContext } from "react";
import { UserContext } from "./../../hooks/ContextVariables";

export default function PostTemplate({ post, optimistic, setPosts }) {
  const { user, httpFetch } = useContext(UserContext);

  const isOwner = user?._id === post?.author?._id;

  const onDelete = async (e) => {
    e.preventDefault();

    try {
        const url = `/delete/post`;

        const req = await httpFetch(url, {
            method: "DELETE",
            body: JSON.stringify({
                postID: post._id
            })
        });

        if (req.status === 200) {
            setPosts(prev => prev.filter(p => p._id !== post._id));
        }


    } catch (error) {
        console.log(error)
    }
  }

  return (
    <div 
    className={postStyle["post-warp"]}
    style={optimistic ? {
        filter: "blur(1px)",
        opacity: 0.6,
        pointerEvents: "none",
      } : {}} 
      >
      <div className={postStyle["post-meta"]}>
        <span>🧑 <strong>{post?.author?.username || "Anonymous"}</strong></span>
        <span>📅 {new Date(post?.createdAt).toLocaleDateString()}</span>
      </div>

      <div className={postStyle["post-content"]}>
        <strong>{post?.title || "Untitled Post"}</strong>
        <span>{post?.content || "No content provided."}</span>
      </div>

      {isOwner && (
        <div className={postStyle["post-actions"]}>
          <button onClick={() => onEdit(post)}>📝 Edit</button>
          <button onClick={ async (e) => await onDelete(e)}>🗑️ Delete</button>
        </div>
      )}
    </div>
  );
}
