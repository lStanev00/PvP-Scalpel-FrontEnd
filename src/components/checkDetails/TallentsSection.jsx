import { useContext } from "react"
import { DetailsProvider } from "./Details"
import { CharacterContext } from "../../pages/CharDetails";
import Style from "../../Styles/modular/TallentSection.module.css"
import delay from "../../helpers/delay";

export default function TalentsSection() {
    const {data} = useContext(CharacterContext);
    const {activeSpec, talents} = data;
    const buttonDefaultText = "Copy Active Code";

    async function handleCopy(e) {
        e.preventDefault();
        const btnEl = e.target;

        navigator.clipboard.writeText(talents?.talentsCode)
            .then(async () => {
                if(btnEl) {
                    btnEl.textContent = "Copied!";
                    await delay(3000);
                    btnEl.textContent = buttonDefaultText;
                }
                
            })
            .catch((err) => {if(btnEl) btnEl.textContent = "Error"} );
    }

    
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
                <button onClick={async (e) => await handleCopy(e)} className={Style["button"]}>{buttonDefaultText}</button>

            </div>
        </div> 

    )

}