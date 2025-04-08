import { startTransition, useContext, useState } from "react";
import styles from '../../Styles/modular/NewPostForm.module.css'; 
import { UserContext } from "../../hooks/ContextVariables";
import { useLocation, useNavigate } from "react-router-dom";
import { DetailsProvider } from "./Details";

export default function NewPostForm({characterID}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const {user, httpFetch} = useContext(UserContext);
  const [error, setError] = useState();
  const location = (useLocation()).pathname;
  const {addOptimisticPost, setPosts} = useContext(DetailsProvider)
  
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(undefined);

    if (!title.trim() || !content.trim()) return;
    if (!user._id || user._id == undefined) return navigate(`/login`);

    const fakePost = {
        isOptimistic: true,
        _id: `FAKE` + String(Math.random()),
        title,
        content,
        author: {
            _id: user._id,
            id: user._id,
            username: user.username,
        },
        createdAt: new Date().toISOString(),
    }
    startTransition(() => addOptimisticPost(fakePost))

    try {
        const req = await httpFetch(`/new/post`, {
            method: "POST",
            body: JSON.stringify({
                title: title.trim(),
                content: content.trim(),
                authorID: user._id,
                characterID: characterID
            })
        });
        const status = req.status;
        if (status == 201 ) {
            const data = req.data;

            setTitle("");
            setContent("");

            return setPosts(prev => [...prev.filter(post => post._id !== fakePost._id), data]);

        } else if (status === 400) setError(req.data.msg)
        else setError(`Failed to create post. Request status: ${req?.status}`)
        setPosts(prev => prev.filter(p => p._id !== fakePost._id));
    } catch (error) {
        console.error('Post failed:', err);

        setPosts(prev => prev.filter(p => p._id !== fakePost._id));
        
        setError('Failed to create post. Try again!');
        
    }

    setTitle("");
    setContent("");
  };

  return (
    <form className={styles.form} onSubmit={async(e)=>await handleSubmit(e)}>
      <h3 className={styles.heading}>Add new Comment</h3>

      <input
        type="text"
        placeholder="Post title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={styles.input}
        required
      />

      <textarea
        placeholder="Write your content..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className={styles.textarea}
        required
      />

    {error && (
        <>
        <p style={{color:"red"}}>{error}</p>
        </>
    )}

      <button disabled={!user?._id} type="submit" className={styles.button}>
        📝 Submit Post
      </button>

      {!user?._id && (
        <div style={{display:"flex" ,gap: "10px"}}>
            <button onClick={(e) => navigate(`/login?target=${location}`)} type="submit" className={styles.button}>
              Login
            </button>

            <button onClick={(e) => navigate('/register')} type="submit" className={styles.button}>
              Register
            </button>
        </div>
      )}
    </form>
  );
}
