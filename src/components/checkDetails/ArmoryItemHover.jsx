import { useContext } from 'react';
import Style from '../../Styles/modular/ArmoryItemHover.module.css';
import { CharacterContext } from '../../pages/CharDetails';

export default function ArmoryItemHover() {
    const {hoverItem: item, coursorPosition} = useContext(CharacterContext);

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
                            <img
                                key={i}
                                src={socket.media}
                                alt={socket.gemName}
                                title={`${socket.gemName} (${socket.bonus})`}
                                className={Style.socket}
                            />
                        ))}
                    </div>
                )}

                {item.enchantments?.length > 0 && (
                    <p className={Style.enchant}>{item.enchantments[0].description.replace(/\|A:.*?\|a/g, '')}</p>
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
