import Style from "../Styles/modular/ProfilePage.module.css";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../hooks/ContextVariables";
import AccInfo from "../components/ProfilePage/AccInfo";
import ChangePassword from "../components/ProfilePage/ChangePassword";
import ViewUserPosts from "../components/ProfilePage/ViewUserPosts";
import { useNavigate, useSearchParams } from "react-router-dom";
import ViewUserVideos from "../components/ProfilePage/ViewUserVideos.jsx";

export default function ProfilePage() {
    const navigate = useNavigate();
    const { user, httpFetch } = useContext(UserContext);
    if (!user || !user._id) return navigate(`/login`);
    
    const [content, setContent] = useState("AccInfo");
    const [searchParams, setSearchParams] = useSearchParams();
    const allowedProfileNavSet = new Set(["AccInfo", "ChangePassword", "ViewVideos", "ViewPosts"]);

    const nav = searchParams.get("nav");
    useEffect(() => {
        if (!nav) return;

        const trimmed = nav.trim();

        if (allowedProfileNavSet.has(trimmed)) {
            setContent(trimmed);

            setSearchParams((prev) => {
                const next = new URLSearchParams(prev);
                next.delete("nav");
                return next;
            });
        }
    }, [searchParams.get("nav")]);


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
                            className={content === "AccInfo" ? Style.active : ""}>
                            Account Info
                        </button>
                        <button
                            onClick={() => setContent("ChangePassword")}
                            className={content === "ChangePassword" ? Style.active : ""}>
                            Change Password
                        </button>

                        <button
                            onClick={() => setContent("ViewVideos")}
                            className={content === "ViewPosts" ? Style.active : ""}>
                            Your Videos
                        </button>

                        <button
                            onClick={() => setContent("ViewPosts")}
                            className={content === "ViewPosts" ? Style.active : ""}>
                            Your Posts
                        </button>
                    </div>
                </nav>

                {/* Dynamic content section */}
                <section className={`${Style.content}`}>
                    {content === "AccInfo" && <AccInfo />}
                    {content === "ViewPosts" && <ViewUserPosts />}
                    {content === "ViewVideos" && <ViewUserVideos />}
                    {content === "ChangePassword" && (
                        <ChangePassword setContent={setContent} httpFetch={httpFetch} />
                    )}
                </section>
            </section>
        </>
    );
}
