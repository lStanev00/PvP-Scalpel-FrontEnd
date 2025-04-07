import { Link } from "react-router-dom";
import styles from "../Styles/modular/Landing.module.css";

export default function LandingPage() {
    return (
        <div 
        className={styles.wrapper}
        >
            <section className={styles.intro}>
                <h2>Welcome to PvP Scalpel</h2>
                <p>Track, Share & Dominate the Battlegrounds</p>
                <div className={styles.cta}>
                    <Link to="/leaderboard" className={styles.btn}>View Leaderboard</Link>
                    <Link to="https://discord.gg/devdT4nVgb" className={styles.btn}>Join Discord</Link>
                </div>
            </section>

            <section className={styles.features}>
                <div className={styles.card}>
                    <h3>Live PvP Stats</h3>
                    <p>Get real-time performance tracking across brackets.</p>
                </div>
                <div className={styles.card}>
                    <h3>Guild Insights</h3>
                    <p>See how your guildmates are climbing the ladder.</p>
                </div>
                <div className={styles.card}>
                    <h3>Post & Discuss</h3>
                    <p>Comment, share builds, and discuss meta.</p>
                </div>
                <div className={styles.card}>
                    <h3>Armory Integration</h3>
                    <p> ... To be integrated</p>
                </div>
            </section>

            <section className={styles.leaderboardPreview}>
                <h3>Top Rated Players</h3>
                <p>Peek at who's dominating the ladder right now.</p>
                <Link style={{marginTop:"1rem"}} to="/leaderboard" className={styles.btn}>Full Leaderboard</Link>
            </section>
        </div>
    );
}