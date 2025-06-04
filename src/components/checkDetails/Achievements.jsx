import { useContext, useState } from "react";
import { CharacterContext } from "../../pages/CharDetails";
import Style from "../../Styles/modular/AchSection.module.css"

export default function AchevementsSection() {
    const {data} = useContext(CharacterContext);
    const [achievements, setAchievements] = useState(data.achieves);
    const [seasonalAch, setSeasonalAch] = useState(data.listAchievements);
    console.log(seasonalAch);


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
        </div>
    </>
    )

}

function AchievementDiv({achData}){

    if(achData) return (
    <>
        <div className={Style["card"]}>
            <img src={achData.media} alt="Achievement Image" />
            <div className={Style["card-content"]}>
                <strong>{achData.name}</strong>
                <span>{achData.description}</span>
            </div>
        </div>
    </>
    )
}