import { useContext } from 'react';
import Style from '../../Styles/modular/ArmoryItemHover.module.css';
import { HoverContext } from './Armory';

export default function ArmoryItemHover() {
    const {hoverItem: item, coursorPosition} = useContext(HoverContext);

    if (!item) return null;

    return (
        <div 
            className={Style.wrapper}
            style={{
                top: `calc(${(coursorPosition.y)}px + 0.5rem)`,
                left: `calc(${(coursorPosition.x)}px + 1.5rem)`
            }}
        >
            <img src={item.media} alt={item.name} className={Style.icon} />

            <div className={Style.details}>
                <h4 className={Style.name}>{item.name}</h4>
                <p className={Style.level}>Item Level {item.level}</p>

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
                                    <span className={Style.spellName}>{spellObj.spell.name}</span>: {spellObj.description}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}



                {item.enchantments?.length > 0 && (
                    <div className={Style.enchants}>
                        {item.enchantments.map((ench, i) => {
                            const cleanedDesc = ench.description.replace(/\|A:.*?\|a/g, '');
                            const [_, name, detail] = cleanedDesc.match(/^Enchanted: (.*?)(?: - )?(.*)?$/) || [];
                            return (
                                <p key={i} className={Style.enchantLine}>
                                    <span className={Style.enchantName}>{name || 'Enchant'}</span>
                                    {detail ? `: ${detail}` : ''}
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
