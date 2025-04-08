import Style from "../Styles/modular/ProfilePage.module.css"
import { useContext, useState } from "react";
import { UserContext } from "../hooks/ContextVariables";
import AccInfo from "../components/ProfilePage/AccInfo";
import ChangePassword from "../components/ProfilePage/ChangePassword";
import { useNavigate } from "react-router-dom";
import ViewUserPosts from "../components/ProfilePage/ViewUserPosts";

export default function ProfilePage() {
    const navigate = useNavigate();

    const [content, setContent] = useState(`AccInfo`)

    const {user, httpFetch} = useContext(UserContext);

    if (!user || !user._id) return navigate(`/login`);
    return (<>

        <div className={Style.banner}>
            <h4>Profile</h4>
        </div>
        
        <div className={Style.container}>

        <div className={`${Style['inner-section']} ${Style['inner-nav-menu']}`}>
            <h2>Menu</h2>
            <div className={Style[`button-div`]}>
                <button onClick={() => setContent(`AccInfo`)}>Account Info</button>
                <button onClick={()=> setContent(`ChangePassword`)}>Change password</button>
                <button onClick={()=> setContent(`ViewPosts`)}>View your posts</button>
            </div>
        </div>


            <div className={Style['content-section']}>
                {content == 'AccInfo' && (<AccInfo />)}
                {content == 'ViewPosts' && (<ViewUserPosts />)}
                {content == "ChangePassword" && (<ChangePassword setContent={setContent} httpFetch={httpFetch} />)}
            </div>
      </div>
    
    </>
    );
  }