import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "../hooks/ContextVariables";
import Style from "../Styles/modular/Header.module.css";
import SearchBar from "./SearchBar/SearchBar";
import { FaFlag } from "react-icons/fa";
import { GiBattleAxe, GiCrossedSwords, GiLightningTrio, GiTripleScratches } from "react-icons/gi";
import { publicAssetUrl } from "../helpers/assets.js";
import { FiMenu, FiX, FiChevronRight, FiChevronUp, FiChevronDown } from "react-icons/fi";

export default function Navigation() {
    const { user } = useContext(UserContext);
    const location = useLocation().pathname;
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        setMenuOpen(false);
    }, [location]);

    useEffect(() => {
        if (!menuOpen) return undefined;

        const closeOnEscape = (event) => {
            if (event.key === "Escape") setMenuOpen(false);
        };

        document.addEventListener("keydown", closeOnEscape);
        return () => document.removeEventListener("keydown", closeOnEscape);
    }, [menuOpen]);

    return (
        <header className={Style.header}>
            <div className={Style.upperWrapper}>
                <Link to="/" aria-label="PvP Scalpel home" className={Style.logo}>
                    <img
                        className={Style["logo-img"]}
                        src={publicAssetUrl("logo/logo_resized.png")}
                        alt="logo pic"
                    />
                    {/* PvP Scalpel */}
                </Link>

                <SearchBar />
            </div>

            <button
                type="button"
                className={Style.menuToggle}
                aria-controls="site-navigation"
                aria-expanded={menuOpen}
                aria-label={menuOpen ? "Close navigation" : "Open navigation"}
                onClick={() => setMenuOpen((open) => !open)}>
                {menuOpen ? <FiX /> : <FiMenu />}
            </button>

            <nav
                id="site-navigation"
                className={Style.navbar}
                data-open={menuOpen}
                aria-label="Primary navigation">
                <ul className={Style["nav-links"]}>
                    {!user?._id && (
                        <>
                            <li className={Style.navDropdown}>
                                <Link
                                    to={`/login?target=${location}`}
                                    className={Style.leaderboardLink}>
                                    Login
                                </Link>
                                <div className={Style.leaderboardMenu}>
                                    <Link to="/register">
                                        <FiChevronRight className={Style.leaderboardMenuIcon} />
                                        <span>Register</span>
                                    </Link>
                                </div>
                            </li>
                        </>
                    )}
                    {user?._id && (
                        <>
                            <li className={Style.navDropdown}>
                                <Link to={`/profile`} className={Style.leaderboardLink}>
                                    Profile
                                </Link>
                                <div className={Style.leaderboardMenu}>
                                    <Link to="/profile?nav=ChangePassword">
                                        <FiChevronRight className={Style.leaderboardMenuIcon} />
                                        <span>Change passwoard</span>
                                    </Link>
                                    <Link to="/profile?nav=ViewVideos">
                                        <FiChevronRight className={Style.leaderboardMenuIcon} />
                                        <span>Your Videos</span>
                                    </Link>
                                    <Link to="/profile?nav=ViewPosts">
                                        <FiChevronRight className={Style.leaderboardMenuIcon} />
                                        <span>Your Comments</span>
                                    </Link>
                                    <Link to="/logout">
                                        <FiChevronRight className={Style.leaderboardMenuIcon} />
                                        <span>Logout</span>
                                    </Link>
                                </div>
                            </li>
                            {String(user?.role || "")
                                .trim()
                                .toLowerCase() === "admin" && (
                                <li>
                                    <Link to="/upload/media">Upload Media</Link>
                                </li>
                            )}
                        </>
                    )}
                    <li>
                        <Link to="/scan">Lobby Scan</Link>
                    </li>
                    <li>
                        <Link to="/watch">Scalpel TV</Link>
                    </li>
                    {/* <li>
                        <Link to="/posts">Posts</Link>
                    </li> */}
                    <li className={Style.navDropdown}>
                        <Link to={`/roster`} className={Style.leaderboardLink}>
                            Guild
                        </Link>
                        <div className={Style.leaderboardMenu}>
                            <Link to="/roster">
                                <FiChevronRight className={Style.leaderboardMenuIcon} />
                                <span>Members</span>
                            </Link>
                            <Link to="/joinGuild">
                                <FiChevronRight className={Style.leaderboardMenuIcon} />
                                <span>Join the Guild</span>
                            </Link>
                        </div>
                    </li>
                    <li className={Style.navDropdown}>
                        <Link to="/leaderboard/blitz" className={Style.leaderboardLink}>
                            Leaderboard
                        </Link>
                        <div className={Style.leaderboardMenu}>
                            <Link to="/leaderboard/solo-shuffle">
                                <GiCrossedSwords className={Style.leaderboardMenuIcon} />
                                <span>Solo Shuffle</span>
                            </Link>
                            <Link to="/leaderboard/2v2">
                                <GiBattleAxe className={Style.leaderboardMenuIcon} />
                                <span>2v2 Arena</span>
                            </Link>
                            <Link to="/leaderboard/3v3">
                                <GiTripleScratches className={Style.leaderboardMenuIcon} />
                                <span>3v3 Arena</span>
                            </Link>
                            <Link to="/leaderboard/blitz">
                                <GiLightningTrio className={Style.leaderboardMenuIcon} />
                                <span>Blitz BG</span>
                            </Link>
                            <Link to="/leaderboard/rated-bg">
                                <FaFlag className={Style.leaderboardMenuIcon} />
                                <span>Rated BG</span>
                            </Link>
                        </div>
                    </li>
                </ul>
            </nav>
        </header>
    );
}
