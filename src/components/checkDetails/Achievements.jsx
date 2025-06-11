import { useContext, useEffect, useState } from "react";
import { CharacterContext } from "../../pages/CharDetails";
import Style from "../../Styles/modular/AchSection.module.css"
import filterAchieves from "../../helpers/achviesCheckers.js";
import { v4 as uuidv4 } from 'uuid';
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
        <div className={Style["section"]}>
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

            <div className={Style.seasonalContainer}>
                {seasonalAchives.size !== 0 && (<SeasonalPagination seasonalAchievesMap={seasonalAchives} />)}

                {seasonalAchives.size !== 0 && (
                    Array.from(seasonalAchives.entries()).map(([key, value]) => {
                        if (key === "noSeason") return null;
                        return (
                        <div key={uuidv4()} className={Style.seasonalMain}>
                            <h2>{key}</h2>
                            <div className={Style.seasonalAchieves}>
                                {value && Object.entries(value).map(([seasonIndex, achList]) => (
                                    achList.map(ach => {

                                        if(!ach.criteria) {
                                            <AchievementDiv key={uuidv4()} seasonal={true} achData={ach} />

                                        }

                                        try {
                                            
                                            return (
                                                <AchievementDiv key={(ach._id || ach.criteria || ach.name).replace(/\s+/g, "-")} seasonal={true} achData={ach} />
                                            )
                                        } catch (error) {
                                        return <AchievementDiv key={ach._id ||ach.criteria} seasonal={true} achData={ach} />

                                        }

                                    })
                                ))}
                            </div>
                        </div>
                        );
                    })
                )}
            </div>


        </div>
    </>
    )

}

function AchievementDiv({achData, seasonal = undefined}){

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