import { useContext } from "react";
import { useNavigate } from "react-router-dom"
import { UserContext } from "../../../hooks/ContextVariables";

export default function DropDownItem ({entry, Style, guessChar = undefined}) {
    const navigate = useNavigate();
    const char = entry?.char || undefined;
    const {inputRef} = useContext(UserContext);
    

    const handleClick = () => {
        inputRef.current.value = ""
        if (guessChar) {
            navigate(`/check/${guessChar?.server}/${guessChar?.realmSlug}/${guessChar?.charName}`)

        } else {

            navigate(`/check/${char.server}/${char.playerRealm.slug}/${char.name}`)
        }

    }

    if (guessChar) return (
    <li
        onClick={() => handleClick()}
        className={Style.dropdownItem}
    >

        <img className={Style.classIcon} src="/plus_icon.png" alt="Add icon" />
        
        <div 
            className={Style.playerData}
        >
            <p className={Style.nameRealm}>

                {guessChar?.charName} - {guessChar?.realmName}
            </p>
            <span className={Style.serverName}>{(guessChar?.server).toUpperCase()}</span>
        </div>

    </li>
    )
    return (

    <li
        onClick={() => handleClick()}
        className={Style.dropdownItem}
    >

        <img className={Style.classIcon} src={char.class.media} alt={char.class.name + "class icon"} />
        
        <div 
            className={Style.playerData}
        >
            <p className={Style.nameRealm}>

                {char?.name} - {entry?.realmName}
            </p>
            <span className={Style.serverName}>{(char?.server).toUpperCase()}</span>
        </div>

    </li>

    )

}