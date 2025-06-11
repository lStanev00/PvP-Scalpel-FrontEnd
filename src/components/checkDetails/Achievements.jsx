import { useContext, useEffect, useState } from "react";
import { CharacterContext } from "../../pages/CharDetails";
import Style from "../../Styles/modular/AchSection.module.css"
import filterAchieves from "../../helpers/achviesCheckers.js";
import SeasonalPagination from "./SeasonalPagination.jsx";

export default function AchevementsSection() {
    const {data} = useContext(CharacterContext);
    const [achievements, setAchievements] = useState(data.achieves);
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
        {/* <div className={Style["section"]}>
            <div className={Style.headerDiv}>
                <h1>Achievements</h1>
                <p>{data.achieves.points} Points</p>
            </div>
            <div className={Style.achContent}>
                
        {achievements && (
            Object.entries(achievements).map(([key, value]) => {

                if(key == "RBG") {
                    if(achievements.Blitz.XP.name == value.XP.name) {
                        const rbgWins = value.WINS;
                        if(rbgWins) return <AchievementDiv key = {key} achData={rbgWins} /> 
                    }
                }

                if(value.XP || value.WINS) {
                    return Object.entries(value).map(([achKey, achData]) => (
                        <AchievementDiv key={`${key}-${achKey}`} achData={achData} />
                    ));
                }

                if(value.name)return <AchievementDiv key={ key } achData={value} />

            })
        )}


            </div>

        </div> */}
            {seasonalAchives.size > 1 && (
                <div 
                className={Style["section"]}
                style={{
                   paddingBottom: "15px" 
                }}
                > 
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