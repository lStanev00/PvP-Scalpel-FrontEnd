import { useContext, useEffect, useState } from "react";
import { CharacterContext } from "../../pages/CharDetails";
import Style from "../../Styles/modular/AchSection.module.css"

export default function AchevementsSection() {
    const {data} = useContext(CharacterContext);
    const [achievements, setAchievements] = useState(data.achieves);
    const [seasonalAchives, setSeasonalAchives] = useState(new Map())

    useEffect(() => {
        const seasonalAchList = data?.listAchievements;
        seasonalAchives.set("noSeason", []);

        if (seasonalAchList) {
            for (const sAch of seasonalAchList) {
                if (sAch?.expansion) {
                    const existing = seasonalAchives.get(sAch.expansion.name) || {};
                    const existingSeason = existing[sAch.expansion.season] || [];
                    existingSeason.push(sAch);
                    existing[sAch.expansion.season] = existingSeason
                    seasonalAchives.set(sAch.expansion.name, existing);
                } else {
                    const fallback = seasonalAchives.get("noSeason") || {};
                    fallback.push(sAch);
                    seasonalAchives.set("noSeason", fallback);
                }
            }

            const cheatSheat = [`Elite:`, `Duelist`, `Rival II`, "Rival I", `Challenger II`, `Challenger I`, `Combatant II`, `Combatant I`].reverse();

            for (const [expansion, seasonList] of seasonalAchives.entries()) {
                if (expansion == "noSeason") continue;
                
                for (const [seasonIndex, ssAches] of Object.entries(seasonList)) {
                    let biggest = null;
                    for (const title of cheatSheat) {
                        const titleIndex = ssAches.findIndex(ach => ach.name.includes(title));
                        if(titleIndex != -1) biggest = ssAches.splice(titleIndex, 1)[0]
                    }
                    if(biggest != null) ssAches.push(biggest)
                }
            }
            console.info(`This feature is not developed yet! It will break is not live on build aswell you can preview the page at https://www.pvpscalpel.com `)
            console.log(seasonalAchives);
        }
    }, []);



    if (achievements) return(
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

                {seasonalAchives && seasonalAchives.size !== 0 && (
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