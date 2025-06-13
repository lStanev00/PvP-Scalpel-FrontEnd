import { useContext } from "react"
import { DetailsProvider } from "./Details"
import { CharacterContext } from "../../pages/CharDetails";

export default function TallentsSection() {
    const {Style} = useContext(DetailsProvider);
    const {data} = useContext(CharacterContext);
    const {talentCode, activeSpec} = data;
    const playerClass = data[`class`];
    console.log(data)
if (data) return (
    <div 
    className={Style["section"]}
    style={{
        height: "fit-content",
    }}
    >
        <h3>Talent Trees</h3>
        <button className={Style["button"]}>Copy Talent Code</button>
        <p>Protection Warrior Talents</p>
    </div> 

)

}