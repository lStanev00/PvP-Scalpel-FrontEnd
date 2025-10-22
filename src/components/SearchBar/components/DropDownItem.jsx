import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../hooks/ContextVariables";

// Icons
import { FaGlobeEurope, FaFlagUsa, FaGlobeAsia, FaGlobeAmericas, FaGlobe } from "react-icons/fa";

export default function DropDownItem({ entry, Style, guessChar = undefined }) {
    const navigate = useNavigate();
    const char = entry?.char || undefined;
    const { inputRef } = useContext(UserContext);

    const handleClick = () => {
        inputRef.current.value = "";
        if (guessChar) {
            navigate(`/check/${guessChar?.server}/${guessChar?.realmSlug}/${guessChar?.charName}`);
        } else {
            navigate(`/check/${char.server}/${char.playerRealm.slug}/${char.name}`);
        }
    };

    // region logic
    const region = (guessChar?.server || char?.server || "").toLowerCase();
    const regionIcons = {
        eu: <FaGlobeEurope size={12} color="#ffffff" />,
        us: <FaFlagUsa size={12} color="#ffffff" />,
        kr: <FaGlobeAsia size={12} color="#ffffff" />,
        cn: <FaGlobeAsia size={12} color="#ffffff" />,
        tw: <FaGlobeAsia size={12} color="#ffffff" />,
        ru: <FaGlobeAmericas size={12} color="#ffffff" />,
        default: <FaGlobe size={12} color="#ffffff" />,
    };

    const icon = regionIcons[region] || regionIcons.default;

    if (guessChar)
        return (
            <li onClick={handleClick} className={Style.dropdownItem}>
                <span className={Style.serverName}>
                    {icon}
                    {(guessChar?.server).toUpperCase()}
                </span>

                <img className={Style.classIcon} src="/plus_icon.png" alt="Add icon" />

                <div className={Style.playerData}>
                    <p className={Style.nameRealm}>
                        {guessChar?.charName} - {guessChar?.realmName}
                    </p>
                </div>
            </li>
        );

    return (
        <li onClick={handleClick} className={Style.dropdownItem}>
            <span className={Style.serverName}>
                {icon}
                {(char?.server).toUpperCase()}
            </span>

            <img
                className={Style.classIcon}
                src={char.class.media}
                alt={char.class.name + " class icon"}
            />

            <div className={Style.playerData}>
                <p className={Style.nameRealm}>
                    {char?.name} - {entry?.realmName}
                </p>
            </div>
        </li>
    );
}
