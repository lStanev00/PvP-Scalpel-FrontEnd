import { createContext, useContext, useEffect, useRef, useState } from "react";
import Style from "../../Styles/modular/Armory.module.css";
import { CharacterContext } from "../../pages/CharDetails";
import ArmoryItemHover from "./ArmoryItemHover";
import { publicAssetUrl } from "../../helpers/assets.js";

const fallbackImg = publicAssetUrl("item_fallback.png");

export const HoverContext = createContext();

export default function Armory() {
    const { data } = useContext(CharacterContext);
    const [hoverItem, setHoverItem] = useState(null);
    const [anchorRect, setAnchorRect] = useState(null);
    const armoryRef = useRef(null);

    const showItem = (item, element) => {
        if (!item || !element) return;
        setHoverItem(item);
        setAnchorRect(element.getBoundingClientRect());
    };

    const hideItem = () => {
        setHoverItem(null);
        setAnchorRect(null);
    };

    useEffect(() => {
        if (!hoverItem) return undefined;

        const closeOnEscape = (event) => {
            if (event.key !== "Escape") return;
            setHoverItem(null);
            setAnchorRect(null);
        };
        const closeOutsideArmory = (event) => {
            if (armoryRef.current?.contains(event.target)) return;
            setHoverItem(null);
            setAnchorRect(null);
        };

        document.addEventListener("keydown", closeOnEscape);
        document.addEventListener("pointerdown", closeOutsideArmory);
        document.addEventListener("focusin", closeOutsideArmory);
        return () => {
            document.removeEventListener("keydown", closeOnEscape);
            document.removeEventListener("pointerdown", closeOutsideArmory);
            document.removeEventListener("focusin", closeOutsideArmory);
        };
    }, [hoverItem]);

    return (
        <HoverContext.Provider value={{ hoverItem, anchorRect, showItem, hideItem }}>
            <section className={Style.parentSection} ref={armoryRef}>
                <h1 className={Style.title}>Armory</h1>

                <div className={Style.main}>
                    <div className={Style.bgLayer} aria-hidden="true"></div>
                    <div className={Style.container}>
                        <ItemsTab1 />
                        <img
                            className={Style.charImg}
                            src={data.media.charImg}
                            alt={`${data?.name}'s Character Image`}
                        />
                        <ItemsTab2 />
                    </div>
                    <ItemsTab3 />
                </div>

                <ArmoryItemHover />
            </section>
        </HoverContext.Provider>
    );
}

function ItemsTab1() {
    return (
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
    );
}

function ItemsTab2() {
    return (
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
    );
}

function ItemsTab3() {
    return (
        <div className={Style.handItems}>
            <ItemGenerator name={"wep"} />
            <ItemGenerator name={"offHand"} />
        </div>
    );
}

function ItemGenerator({ name }) {
    const { data } = useContext(CharacterContext);
    const { hoverItem, showItem, hideItem } = useContext(HoverContext);
    const { gear: items } = data;
    const item = items?.[name];
    const isOpen = Boolean(item && hoverItem === item);

    if (!item) {
        return (
            <span className={Style.itemSlot} aria-hidden="true">
                <img className={Style.itemImg} src={fallbackImg} alt="" />
            </span>
        );
    }

    return (
        <button
            type="button"
            className={Style.itemControl}
            aria-label={`View ${item.name || name} details`}
            aria-expanded={isOpen}
            aria-describedby={isOpen ? "armory-item-details" : undefined}
            onMouseEnter={(event) => showItem(item, event.currentTarget)}
            onMouseLeave={(event) => {
                if (document.activeElement !== event.currentTarget) hideItem();
            }}
            onFocus={(event) => showItem(item, event.currentTarget)}
            onClick={(event) => showItem(item, event.currentTarget)}
        >
            <img
                className={Style.itemImg}
                src={item.media || fallbackImg}
                alt=""
            />
        </button>
    );
}
