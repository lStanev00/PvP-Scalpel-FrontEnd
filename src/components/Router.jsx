import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../hooks/ContextVariables';

export default function Navigation() {
    const { user } = useContext(UserContext);
    return (
        <>
            <nav className='navbar'>
                <ul className='nav-links'>
                    {!user?._id && (
                        <>
                            <li><Link to="/login">Login</Link></li>
                        </>
                    )}
                    {user._id && (
                        <>
                            <li><Link to="/profile">Profile</Link></li>
                        </>
                    )}
                    <li><Link to="/">Posts</Link></li>
                    <li><Link to="/roster">Members</Link></li>
                    <li><Link to="/leaderboard">Leaderboard</Link></li>
                </ul>
            </nav>
        </>
    )
}