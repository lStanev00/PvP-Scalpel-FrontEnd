import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Router";
import Home from "./pages/Home";
import LDB from "./pages/LDB";
import RosterPage from "./pages/Roster";
import GoToTopButton from "./components/topBtn";
import CharDetails from "./pages/CharDetails.jsx";
import Register from "./pages/register.jsx";
import Login from "./pages/Login.jsx";
import GotoEmail from "./pages/utility/EmailSend.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import { useContext, useEffect } from "react";
import { UserContext } from "./hooks/ContextVariables.jsx";

export default function AppContent() {

    const {user, setUser, httpFetch} = useContext(UserContext);

    const fetcData = async () => {
        const req = await httpFetch("/verify/me");
        if (req.status == 200) {
            const data = await req.json();
            console.log(data)

            if (!data._id) {
                return setUser(undefined);
            }
            setUser(data)
        }
    }
    
    useEffect(() => { 
        try {
            fetcData()
        } catch (error) {console.warn(error)}
        console.log(user)
    }, [])

    return (
        <Router>
            <div className="page-wrapper">
                <header className="header">
                    <div className="logo">
                        <img className="logo-img" src="/logo/logo_resized.png" alt="logo pic" />
                        PvP Scalpel
                    </div>
                    <Navigation />
                </header>
                <main>
                    <Routes>
                        <Route path='/' element={<Home />}></Route>
                        <Route path='/roster' element={<RosterPage />}></Route>
                        <Route path='/leaderboard' element={<LDB />}></Route>
                        <Route path="/check/:server/:realm/:name" element={<CharDetails />}></Route>
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/goto/email" element={<GotoEmail />} />
                        <Route path="/reset/password" element={<ResetPasword />} />
                        <Route path="/profilePage" element={<ProfilePage />} />
                    </Routes>
                    
                </main>
                <footer className="footer">
                    <p>&copy; 2024 Lachezar Stanev. ALL RIGHTS RESERVED.</p>
                </footer>
            </div>
            <GoToTopButton />
        </Router>
    )
}