import postStyle from '../Styles/modular/PostTemplate.module.css'
import { useContext } from "react";
import { UserContext } from "../hooks/ContextVariables"; // adjust path if needed

export default function PostTemplate({ post, onEdit, onDelete }) {
  const { user } = useContext(UserContext);

//   const isOwner = user?._id === post?.author?._id;
  const isOwner = true;

  return (
    <div className={postStyle["post-warp"]}>
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
          <button onClick={() => onDelete(post._id)}>🗑️ Delete</button>
        </div>
      )}
    </div>
  );
}
