import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Navigation from "./components/Router";
import Home from "./pages/Home";
import LDB from "./pages/LDB";
import RosterPage from "./pages/Roster";
import GoToTopButton from "./components/topBtn";
import CharDetails from "./pages/CharDetails.jsx";
import Register from "./pages/register.jsx";
import Login from "./pages/Login.jsx";
import GotoEmail from "./components/EmailSend.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import { useContext, useEffect } from "react";
import { UserContext } from "./hooks/ContextVariables.jsx";
import ResetPassword from "./pages/utility/ResetPassword.jsx";
import VlidateToken from "./pages/utility/VlidateToken.jsx";
import { GuestRoute, UserRoute } from "./hooks/Guards.jsx";
import Logout from "./pages/utility/Logout.jsx";


export default function AppContent() {
    const { httpFetch } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => { 
        const fetcData = (async () => {const req = await httpFetch("/verify/me")})();
    }, [])

    return (
        // <Router>
        <>
        <div className="page-wrapper">
            <header className="header">
                <div onClick={(e) => {navigate(`/`)}} className="logo">
                    <img className="logo-img" src="/logo/logo_resized.png" alt="logo pic" />
                    PvP Scalpel
                </div>
                <Navigation />
            </header>
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
                    <Route path="/check/:server/:realm/:name" element={<CharDetails />}></Route>
                    <Route path="/goto/:email" element={<GotoEmail />} />
                    <Route path="/validate/:scenario" element={<VlidateToken />} />
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