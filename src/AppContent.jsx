import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom"; // Dont
import Navigation from "./components/Router.jsx";
import Home from "./pages/Home.jsx";
import LDB from "./pages/LDB.jsx";
import RosterPage from "./pages/Roster.jsx";
import GoToTopButton from "./components/topBtn.jsx";
// import CharDetails from "./pages/CharDetails.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import GotoEmail from "./components/EmailSend.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import { lazy, Suspense, useContext, useEffect } from "react";
import { UserContext } from "./hooks/ContextVariables.jsx";
import ResetPassword from "./pages/utility/ResetPassword.jsx";
import VlidateToken from "./pages/utility/VlidateToken.jsx";
import { GuestRoute, UserRoute } from "./hooks/Guards.jsx";
import Logout from "./pages/utility/Logout.jsx";
import Posts from "./pages/Posts.jsx";
import Loading from "./components/loading.jsx";
import Style from "./Styles/modular/AppContent.module.css";

const CharDetails = lazy(() => import("./pages/CharDetails.jsx"));

export default function AppContent() {
    const { httpFetch } = useContext(UserContext);

    useEffect(() => {
        const fetcData = (async () => {
            const req = await httpFetch("/verify/me");
        })();
    }, []);

    return (
        // <Router>
        <>
            <div className={Style.pageWrapper}>
                <Navigation />

                <main>
                    <Routes>
                        <Route element={<UserRoute />}>
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/logout" element={<Logout />} />
                        </Route>

                        <Route element={<GuestRoute />}>
                            <Route path="/register" element={<Register />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/reset/password" element={<ResetPassword />} />
                        </Route>

                        <Route path="/" element={<Home />}></Route>
                        <Route path="/roster" element={<RosterPage />}></Route>
                        <Route path="/leaderboard" element={<LDB />}></Route>
                        {/* <Route path="/check/:server/:realm/:name" element={<CharDetails />}></Route> */}
                        <Route
                            path="/check/:server/:realm/:name"
                            element={
                                <Suspense fallback={<Loading />}>
                                    <CharDetails />
                                </Suspense>
                            }
                        />
                        <Route path="/goto/:email" element={<GotoEmail />} />
                        <Route path="/validate/:scenario" element={<VlidateToken />} />
                        <Route path="/posts" element={<Posts />} />
                    </Routes>
                </main>
                <footer className={Style.footer}>
                    <div className={Style["footer-inner"]}>
                        <div className={Style["footer-brand"]}>
                            <img
                                src="/logo/logo_resized.png"
                                alt="PvP Scalpel Logo"
                                className={Style["footer-logo"]}
                            />
                            <h3>PvP Scalpel</h3>
                            <p>Precision • Performance • Power</p>
                        </div>

                        <div className={Style["footer-links"]}>
                            <a href="/leaderboard">Leaderboard</a>
                            <a href="/roster">Members</a>
                            <a href="/posts">Community</a>
                            <a
                                href="https://discord.gg/devdT4nVgb"
                                target="_blank"
                                rel="noopener noreferrer">
                                Discord
                            </a>
                        </div>
                    </div>

                    <div className={Style["footer-bottom"]}>
                        <p>© 2024 - {new Date().getFullYear()} Lachezar Stanev — All Rights Reserved.</p>
                    </div>
                </footer>
            </div>
            <GoToTopButton />
        </>
        // </Router>
    );
}
