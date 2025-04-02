import postStyle from '../../Styles/modular/PostTemplate.module.css'
import { useContext, useState } from "react";
import { UserContext } from "./../../hooks/ContextVariables";
import editStyle from '../../Styles/modular/NewPostForm.module.css'

export default function PostTemplate({ post, optimistic, setPosts }) {
  const { user, httpFetch } = useContext(UserContext);
  const [ eddit, setEddit ] = useState(true);

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
        {eddit == undefined && (
            <>
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
                <button onClick={(e) => {e.preventDefault(); setEddit(true)}}>📝 Edit</button>
                <button onClick={ async (e) => await onDelete(e)}>🗑️ Delete</button>
              </div>
            )}
          </>
        )}

      {eddit != undefined && (
        <>
        <form style={{maxWidth:"350px"}} className={editStyle.form}>
                <h3 className={editStyle.heading}>Eddit Comment</h3>
          
                <input
                  type="text"
                  placeholder="Post title"
                  className={editStyle.input}
                  required
                  defaultValue={post.title}
                  name='title'
                />
          
                <textarea
                  style={{maxWidth:"320px"}}
                  placeholder="Write your content..."
                  className={editStyle.textarea}
                  required
                  defaultValue={post.content}
                  name='content'
                />
          
              {/* {error && (
                  <>
                  <p style={{color:"red"}}>{error}</p>
                  </>
              )} */}

                <div style={{display:"flex", gap:`1rem`}}>
                <button type="submit" className={editStyle.button}>
                 Confirm Eddit
                </button>
                <button onClick={(e) => {e.preventDefault();setEddit(undefined)}}  className={editStyle.button}>
                  Cancel
                </button>
                </div>
        </form>
        
        </>
      )}
    </div>
  );
}
