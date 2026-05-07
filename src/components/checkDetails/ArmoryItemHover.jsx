import { useContext } from "react";
import Style from "../../Styles/modular/ArmoryItemHover.module.css";
import { HoverContext } from "./Armory";

export default function ArmoryItemHover() {
    const { hoverItem: item, coursorPosition } = useContext(HoverContext);

    if (!item) return null;
    const zoom = getCurrentZoom();
    const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 0;
    const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 0;
    const showLeft = coursorPosition.x > viewportWidth / 2;
    const showAbove = coursorPosition.y > viewportHeight * 0.68;
    const scaledX = coursorPosition.x / zoom;
    const scaledY = coursorPosition.y / zoom;
    const scaledViewportWidth = viewportWidth / zoom;
    const scaledViewportHeight = viewportHeight / zoom;
    const positionStyle = {
        ...(showAbove
            ? { bottom: `calc(${scaledViewportHeight - scaledY}px + 0.5rem)` }
            : { top: `calc(${scaledY}px + 0.5rem)` }),
        ...(showLeft
            ? { right: `calc(${scaledViewportWidth - scaledX}px + 1.5rem)` }
            : { left: `calc(${scaledX}px + 1.5rem)` }),
    };

    return (
        <div
            className={Style.wrapper}
            style={positionStyle}>
            <img src={item.media} alt={item.name} className={Style.icon} />

            <div className={Style.details}>
                <h4 className={Style.name}>{item.name}</h4>
                {item.pvpIlvl && <p className={Style.level}>PvP Item Level {item.pvpIlvl}</p>}

                <ul className={Style.stats}>
                    {item.stats?.map((stat, index) => (
                        <li key={index}>
                            {stat.type}: <b>{stat.value}</b>
                        </li>
                    ))}
                </ul>

                {item.sockets?.length > 0 && (
                    <div className={Style.sockets}>
                        {item.sockets.map((socket, i) => (
                            <div key={i} className={Style.socketWrapper}>
                                <img
                                    src={socket?.media}
                                    alt={socket?.gemName}
                                    className={Style.socket}
                                />
                                <div className={Style.gemInfo}>
                                    <p className={Style?.gemName}>{socket?.gemName}</p>
                                    <p className={Style?.gemBonus}>{socket?.bonus}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {item.spells?.length > 0 && (
                    <div className={Style.spells}>
                        <h5 className={Style.spellHeader}>Spells</h5>
                        <ul className={Style.spellList}>
                            {item.spells.map((spellObj, i) => (
                                <li key={i} className={Style.spell}>
                                    <span className={Style.spellName}>{spellObj.spell.name}</span>:{" "}
                                    {spellObj.description}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {item.enchantments?.length > 0 && (
                    <div className={Style.enchants}>
                        {item.enchantments.map((ench, i) => {
                            const cleanedDesc = ench.description.replace(/\|A:.*?\|a/g, "");
                            const [_, name, detail] =
                                cleanedDesc.match(/^Enchanted: (.*?)(?: - )?(.*)?$/) || [];
                            return (
                                <p key={i} className={Style.enchantLine}>
                                    <span className={Style.enchantName}>{name || "Enchant"}</span>
                                    {detail ? `: ${detail}` : ""}
                                </p>
                            );
                        })}
                    </div>
                )}

                {item.transmog && (
                    <p className={Style.transmog}>
                        Transmog: <i>{item.transmog.name}</i>
                    </p>
                )}
            </div>
        </div>
    );
}

export function getCurrentZoom() {
    const w = window.innerWidth;
    if (w <= 1150) return 0.65;
    if (w <= 1550) return 0.8;
    return 1; // default
}
