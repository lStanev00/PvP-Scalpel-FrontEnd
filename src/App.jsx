import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Router";
import Home from "./pages/home";
import LDB from "./pages/LDB";
import RosterPage from "./pages/roster";
import GoToTopButton from "./components/topBtn";

function App() {
    return (
        <>
            <Router>
                <div className="page-wrapper">
                    <header className="header">
                        <div className="logo">
                            <img className="logo-img" src="./logo/logo_resized.png" alt="logo pic" />
                            PvP Scalpel
                        </div>
                        <Navigation />
                    </header>
                    <main>
                        <Routes>
                            <Route path='/' element={<Home />}></Route>
                            <Route path='/roster' element={<RosterPage />}></Route>
                            <Route path='/leaderboard' element={<LDB />}></Route>
                        </Routes>
                        
                    </main>

                    <footer className="footer">
                        <p>&copy; 2024 Lachezar Stanev. ALL RIGHTS RESERVED.</p>
                    </footer>
                </div>
            <GoToTopButton />
            </Router>
        </>
    )
}

export default App