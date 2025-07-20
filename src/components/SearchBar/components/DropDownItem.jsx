import { useNavigate } from "react-router-dom"

export default function DropDownItem ({entry, Style, inputRef}) {
    const navigate = useNavigate();
    const char = entry.char;

    const handleClick = () => {
        inputRef.current.value = ""
        navigate(`/check/${char.server}/${char.playerRealm.slug}/${char.name}`)
    }
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
            <span className={Style.serverName}>{(char.server).toUpperCase()}</span>
        </div>

    </li>

    )

}