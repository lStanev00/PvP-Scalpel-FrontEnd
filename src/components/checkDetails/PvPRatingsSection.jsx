import PvPCards from "./PvPCards";
import Style from "../../Styles/modular/PvPRatingsSection.module.css";

export default function PvPRatingsSection({ otherRatings, blitzRatings, shuffleRatings, data }) {
    const hasAny =
        Object.keys(otherRatings).length > 0 ||
        Object.keys(blitzRatings).length > 0 ||
        Object.keys(shuffleRatings).length > 0;

    if (!hasAny) {
        return (
            <div className={Style.noRatings}>
                <h2 className={Style.noRatingsTitle}>
                    No PvP Information Found for This Character
                </h2>
            </div>
        );
    }

    return (
        <div className={Style.section}>
            <h1 className={Style.mainTitle}>PvP Ratings</h1>

            <div className={Style[`pvp-container`]}>
                {/* === General PvP Ratings === */}
                {Object.keys(otherRatings).length > 0 && (
                    <div className={Style.ratingGroup}>
                        <h2 className={Style.groupTitle}>General</h2>
                        <div className={Style.pvpContainer}>
                            {Object.entries(otherRatings).map(([key, bracket]) => {
                                let bracketType = null;

                                if (key === "rbg") {
                                    bracketType = "Rated Battleground";
                                    bracket.achieves = data.achieves?.RBG?.XP;
                                } else if (key === "2v2" && data?.achieves?.["2s"]) {
                                    bracketType = "Arena 2v2";
                                    bracket.achieves = data?.achieves["2s"];
                                } else if (key === "3v3" && data?.achieves?.["3s"]) {
                                    bracketType = "Arena 3v3";
                                    bracket.achieves = data?.achieves["3s"];
                                }

                                if (!bracketType) return null;

                                return <PvPCards key={key} specLabel={bracketType} bracketData={bracket} />;
                            })}
                        </div>
                    </div>
                )}

                {/* === Blitz Ratings === */}
                {Object.keys(blitzRatings).length > 0 && (
                    <div className={Style.ratingGroup}>
                        <h2 className={Style.groupTitle}>Blitz</h2>
                        <div className={Style.pvpContainer}>
                            {Object.entries(blitzRatings).map(([key, bracket]) => {
                                const [, , spec] = key.split("-");
                                const specName = spec.charAt(0).toUpperCase() + spec.slice(1);

                                const strategistExist = data.listAchievements?.find((a) =>
                                    a.name.includes("Strategist")
                                );

                                bracket.achieves = strategistExist
                                    ? { name: "Strategist", media: strategistExist.media }
                                    : data?.achieves?.Blitz?.XP;

                                return <PvPCards key={`Blitz::${specName}`} specLabel={specName} bracketData={bracket} />;
                            })}
                        </div>
                    </div>
                )}

                {/* === Solo Shuffle Ratings === */}
                {Object.keys(shuffleRatings).length > 0 && (
                    <div className={Style.ratingGroup}>
                        <h2 className={Style.groupTitle}>Solo Shuffle</h2>
                        <div className={Style.pvpContainer}>
                            {Object.entries(shuffleRatings).map(([key, bracket]) => {
                                const [, , spec] = key.split("-");
                                const specName = spec.charAt(0).toUpperCase() + spec.slice(1);

                                return <PvPCards key={`SS::${specName}`} specLabel={specName} bracketData={bracket} />;
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
