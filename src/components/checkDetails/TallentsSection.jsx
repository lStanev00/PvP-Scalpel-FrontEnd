import { useContext } from "react"
import { DetailsProvider } from "./Details"
import { CharacterContext } from "../../pages/CharDetails";
import Style from "../../Styles/modular/TallentSection.module.css"

export default function TalentsSection() {
    const {Style: ParentStyle} = useContext(DetailsProvider);
    const {data} = useContext(CharacterContext);
    const {talentCode, activeSpec, talents} = data;
    console.log(data)
    
    if (data) return (
        <div 
        className={`${Style.main}`}
        style={{
            height: "fit-content",
        }}
        >
            <h3>Talent Code</h3>

            <div className={`${Style.content}`}>

                <div className={Style.charInfo}>
                    <span><img src={data["class"].media} alt="" />{data["class"]?.name}</span>
                    <span><img src={activeSpec?.media} alt="Specialization image" />{activeSpec?.name}</span>

                </div>

                <p className={Style.talentSpec}>{talents?.talentsSpec}</p>
                <button className={Style["button"]}>Copy Active Code</button>

            </div>
        </div> 

    )

}