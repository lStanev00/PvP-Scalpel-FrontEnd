import { useContext } from "react";
import { CharacterContext } from "../../pages/CharDetails";
import Style from "../../Styles/modular/TallentSection.module.css"
import delay from "../../helpers/delay";
import { GiScrollUnfurled } from "react-icons/gi";
import { FaCopy } from "react-icons/fa6";

export default function TalentSection() {
    const { data } = useContext(CharacterContext);
    const { activeSpec, talents } = data || {};
    const buttonDefaultText = "Copy Active Code";

    async function handleCopy(e) {
        e.preventDefault();
        const btnEl = e.target;
        try {
            await navigator.clipboard.writeText(talents?.talentsCode || "");
            btnEl.textContent = "Copied!";
            await delay(3000);
            btnEl.textContent = buttonDefaultText;
        } catch {
            btnEl.textContent = "Error";
        }
    }

    if (!data) return null;

    return (
        <section className={Style.section}>
            <h2>
                <GiScrollUnfurled className={Style.iconHeader} />
                Talent Code
            </h2>

            <div className={Style.inner}>
                <div className={Style.specs}>
                    <div className={Style.specCard}>
                        <img src={data.class.media} alt={data.class.name} />
                        <span>{data.class.name}</span>
                    </div>
                    <div className={Style.specCard}>
                        <img src={activeSpec.media} alt={activeSpec.name} />
                        <span>{activeSpec.name}</span>
                    </div>
                </div>

                <p className={Style.talentSpec}>{talents?.talentsSpec}</p>

                <button className={Style.copyBtn} onClick={handleCopy}>
                    <FaCopy className={Style.copyIcon} />
                    {buttonDefaultText}
                </button>
            </div>
        </section>
    );
}
