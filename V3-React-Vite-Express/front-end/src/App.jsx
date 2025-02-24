import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Router";
import Home from "./components/home";

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
                            <Route path='/roster'></Route>
                            <Route path='/leaderbord'></Route>
                        </Routes>
                        
                    </main>

                    <footer className="footer">
                        <p>&copy; 2025 Lachezar Stanev. All rights reserved.</p>
                    </footer>
                </div>
            </Router>
        </>
    )
}

export default App