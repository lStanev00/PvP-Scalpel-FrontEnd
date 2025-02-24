export default function NavMenu() {
    return (
        <>
    <div className="page-wrapper">
        <header className="header">
            <div className="logo">
                <img className="logo-img" src="./logo/logo_resized.png" alt="logo pic" />
                PvP Scalpel
            </div>
            <nav className="navbar">
                <ul className="nav-links">
                    <li><a href="/">Home</a></li>
                    <li><a href="/roaster">Roster</a></li>
                    <li><a href="/forum">Forum</a></li>
                </ul>
            </nav>
        </header>
        <main>
            %%%container%%%
        </main>

        <footer className="footer">
            <p>&copy; 2025 Lachezar Stanev. All rights reserved.</p>
        </footer>
    </div>
        </>
    )
}