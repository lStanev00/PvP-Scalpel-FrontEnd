import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../hooks/ContextVariables";
import Style from "../Styles/modular/Header.module.css";
import SearchBar from "./SearchBar/SearchBar";
import { FaFlag } from "react-icons/fa";
import {
    GiBattleAxe,
    GiCrossedSwords,
    GiLightningTrio,
    GiTripleScratches,
} from "react-icons/gi";

export default function Navigation() {
    const { user } = useContext(UserContext);
    const location = useLocation().pathname;
    const navigate = useNavigate();

    return (
        <div className={Style.header}>
            <div className={Style.upperWrapper}>
                <div
                    onClick={(e) => {
                        navigate(`/`);
                    }}
                    className={Style.logo}>
                    <img
                        className={Style["logo-img"]}
                        src="/logo/logo_resized.png"
                        alt="logo pic"
                    />
                    {/* PvP Scalpel */}
                </div>

                <SearchBar />
            </div>

            <nav className={Style.navbar}>
                <ul className={Style["nav-links"]}>
                    {!user?._id && (
                        <>
                            <li>
                                <Link to={`/login?target=${location}`}>Login</Link>
                            </li>
                        </>
                    )}
                    {user?._id && (
                        <>
                            <li>
                                <Link to="/profile">Profile</Link>
                            </li>
                            <li>
                                <Link to="/logout">Logout</Link>
                            </li>
                        </>
                    )}
                    <li>
                        <Link to="/scan">Lobby Scan</Link>
                    </li>
                    <li>
                        <Link to="/posts">Posts</Link>
                    </li>
                    <li>
                        <Link to="/roster">Members</Link>
                    </li>
                    <li className={Style.navDropdown}>
                        <Link to="/leaderboard" className={Style.leaderboardLink}>
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
        </div>
    );
}
