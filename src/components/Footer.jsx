export default function Footer({Style}) {
    return (
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
                <p>
                    © 2024 - {new Date().getFullYear()} Lachezar Stanev — All Rights Reserved.
                </p>
            </div>
        </footer>
    );
}
