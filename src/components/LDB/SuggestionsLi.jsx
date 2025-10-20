import hoverEffect from "../../Styles/modular/LDBSearchHoverEffect.module.css";
import { useEffect } from "react";
import buttonNav from "../../helpers/buttonNav";
import { IoMdArrowDropdownCircle } from "react-icons/io";
import { FaUserAlt } from "react-icons/fa";
import Style from "../../Styles/modular/LDBSuggestionsLi.module.css";

export default function Suggestions({
    suggestions,
    setPage,
    data,
    refs,
    setSuggestions,
    liRef,
    currentLiIndex,
    setIndex,
}) {
    if (!suggestions || suggestions.length === 0) return null;
    const scrollToChar = (key) => {
        const element = refs.current[key];
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
            highlight(element);
            return setSuggestions(`nan`);
        } else {
            for (const page of data) {
                try {
                    for (const char of page) {
                        if (char?._id === key) {
                            setPage(() => {
                                return page;
                            });
                            setTimeout(() => {
                                const element = refs.current[key];
                                if (element) {
                                    element.scrollIntoView({
                                        behavior: "smooth",
                                        block: "center",
                                    });
                                    highlight(element);
                                    return setSuggestions(`nan`);
                                }
                            }, 100);
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
    };

    const removeSuggestions = (e) => {
        setSuggestions([]);
        setIndex(() => {
            return -1;
        });
    }; // Cleanup

    useEffect(() => {
        if (currentLiIndex === -1) return;
        if (liRef.current[currentLiIndex]) liRef.current[currentLiIndex].focus();
    }, [currentLiIndex]);

    useEffect(() => {
        document.addEventListener("click", removeSuggestions);

        return () => {
            document.removeEventListener("click", removeSuggestions);
        };
    }, []);
    useEffect(() => {
        // Release the falsy values to the junk collector
        liRef.current = liRef.current.filter(Boolean);
    }, [suggestions]);

    if (!suggestions || suggestions === "nan") return;

    return (
        <ul
            id="suggestions"
            className={Style.suggestionsContainer}
            onKeyDown={(e) => buttonNav(e, liRef, setIndex, currentLiIndex)}
            tabIndex="0">
            <li className={`${Style.suggestionItem} ${Style.infoRow}`} tabIndex={-1}>
                <IoMdArrowDropdownCircle className={Style.infoIcon} />
                Please select from the dropdown
            </li>

            {suggestions.map((player, index) => {
                if (!player._id) return null;

                return (
                    <li
                        key={`${player._id}-${index}`}
                        onClick={() => scrollToChar(player._id)}
                        ref={(el) => (liRef.current[index] = el)}
                        tabIndex={index}
                        className={Style.suggestionItem}>
                        <img
                            alt="Character Avatar"
                            src={player.media?.avatar}
                            className={Style.charAvatar}
                        />
                        <span className={Style.charName}>{player.name}</span>
                        <span className={Style.charRealm}>
                            {player.playerRealm.slug
                                .replace(/-/g, " ")
                                .replace(/\b\w/g, (c) => c.toUpperCase())}
                        </span>
                        <FaUserAlt className={Style.rightIcon} />
                    </li>
                );
            })}
        </ul>
    );
}

// Helper for eye catching highlight
function highlight(element) {
    if (!element) return;
    element.classList.add(hoverEffect["hover-effect"]);

    setTimeout(() => {
        element.classList.remove(hoverEffect["hover-effect"]);
    }, 3000);
}
