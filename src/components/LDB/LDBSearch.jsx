import { useEffect, useState, useRef } from "react";
import Suggestions from "./SuggestionsLi";
import buttonNav from "../../helpers/buttonNav";
import { FaSearch, FaTimes } from "react-icons/fa";
import Style from "../../Styles/modular/LDBSearch.module.css";

export default function LDBSearch({ data, setPage, refs }) {
    const [suggestions, setSuggestions] = useState(`nan`);
    const [currentLiIndex, setIndex] = useState(Number);
    const liRef = useRef([]);
    const inputChecker = async (event) => {
        const input = event.target.value;
        const result = [];

        if (input == "") return setSuggestions(undefined);
        if (data) {
            for (const page of data) {
                page.filter((char) => {
                    if (char.name.toLowerCase().includes(input.toLowerCase())) {
                        result.push(char);
                    }
                });
            }
            setSuggestions(result);
        }
    };
    const clear = (e) => {
        setSuggestions(undefined);
    };

    useEffect(() => {
        if (suggestions === `nan`) document.getElementById(`searchInput`).value = ``;
    }, [suggestions]);
    return (
        <div className={Style.searchContainer}>
            <div className={Style.inputWrapper}>
                <FaSearch className={Style.searchIcon} />
                <input
                    onKeyDown={(e) => buttonNav(e, liRef, setIndex, currentLiIndex)}
                    autoComplete="off"
                    autoCorrect="off"
                    onInput={inputChecker}
                    type="text"
                    id="searchInput"
                    className={Style.searchInput}
                    placeholder="Search for a character..."
                />
            </div>

            <button onClick={clear} id="searchBtn" className={Style.searchBtn}>
                <FaTimes className={Style.clearIcon} />
                <span>Clear</span>
            </button>

            <Suggestions
                setIndex={setIndex}
                currentLiIndex={currentLiIndex}
                suggestions={suggestions}
                setPage={setPage}
                data={data}
                refs={refs}
                setSuggestions={setSuggestions}
                liRef={liRef}
            />
        </div>
    );
}
