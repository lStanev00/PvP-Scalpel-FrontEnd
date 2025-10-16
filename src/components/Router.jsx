import { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../hooks/ContextVariables';
import Style from "../Styles/modular/Header.module.css"
import SearchBar from './SearchBar/SearchBar';

export default function Navigation() {
    const { user } = useContext(UserContext);
    const location = (useLocation()).pathname;
    const navigate = useNavigate();
    
    return (
        <>
        <div className={Style.header}>

            <div className={Style.upperWrapper}>
                <div onClick={(e) => {navigate(`/`)}} className={Style.logo}>
                    <img className={Style["logo-img"]} src="/logo/logo_resized.png" alt="logo pic" />
                    PvP Scalpel
                </div>

                <SearchBar />
            </div>

            <nav className={Style.navbar}>
                <ul className={Style["nav-links"]}>
                    {!user?._id && (
                        <>
                            <li><Link to={`/login?target=${location}`}>Login</Link></li>
                        </>
                    )}
                    {user?._id && (
                        <>
                            <li><Link to="/profile">Profile</Link></li>
                            <li><Link to="/logout">Logout</Link></li>
                        </>
                    )}
                    <li><Link to="/posts">Posts</Link></li>
                    <li><Link to="/roster">Members</Link></li>
                    <li><Link to="/leaderboard">Leaderboard</Link></li>
                </ul>

            </nav>
        </div>
        </>
    )
}