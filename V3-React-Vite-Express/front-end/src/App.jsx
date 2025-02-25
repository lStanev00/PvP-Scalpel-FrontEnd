import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./modules/Router";
import Home from "./modules/home";
import LDB from "./modules/LDB";
import RosterPage from "./modules/roster";
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
                        <p>&copy; 2025 Lachezar Stanev. All rights reserved.</p>
                    </footer>
                </div>
            <GoToTopButton />
            </Router>
        </>
    )
}

export default App