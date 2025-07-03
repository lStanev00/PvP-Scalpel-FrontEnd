import { useContext } from "react"
import { DetailsProvider } from "./Details"
import Style from "../../Styles/modular/Armory.module.css"
import { CharacterContext } from "../../pages/CharDetails";
import fallback_img from "/item_fallback.png"

export default function Armory () {
    const {Style: ParentStyle} = useContext(DetailsProvider);
    const {data, coursorPosition, setCoursorPosition} = useContext(CharacterContext);
    const {gear} = data;
    console.log(gear)
    return (
        <section className={`${ParentStyle.section} ${Style.parentSection}`}>

            <h1 style={{fontSize: "2.4rem", marginBottom: "1rem"}}>Armory</h1>

            <div 
                className={`${ParentStyle["inner-section"]} ${Style.main}`}
                onMouseMove={(e) => setCoursorPosition({x: e.clientX, y : e.clientY})} 
            >
                <div className={Style.bgLayer}></div>
                <div className={Style.container}>
                    <ItemsTab1 />
                    <img className={Style.charImg} src={data.media.charImg} alt={`${data?.name}'s Character Image`} />
                    <ItemsTab2 />

                </div>
                <ItemsTab3 />
            </div>

        </section>
    )
}

function ItemsTab1() {
    return(
        <div className={Style.items}>
            <ItemGenerator name={"head"} />
            <ItemGenerator name={"neck"} />
            <ItemGenerator name={"shoulder"} />
            <ItemGenerator name={"back"} />
            <ItemGenerator name={"chest"} />
            <ItemGenerator name={"shirt"} />
            <ItemGenerator name={"tabard"} />
            <ItemGenerator name={"wrist"} />

        </div>
    )
}

function ItemsTab2() {
        return(
        <div className={Style.items}>
            <ItemGenerator name={"hands"} />
            <ItemGenerator name={"waist"} />
            <ItemGenerator name={"legs"} />
            <ItemGenerator name={"feet"} />
            <ItemGenerator name={"ring1"} />
            <ItemGenerator name={"ring2"} />
            <ItemGenerator name={"trinket1"} />
            <ItemGenerator name={"trinket2"} />
        </div>
    )

}

function ItemsTab3() {
        return(
        <div className={Style.handItems}>
            <ItemGenerator name={"wep"} />
            <ItemGenerator name={"offHand"} />
        </div>
    )

}


function ItemGenerator({ name }) {
    const { data, setHoverItem } = useContext(CharacterContext);
    const { gear: items } = data;
    const item = items?.[name]

    if (!item) return (<img className={Style.itemImg} src={fallback_img} />);
    if (name.length <= 2) return (<img className={Style.itemImg} src={fallback_img} />);
    if(item) return (
        <>

            <img 
            className={Style.itemImg} 
            src={item?.media ? item?.media : fallback_img } 
            onMouseEnter={() => setHoverItem(item)}
            onMouseLeave={() => setHoverItem(null)}
        />
            
        </>
    );
}
