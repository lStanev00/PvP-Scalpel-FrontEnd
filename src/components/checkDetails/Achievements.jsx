import { useContext, useEffect, useState } from "react";
import { CharacterContext } from "../../pages/CharDetails";
import Style from "../../Styles/modular/AchSection.module.css"
import filterAchieves from "../../helpers/achviesCheckers.js";
import SeasonalPagination from "./SeasonalPagination.jsx";

export default function AchevementsSection() {
    const {data} = useContext(CharacterContext);
    const achievements = data?.achieves;
    const [seasonalAchives, setSeasonalAchives] = useState(undefined)

    useEffect(() => {
        const shadowSeasonMap = new Map();
        const seasonalAchList = data?.listAchievements;
        shadowSeasonMap.set("noSeason", []);

        if (seasonalAchList) {
            for (const sAch of seasonalAchList) {
                if (sAch?.expansion) {
                    const existing = shadowSeasonMap.get(sAch.expansion.name) || {};
                    const existingSeason = existing[sAch.expansion.season] || [];
                    existingSeason.push(sAch);
                    existing[sAch.expansion.season] = existingSeason
                    shadowSeasonMap.set(sAch.expansion.name, existing);
                } else {
                    const fallback = shadowSeasonMap.get("noSeason") || {};
                    fallback.push(sAch);
                    shadowSeasonMap.set("noSeason", fallback);
                }
            }

            const sortedAches = filterAchieves(shadowSeasonMap);
            if (sortedAches) setSeasonalAchives(sortedAches)
            
        }
    }, []);



    if (achievements && seasonalAchives) return(
    <>
            {seasonalAchives.size > 1 && (
                <div className={Style["section"]}> 
                    <SeasonalPagination seasonalAchievesMap={seasonalAchives} />
                </div>

                )}
    </>
    )

}

export function AchievementDiv({achData, seasonal = undefined}){

    if(achData) return (
        <div className={Style[seasonal == undefined? "card": `seasonal-card`]}>
            <img src={achData.media} alt="Achievement Image" />
            <div className={Style[seasonal == undefined? "card-content": "seasonal-card-content"]}>
                <strong>{achData.name}</strong>
                <span>{achData.description}</span>
            </div>
        </div>
    )
}