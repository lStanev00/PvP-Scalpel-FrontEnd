import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../hooks/ContextVariables";

function ServerFlag({ region, className }) {
    switch (region) {
        case "eu":
            return (
                <svg viewBox="0 0 28 18" className={className} aria-hidden="true">
                    <rect width="28" height="18" rx="2.5" fill="#0B46A9" />
                    <circle cx="14" cy="4.2" r="1.1" fill="#FFD54A" />
                    <circle cx="17.8" cy="5.2" r="1.1" fill="#FFD54A" />
                    <circle cx="19.8" cy="9" r="1.1" fill="#FFD54A" />
                    <circle cx="17.8" cy="12.8" r="1.1" fill="#FFD54A" />
                    <circle cx="14" cy="13.8" r="1.1" fill="#FFD54A" />
                    <circle cx="10.2" cy="12.8" r="1.1" fill="#FFD54A" />
                    <circle cx="8.2" cy="9" r="1.1" fill="#FFD54A" />
                    <circle cx="10.2" cy="5.2" r="1.1" fill="#FFD54A" />
                </svg>
            );
        case "us":
            return (
                <svg viewBox="0 0 28 18" className={className} aria-hidden="true">
                    <rect width="28" height="18" rx="2.5" fill="#FFFFFF" />
                    <rect y="0" width="28" height="2" fill="#C9252D" />
                    <rect y="4" width="28" height="2" fill="#C9252D" />
                    <rect y="8" width="28" height="2" fill="#C9252D" />
                    <rect y="12" width="28" height="2" fill="#C9252D" />
                    <rect y="16" width="28" height="2" fill="#C9252D" />
                    <rect width="11.5" height="10" rx="1.5" fill="#22408C" />
                    <circle cx="2.3" cy="2.2" r="0.55" fill="#FFFFFF" />
                    <circle cx="4.7" cy="2.2" r="0.55" fill="#FFFFFF" />
                    <circle cx="7.1" cy="2.2" r="0.55" fill="#FFFFFF" />
                    <circle cx="9.5" cy="2.2" r="0.55" fill="#FFFFFF" />
                    <circle cx="3.5" cy="4.4" r="0.55" fill="#FFFFFF" />
                    <circle cx="5.9" cy="4.4" r="0.55" fill="#FFFFFF" />
                    <circle cx="8.3" cy="4.4" r="0.55" fill="#FFFFFF" />
                    <circle cx="2.3" cy="6.6" r="0.55" fill="#FFFFFF" />
                    <circle cx="4.7" cy="6.6" r="0.55" fill="#FFFFFF" />
                    <circle cx="7.1" cy="6.6" r="0.55" fill="#FFFFFF" />
                    <circle cx="9.5" cy="6.6" r="0.55" fill="#FFFFFF" />
                </svg>
            );
        case "kr":
            return (
                <svg viewBox="0 0 28 18" className={className} aria-hidden="true">
                    <rect width="28" height="18" rx="2.5" fill="#FFFFFF" />
                    <path d="M14 6A3 3 0 0 1 14 12A3 3 0 0 0 14 6Z" fill="#D83A3A" />
                    <path d="M14 12A3 3 0 0 1 14 6A3 3 0 0 0 14 12Z" fill="#1C5FD4" />
                    <rect x="4" y="3" width="4" height="0.9" rx="0.45" fill="#111111" />
                    <rect x="4.2" y="4.4" width="3.6" height="0.9" rx="0.45" fill="#111111" />
                    <rect x="20" y="13.1" width="4" height="0.9" rx="0.45" fill="#111111" />
                    <rect x="20.2" y="11.7" width="3.6" height="0.9" rx="0.45" fill="#111111" />
                </svg>
            );
        case "cn":
            return (
                <svg viewBox="0 0 28 18" className={className} aria-hidden="true">
                    <rect width="28" height="18" rx="2.5" fill="#D91F26" />
                    <polygon points="6,3 6.8,5 9,5 7.2,6.2 7.9,8.2 6,7 4.1,8.2 4.8,6.2 3,5 5.2,5" fill="#FFD54A" />
                    <circle cx="11.2" cy="4.1" r="0.8" fill="#FFD54A" />
                    <circle cx="12.8" cy="6.1" r="0.8" fill="#FFD54A" />
                    <circle cx="12.7" cy="8.8" r="0.8" fill="#FFD54A" />
                    <circle cx="10.8" cy="10.8" r="0.8" fill="#FFD54A" />
                </svg>
            );
        case "tw":
            return (
                <svg viewBox="0 0 28 18" className={className} aria-hidden="true">
                    <rect width="28" height="18" rx="2.5" fill="#D91F26" />
                    <rect width="11.5" height="9.5" rx="2.5" fill="#123E9B" />
                    <circle cx="5.75" cy="4.75" r="2.2" fill="#FFFFFF" />
                    <circle cx="5.75" cy="4.75" r="1.15" fill="#123E9B" />
                </svg>
            );
        case "ru":
            return (
                <svg viewBox="0 0 28 18" className={className} aria-hidden="true">
                    <rect width="28" height="18" rx="2.5" fill="#FFFFFF" />
                    <rect y="6" width="28" height="6" fill="#2458D3" />
                    <rect y="12" width="28" height="6" fill="#D2343A" />
                </svg>
            );
        default:
            return (
                <svg viewBox="0 0 28 18" className={className} aria-hidden="true">
                    <rect width="28" height="18" rx="2.5" fill="#1E293B" />
                    <circle cx="14" cy="9" r="5" fill="none" stroke="#D8E2F0" strokeWidth="1.6" />
                    <path d="M9 9H19M14 4C12.4 5.6 11.7 7.4 11.7 9C11.7 10.6 12.4 12.4 14 14M14 4C15.6 5.6 16.3 7.4 16.3 9C16.3 10.6 15.6 12.4 14 14" stroke="#D8E2F0" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
            );
    }
}

export default function DropDownItem({ entry, Style, guessChar = undefined }) {
    const navigate = useNavigate();
    const char = entry?.char || undefined;
    const { inputRef } = useContext(UserContext);

    const handleClick = () => {
        if (inputRef?.current) inputRef.current.value = "";
        if (guessChar) {
            navigate(`/check/${guessChar?.server}/${guessChar?.realmSlug}/${guessChar?.charName}`);
        } else {
            navigate(`/check/${char.server}/${char.playerRealm.slug}/${char.name}`);
        }
    };

    const region = (guessChar?.server || char?.server || "").toLowerCase();
    if (guessChar)
        return (
            <li onClick={handleClick} className={Style.dropdownItem}>
                <img className={Style.classIcon} src="/plus_icon.png" alt="Add icon" />

                <div className={Style.playerData}>
                    <p className={Style.nameRealm}>
                        {guessChar?.charName} - {guessChar?.realmName}
                    </p>
                </div>

                <span className={Style.serverName}>
                    <ServerFlag region={region} className={Style.serverFlag} />
                </span>
            </li>
        );

    return (
        <li onClick={handleClick} className={Style.dropdownItem}>
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

            <span className={Style.serverName}>
                <ServerFlag region={region} className={Style.serverFlag} />
            </span>
        </li>
    );
}
