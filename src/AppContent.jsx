import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom"; // Dont clear imports
import Navigation from "./components/Router.jsx";
import Home from "./pages/Home.jsx";
import GoToTopButton from "./components/topBtn.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import GotoEmail from "./components/EmailSend.jsx";
import { lazy, Suspense, useContext, useEffect } from "react";
import { UserContext } from "./hooks/ContextVariables.jsx";
import ResetPassword from "./pages/utility/ResetPassword.jsx";
import VlidateToken from "./pages/utility/VlidateToken.jsx";
import { GuestRoute, UserRoute } from "./hooks/Guards.jsx";
import Logout from "./pages/utility/Logout.jsx";
import Posts from "./pages/Posts.jsx";
import Loading from "./components/loading.jsx";
import Style from "./Styles/modular/AppContent.module.css";
import Footer from "./components/Footer.jsx";
import Download from "./pages/Download.jsx";
import DesktopBeta from "./pages/DesktopBeta.jsx";

const CharDetails = lazy(() => import("./pages/CharDetails.jsx"));
const JoinGuild = lazy(() => import("./pages/JoinGuild.jsx"));
const LDB = lazy(() => import("./pages/LDB.jsx"));
const RosterPage = lazy(() => import("./pages/Roster.jsx"));
const ProfilePage = lazy(() => import("./pages/ProfilePage.jsx"))

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
                            <Route 
                                path="/profile"
                                element={
                                    <Suspense fallback={<Loading />}>
                                        <ProfilePage />
                                    </Suspense>
                                }
                            ></Route>
                            <Route path="/logout" element={<Logout />} />
                        </Route>

                        <Route element={<GuestRoute />}>
                            <Route path="/register" element={<Register />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/reset/password" element={<ResetPassword />} />
                        </Route>

                        <Route path="/" element={<Home />}></Route>
                        <Route
                            path="/roster"
                            element={
                                <Suspense fallback={<Loading />}>
                                    <RosterPage />
                                </Suspense>
                            }
                        >

                        </Route>
                        <Route 
                            path="/leaderboard/*"
                            element={
                                <Suspense fallback={<Loading />}>
                                    <LDB />
                                </Suspense>
                            }
                        />
                        {/* <Route path="/check/:server/:realm/:name" element={<CharDetails />}></Route> */}
                        <Route
                            path="/check/:server/:realm/:name"
                            element={
                                <Suspense fallback={<Loading />}>
                                    <CharDetails />
                                </Suspense>
                            }
                        />
                        <Route
                            path="joinGuild"
                            element={
                                <Suspense fallback={<Loading />}>
                                    <JoinGuild />
                                </Suspense>
                            }
                        />
                        <Route path="/goto/:email" element={<GotoEmail />} />
                        <Route path="/validate/:scenario" element={<VlidateToken />} />
                        <Route path="/posts" element={<Posts />} />
                        <Route path="/download" element={<Download />} />
                        <Route path="/desktopBeta" element={<DesktopBeta />} />
                    </Routes>
                </main>
                <Footer Style={Style} />
            </div>
            <GoToTopButton />
        </>
        // </Router>
    );
}
