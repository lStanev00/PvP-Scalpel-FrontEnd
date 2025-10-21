import StatsToggle from "./StatsToggle";
import Style from "../../Styles/modular/PvPCards.module.css"

export default function PvPCards({ bracketData }) {
    if (!bracketData?.currentSeason?.title?.media) return null;
    if (bracketData?.currentSeason?.rating === 0) bracketData.currentSeason.rating = null;

    const isSolo = bracketData._id.includes("solo");
    const hasRecord = bracketData?.achieves?.media;
    const hasRating = bracketData?.currentSeason?.rating;
    if (!isSolo && !hasRecord) return null;

    const { currentSeason } = bracketData;
    const rating = currentSeason?.rating ?? null;
    const ratingMedia = currentSeason?.title?.media;
    const ratingName = currentSeason?.title?.name;


    return (
        <div className={Style["pvp-card"]}>
            <div className={Style["pvp-spec"]}>
                {/* Rating Box */}
                {hasRating && ratingMedia && (
                    <div className={Style["pvp-details"]}>
                        <p>Rating</p>
                        <img src={ratingMedia} alt="PvP Rank Icon" />
                        <div>
                            <strong>{ratingName}</strong>
                            {rating && <span className={Style["pvp-rating"]}>{rating}</span>}
                        </div>
                    </div>
                )}

                {/* Record / Achievement */}
                {hasRecord && (
                    <div className={Style["pvp-details"]}>
                        <p>Record</p>
                        <img src={bracketData.achieves.media} alt="Achievement Icon" />
                        <div>
                            <strong>{bracketData.achieves.name}</strong>
                            {bracketData.record && (
                                <span className={Style["pvp-rating"]}>{bracketData.record}</span>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <StatsToggle currentSeason={currentSeason} />
        </div>
    );
}
