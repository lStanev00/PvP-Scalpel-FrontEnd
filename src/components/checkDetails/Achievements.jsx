import { useContext, useState } from "react";
import { CharacterContext } from "../../pages/CharDetails";
import Style from "../../Styles/modular/AchSection.module.css"

export default function AchevementsSection() {
    const {data} = useContext(CharacterContext);
    const [achievements, setAchievements] = useState(data.achieves);
    console.log(achievements);


    return(
    <>
        <div className={Style["section"]}>
            <div className={Style.headerDiv}>
                <h1>Achievements</h1>
                <p>-=[* {data.achieves.points} Points *]=-</p>
            </div>
            <div className={Style.achContent}>

                <div className={Style["card"]}>
                    <img src="https://render.worldofwarcraft.com/eu/icons/56/achievement_arena_2v2_4.jpg" alt="Achievement" />
                    <div className={Style["card-content"]}>
                        <strong>Just the Two of Us: 1750</strong>
                        <span>Earn a 1750 personal rating in the 2v2 bracket of the arena.</span>
                    </div>
                </div>
                
        {achievements && (
            achievements.map(achiev => {

            })
        )}

            </div>
        </div>
    </>
    )

}