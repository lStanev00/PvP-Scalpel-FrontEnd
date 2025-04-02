import { useContext, useState } from "react";
import styles from '../Styles/modular/NewPostForm.module.css'; 
import { UserContext } from "../hooks/ContextVariables";
import { useNavigate } from "react-router-dom";

export default function NewPostForm({characterID}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const {user, httpFetch} = useContext(UserContext);
  const [error, setError] = useState();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(undefined);

    if (!title.trim() || !content.trim()) return;
    console.log(user)
    if (!user._id || user._id == undefined) return navigate(`/login`);
    console.log(characterID)

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
            
        }
    } catch (error) {
        console.log(error)
        return setError(error);
        
    }

    setTitle("");
    setContent("");
  };

  return (
    <form className={styles.form} onSubmit={async(e)=>await handleSubmit(e)}>
      <h3 className={styles.heading}>Create a New Post</h3>

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

      <button type="submit" className={styles.button}>
        📝 Submit Post
      </button>
    </form>
  );
}
