import { useContext } from "react"
import { DetailsProvider } from "./Details"
import Style from "../../Styles/modular/Armory.module.css"
import { CharacterContext } from "../../pages/CharDetails";
import fallback_img from "../../../public/item_fallback.png"

export default function Armory () {
    const {Style: ParentStyle} = useContext(DetailsProvider);
    const {data} = useContext(CharacterContext);
    const {gear} = data;
    console.log(ParentStyle)
    return (
        <section className={`${ParentStyle.section} ${Style.parentSection}`}>

            <h1 style={{fontSize: "2.4rem"}}>Armory</h1>

            <div className={`${ParentStyle["inner-section"]} ${Style.main}`}>
                <div className={Style.container}>
                    <ItemsTab1 items={gear} />
                    <div className={Style.charImg}>
                        <img src={data.media.charImg} alt="" />
                    </div>
                    <div className={Style.items}></div>
                </div>
            </div>

        </section>
    )
}

function ItemsTab1({items}) {
    return(
        <div className={Style.items}>
            <ItemGenerator name={"head"} />
            <ItemGenerator name={"neck"} />
            <ItemGenerator name={"shoulder"} />
            <ItemGenerator name={"back"} />
            <ItemGenerator name={"head"} />

        </div>
    )
}

function ItemGenerator({ name }) {
    const { data } = useContext(CharacterContext);
    const { gear: items } = data;

    if (typeof name !== "string") return (<img src={fallback_img} />);
    if (name.length <= 2) return (<img src={fallback_img} />);

    return (
        <img src={items?.[name]?.media ? items?.[name]?.media : fallback_img } />
    );
}
