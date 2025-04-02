import postStyle from '../../Styles/modular/PostTemplate.module.css'
import { useContext, useState, useEffect } from "react";
import { UserContext } from "./../../hooks/ContextVariables";
import editStyle from '../../Styles/modular/NewPostForm.module.css'

export default function PostTemplate({ postValue, optimistic, setPosts }) {
  const { user, httpFetch } = useContext(UserContext);
  const [ edit, setEdit ] = useState(undefined);
  const [ editTitle, setEditTitle ] = useState(undefined);
  const [ editContent, setEditContent ] = useState(undefined);
  const [post, setPost] = useState(postValue);

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

  useEffect(() => {
    if (edit) {
      setEditTitle(post.title);
      setEditContent(post.content);
    }
  }, [edit]);

  const onSubmit = async (e) => {
    e.preventDefault();
  
    if (!editTitle?.trim() || !editContent?.trim()) return;
  
    try {
      const url = `/edit/post`;
      const res = await httpFetch(url, {
        method: "PATCH",
        body: JSON.stringify({
          postID: post._id,
          title: editTitle.trim(),
          content: editContent.trim()
        })
      });
  
      if (res.status === 200) {
        setPost(res.data);
        setEdit(undefined);
      }
    } catch (error) {
      console.warn(error);
    }
  };
  

if (edit == undefined) return (<>

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
            <button onClick={(e) => {e.preventDefault(); setEdit(true)}}>📝 Edit</button>
            <button onClick={ async (e) => await onDelete(e)}>🗑️ Delete</button>
          </div>
        )}
</div>




</>)
else return (<>
<div 
className={postStyle["post-warp"]}
style={optimistic ? {
    filter: "blur(1px)",
    opacity: 0.6,
    pointerEvents: "none",
  } : {}} 
  >

<form onSubmit={async (e) => await onSubmit(e)} style={{maxWidth:"350px"}} className={editStyle.form}>
            <h3 className={editStyle.heading}>Edit Comment</h3>
      
            <input
              type="text"
              placeholder="Post title"
              className={editStyle.input}
              required
              defaultValue={post.title}
              onLoad={(e)=>setEditTitle(e.target.value)}
              onChange={(e)=>setEditTitle(e.target.value)}
              name='title'
            />
      
            <textarea
              style={{maxWidth:"320px"}}
              placeholder="Write your content..."
              className={editStyle.textarea}
              required
              defaultValue={post.content}
              onLoad={(e)=>setEditContent(e.target.value)}
              onChange={(e)=>setEditContent(e.target.value)}
              name='content'
            />
      
          {/* {error && (
              <>
              <p style={{color:"red"}}>{error}</p>
              </>
          )} */}

            <div style={{display:"flex", gap:`1rem`}}>
            <button type="submit" className={editStyle.button}>
             Confirm Edit
            </button>
            <button onClick={(e) => {e.preventDefault();setEdit(undefined)}}  className={editStyle.button}>
              Cancel
            </button>
            </div>
    </form>


  </div>

</>)
}
