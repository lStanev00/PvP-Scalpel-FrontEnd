import Style from "../Styles/modular/ProfilePage.module.css"
import { useContext, useState } from "react";
import { UserContext } from "../hooks/ContextVariables";
import AccInfo from "../components/ProfilePage/AccInfo";
import ChangePassword from "../components/ProfilePage/ChangePassword";

export default function ProfilePage() {

    const [content, setContent] = useState(`AccInfo`)

    const {user, httpFetch} = useContext(UserContext);

    if (!user) return
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
                <button>View your posts</button>
            </div>
        </div>


            <div className={Style['content-section']}>
                {content == 'AccInfo' && (<AccInfo user={user} />)}
                {content == "ChangePassword" && (<ChangePassword setContent={setContent} httpFetch={httpFetch} />)}
            </div>
      </div>
    
    </>
    );
  }