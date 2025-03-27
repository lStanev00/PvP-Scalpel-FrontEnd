import { Link } from 'react-router-dom';

export default function Navigation() {
    return (
        <>
            <nav className='navbar'>
                <ul className='nav-links'>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/roster">Roster List</Link></li>
                    <li><Link to="/leaderboard">Leaderboard</Link></li>
                </ul>
            </nav>
        </>
    )
}