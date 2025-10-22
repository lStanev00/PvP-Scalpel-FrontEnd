import Style from "../Styles/modular/ProfilePage.module.css";
import { useContext, useState } from "react";
import { UserContext } from "../hooks/ContextVariables";
import AccInfo from "../components/ProfilePage/AccInfo";
import ChangePassword from "../components/ProfilePage/ChangePassword";
import ViewUserPosts from "../components/ProfilePage/ViewUserPosts";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
    const navigate = useNavigate();
    const { user, httpFetch } = useContext(UserContext);
    const [content, setContent] = useState("AccInfo");

    if (!user || !user._id) return navigate(`/login`);

    return (
        <>
            <header className={Style.banner}>
                <h1>Profile</h1>
            </header>

            <section className={Style.container}>
                {/* Left navigation menu */}
                <nav className={`${Style.panel} ${Style.menu}`}>
                    <h2>Menu</h2>
                    <div className={Style.buttonGroup}>
                        <button
                            onClick={() => setContent("AccInfo")}
                            className={content === "AccInfo" ? Style.active : ""}
                        >
                            Account Info
                        </button>
                        <button
                            onClick={() => setContent("ChangePassword")}
                            className={content === "ChangePassword" ? Style.active : ""}
                        >
                            Change Password
                        </button>
                        <button
                            onClick={() => setContent("ViewPosts")}
                            className={content === "ViewPosts" ? Style.active : ""}
                        >
                            Your Posts
                        </button>
                    </div>
                </nav>

                {/* Dynamic content section */}
                <section className={`${Style.content}`}>
                    {content === "AccInfo" && <AccInfo />}
                    {content === "ViewPosts" && <ViewUserPosts />}
                    {content === "ChangePassword" && (
                        <ChangePassword setContent={setContent} httpFetch={httpFetch} />
                    )}
                </section>
            </section>
        </>
    );
}
