export default function DropDownItem ({entry, Style}) {
    return (

    <li className={Style.dropdownItem}>
        <img className={Style.classIcon} src={entry.char.class.media} alt={entry.char.class.name + "class icon"} />
        {entry?.char?.name} - {entry?.realmName}

    </li>

    )

}