import StatsToggle from "./StatsToggle";
import Style from "../../Styles/modular/PvPCards.module.css"

export default function PvPCards({ bracketData, bracketLabel = undefined, specLabel = undefined }) {
    const hasRecord = bracketData?.achieves?.media;
    const { currentSeason } = bracketData;
    const seasonPlayed = currentSeason?.seasonMatchStatistics?.played ?? 0;
    const weeklyPlayed = currentSeason?.weeklyMatchStatistics?.played ?? 0;
    const hasPlayedGames = seasonPlayed > 0 || weeklyPlayed > 0;
    const rawRating = currentSeason?.rating;
    const hasRating =
        rawRating != null && (rawRating > 0 || (rawRating === 0 && hasPlayedGames));

    if (!hasRating && !hasRecord) return null;

    const rating = hasRating ? rawRating : null;
    const ratingMedia = currentSeason?.title?.media;
    const ratingName = currentSeason?.title?.name;
    const hasHeroMedia = Boolean(ratingMedia || ratingName);
    if(specLabel == "Rated Battleground") specLabel = "RBG 10v10"

    return (
        <article
            className={`${Style["pvp-card"]} ${!hasRecord ? Style.ratingOnlyCard : ""}`}
        >
            <header
                className={`${Style.cardHeader} ${bracketLabel ? Style.cardHeaderSplit : ""}`}
            >
                {bracketLabel && <div className={Style.bracketLabel}>{bracketLabel}</div>}
                <div className={Style.specLabel}>{specLabel}</div>
            </header>

            <div className={Style.cardMain}>
                {/* Rating Box */}
                {hasRating && (
                    <section
                        className={`${Style.cardSection} ${Style.heroSection} ${!hasHeroMedia ? Style.compactHeroSection : ""}`}
                    >
                        {ratingMedia && (
                            <img className={Style.mediaIcon} src={ratingMedia} alt="PvP Rank Icon" />
                        )}
                        <div className={Style.heroMeta}>
                            {rating !== null && (
                                <span className={Style["pvp-rating"]}>{rating}</span>
                            )}
                            {ratingName && <strong className={Style.heroTitle}>{ratingName}</strong>}
                        </div>
                        <p className={Style.sectionLabel}>Rating</p>
                    </section>
                )}

                {/* Record / Achievement */}
                {hasRecord && (
                    <section className={`${Style.cardSection} ${Style.recordSection}`}>
                        <img
                            className={`${Style.mediaIcon} ${Style.recordIcon}`}
                            src={bracketData.achieves.media}
                            alt="Achievement Icon"
                        />
                        <div className={Style.recordCopy}>
                            <p className={Style.sectionLabel}>Record</p>
                            <strong className={Style.recordTitle}>{bracketData.achieves.name}</strong>
                        </div>
                        {bracketData.record && (
                            <span className={Style.recordValue}>{bracketData.record}</span>
                        )}
                    </section>
                )}
            </div>

            <div className={Style.statsFooter}>
                <StatsToggle currentSeason={currentSeason} />
            </div>
        </article>
    );
}
