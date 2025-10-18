import { useNavigate } from "react-router-dom";
import Style from "./WeeklyRender.module.css";

export default function WeeklyRender({ weeklyData }) {
    const navigate = useNavigate();

    // Basic structure validation
    if (!weeklyData || typeof weeklyData !== "object") {
        console.warn("WeeklyRender: Invalid weeklyData format", weeklyData);
        return (
            <section className={Style.wrapper}>
                <h2 className={Style.title}>Top Weekly Gainers</h2>
                <p className={Style.error}>No valid data available.</p>
            </section>
        );
    }

    // Safe destructuring
    const order = ["shuffle", "blitz", "3v3", "2v2", "RBG"];
    const mapTitle = {
        shuffle: "Solo Shuffle",
        blitz: "Blitz",
        "3v3": "3v3",
        "2v2": "2v2",
        RBG: "RBG",
    };

    let cards = [];
    try {
        cards = order
            .map((key) => {
                const list = Array.isArray(weeklyData[key]) ? weeklyData[key] : [];
                const top = list.find((p) => p && typeof p.result === "number" && p.result > 0);
                if (!top) return null;
                return { key, top };
            })
            .filter(Boolean);
    } catch (err) {
        console.error("WeeklyRender: Failed to parse cards", err);
        return (
            <section className={Style.wrapper}>
                <h2 className={Style.title}>Top Weekly Gainers</h2>
                <p className={Style.error}>An unexpected error occurred.</p>
            </section>
        );
    }

    // Empty-state fallback
    if (!cards.length)
        return (
            <section className={Style.wrapper}>
                <h2 className={Style.title}>Top Weekly Gainers</h2>
                <p className={Style.error}>No leaderboard data found this week.</p>
            </section>
        );

    return (
        <section className={Style.wrapper}>
            <h2 className={Style.title}>Top Weekly Gainers</h2>
            <div className={Style.grid}>
                {cards.map(({ key, top }) => {
                    const parts = (top?.playerSearch || "").split(":");
                    if (parts.length < 3) return null;

                    const urlPart = [parts[2], parts[1], parts[0]].join("/");
                    const banner = top?.media?.banner || "/item_fallback.png";
                    const specMedia = top?.activeSpec?.media || "/spec_fallback.png";

                    return (
                        <article
                            key={key}
                            className={Style.card}
                            onClick={() => navigate(`/check/${urlPart}`)}
                        >
                            <header className={Style.cardHead}>{mapTitle[key]}</header>
                            <div
                                className={Style.banner}
                                style={{ backgroundImage: `url(${banner})` }}
                            >
                                <img
                                    className={Style.spec}
                                    src={specMedia}
                                    alt={top?.activeSpec?.name || "Spec"}
                                    loading="lazy"
                                />
                            </div>
                            <div className={Style.info}>
                                <strong className={Style.name}>{top?.name || "Unknown"}</strong>
                                <span className={Style.meta}>
                                    {top?.activeSpec?.name || "Spec"} {top?.class?.name || ""}
                                </span>
                                <span className={Style.gain}>+{top?.result || 0} rating</span>
                            </div>
                        </article>
                    );
                })}
            </div>
            <p className={Style.updated}>
                Last Updated:{" "}
                {weeklyData.lastUpdated
                    ? new Date(weeklyData.lastUpdated).toLocaleString()
                    : "unknown"}
            </p>
        </section>
    );
}
