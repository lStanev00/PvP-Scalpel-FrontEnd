import { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Style from "../../Styles/modular/StatsToggle.module.css";

export default function StatsToggle({ currentSeason }) {
    const [showStats, setShowStats] = useState(false);
    const toggleRef = useRef(null);

    useEffect(() => {
        if (!showStats) return;

        const onPointerDown = (event) => {
            if (!toggleRef.current?.contains(event.target)) {
                setShowStats(false);
            }
        };

        const onKeyDown = (event) => {
            if (event.key === "Escape") {
                setShowStats(false);
            }
        };

        document.addEventListener("pointerdown", onPointerDown);
        document.addEventListener("keydown", onKeyDown);

        return () => {
            document.removeEventListener("pointerdown", onPointerDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [showStats]);

    const supportsHover =
        typeof window !== "undefined" &&
        window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    return (
        <div
            ref={toggleRef}
            className={Style.statsToggleArea}
            onMouseEnter={() => {
                if (supportsHover) setShowStats(true);
            }}
            onMouseLeave={() => {
                if (supportsHover) setShowStats(false);
            }}
        >
            <button
                type="button"
                className={`${Style.statsHeader} ${showStats ? Style.open : ""}`}
                onClick={() => setShowStats(!showStats)}
                aria-expanded={showStats}
            >
                <span>Stats</span>
                {showStats ? <FaChevronUp size={11} /> : <FaChevronDown size={11} />}
            </button>

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
