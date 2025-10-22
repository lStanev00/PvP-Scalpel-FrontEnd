import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Style from "../../Styles/modular/StatsToggle.module.css";



export default function StatsToggle({ currentSeason }) {
    const [showStats, setShowStats] = useState(false);
    return (
        <div className={Style.statsToggleArea}>
            <div
                className={`${Style.statsHeader} ${showStats ? Style.open : ""}`}
                onClick={() => setShowStats(!showStats)}
            >
                <span>Stats</span>
                {showStats ? <FaChevronUp size={11} /> : <FaChevronDown size={11} />}
            </div>

            <div className={`${Style.statsContent} ${showStats ? Style.open : ""}`}>
                <table className={Style["pvp-table"]}>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Weekly</th>
                            <th>Season</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Played</td>
                            <td>{currentSeason?.weeklyMatchStatistics?.played ?? 0}</td>
                            <td>{currentSeason?.seasonMatchStatistics?.played ?? 0}</td>
                        </tr>
                        <tr>
                            <td>Won</td>
                            <td>{currentSeason?.weeklyMatchStatistics?.won ?? 0}</td>
                            <td>{currentSeason?.seasonMatchStatistics?.won ?? 0}</td>
                        </tr>
                        <tr>
                            <td>Lost</td>
                            <td>{currentSeason?.weeklyMatchStatistics?.lost ?? 0}</td>
                            <td>{currentSeason?.seasonMatchStatistics?.lost ?? 0}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
