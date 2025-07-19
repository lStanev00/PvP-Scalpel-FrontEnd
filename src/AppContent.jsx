import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom"; // Dont
import Navigation from "./components/Router.jsx";
import Home from "./pages/Home";
import LDB from "./pages/LDB.jsx";
import RosterPage from "./pages/Roster.jsx";
import GoToTopButton from "./components/topBtn.jsx";
// import CharDetails from "./pages/CharDetails.jsx";
import Register from "./pages/register.jsx";
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

const CharDetails = lazy(() => import("./pages/CharDetails.jsx"))


export default function AppContent() {
    const { httpFetch } = useContext(UserContext);

    useEffect(() => { 
        const fetcData = (async () => {const req = await httpFetch("/verify/me")})();
    }, [])

    return (
        // <Router>
        <>
        <div
        className="page-wrapper"
        style={{
            backgroundImage:"url('/backgrounds/main_background.png')",
            backgroundSize: "100% auto",
            backgroundPosition: "center",
            backgroundBlendMode: "multiply"
        }}
        >
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

                    <Route path='/' element={<Home />}></Route>
                    <Route path='/roster' element={<RosterPage />}></Route>
                    <Route path='/leaderboard' element={<LDB />}></Route>
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
            <footer className="footer">
                <p>&copy; 2025 Lachezar Stanev. ALL RIGHTS RESERVED.</p>
            </footer>
        </div>
        <GoToTopButton />
        
        </>
        // </Router>
    )
}