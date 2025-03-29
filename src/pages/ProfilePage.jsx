import Style from "../Styles/modular/ProfilePage.module.css"
import { useContext } from "react";
import { UserContext } from "../hooks/ContextVariables";

export default function ProfilePage() {

    const contextUser = useContext(UserContext);

    // const user = {
    //     username: "lychezar",
    //     email: "l.stanev2000@gmail.com",
    //     role: "user",
    //     isVerified: true
    // }
    const user = contextUser.user;
    return (<>

        <div className={Style.banner}>
            <h4>Profile</h4>
        </div>
        
        <div className={Style.container}>

            <div style={{alignItems: "center"}} className={Style['inner-section']}>
                <h2>Account Actions</h2>
                <div className={Style[`button-div`]}>
                    <button>Profile Settings</button>
                    <button>Change password</button>
                    <button>View all posts</button>
                </div>
            </div>

            <div className={Style['inner-section']}>
                <h2>Account Actions</h2>
                <div><strong>Username:</strong> {user.username}</div>
                <div><strong>Email:</strong> {user.email}</div>
                <div><strong>Role:</strong> {user.role}</div>
                {user.isVerified && (<div><strong>✅ Verified</strong></div>)}
            </div>
      </div>
    
    </>
    );
  }

