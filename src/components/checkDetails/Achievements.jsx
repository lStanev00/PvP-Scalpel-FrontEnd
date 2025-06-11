import { useContext, useEffect, useState } from "react";
import { CharacterContext } from "../../pages/CharDetails";
import Style from "../../Styles/modular/AchSection.module.css"
import filterAchieves from "../../helpers/achviesCheckers.js";

export default function AchevementsSection() {
    const {data} = useContext(CharacterContext);
    const [achievements, setAchievements] = useState(data.achieves);
    const [seasonalAchives, setSeasonalAchives] = useState(undefined)

    useEffect(() => {
        const shadowSeasonMap = new Map();
        const seasonalAchList = data?.listAchievements;
        console.log(seasonalAchList)
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

            console.log(shadowSeasonMap)

            // const cheatSheat = [`Elite:`, `Duelist:`, `Rival II:`, "Rival I:", `Challenger II:`, `Challenger I:`, `Combatant II:`, `Combatant I:`].reverse();

            // for (const [expansion, seasonList] of shadowSeasonMap.entries()) {
            //     if (expansion == "noSeason") continue;
                
            //     for (const [seasonIndex, ssAches] of Object.entries(seasonList)) {
            //         let biggest = null;
            //         for (const title of cheatSheat) {
            //             const titleIndex = ssAches.findIndex(ach => ach.name.includes(title));
            //             if(titleIndex != -1) biggest = ssAches.splice(titleIndex, 1)[0]
            //         }
            //         if(biggest != null) ssAches.push(biggest)
            //     }
            // }

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
                    return (<>
                        {Object.entries(value).map(([achKey, achData]) => {
                            return(<AchievementDiv key={key +  achKey} achData={achData} />)
                        })}
                    </>)
                }

                if(value.name)return <AchievementDiv key={ key } achData={value} />

            })
        )}


            </div>

            <div className={Style.seasonalContainer}>

                {seasonalAchives.size !== 0 && (
                    Array.from(seasonalAchives.entries()).map(([key, value]) => {
                        if (key === "noSeason") return null;
                        return (<>
                        <div className={Style.seasonalMain}>
                            <h2>{key}</h2>
                            <div className={Style.seasonalAchieves}>
                                {value && Object.entries(value).map(([seasonIndex, achList]) => (
                                    achList.map(ach => (
                                        <AchievementDiv key={ach.criteria || ach.name} seasonal={true} achData={ach} />
                                    ))
                                ))}
                            </div>
                        </div>
                        </>
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
    <>
        <div className={Style[seasonal == undefined? "card": `seasonal-card`]}>
            <img src={achData.media} alt="Achievement Image" />
            <div className={Style[seasonal == undefined? "card-content": "seasonal-card-content"]}>
                <strong>{achData.name}</strong>
                <span>{achData.description}</span>
            </div>
        </div>
    </>
    )
}