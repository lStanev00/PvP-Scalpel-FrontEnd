import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserContext } from '../hooks/ContextVariables';
import SearchBar from './SearchBar/SearchBar';
import Style from "../Styles/modular/Header.module.css"

export default function Navigation() {
    const { user } = useContext(UserContext);
    const location = (useLocation()).pathname;
    return (
        <>
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
                    <div className={Style.searchBarDiv}><SearchBar /></div>
        </>
    )
}