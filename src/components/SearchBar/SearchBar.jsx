import { useState } from "react";
import Style from "../../Styles/modular/SearchBar.module.css";
import DropDown from "./components/DropDown";

export default function SearchBar({ onSearch }) {
    const [query, setQuery] = useState("");

    const handleChange = (e) => {
        setQuery(e.target.value);
        onSearch?.(e.target.value);
    };

    const handleDivClick = (e, isChild = false) => {
        e.preventDefault();
        const target = isChild ? e.target.parentNode : e.target;

        const inputEl = target.querySelector("input");
        if ( inputEl === null ) return
        return inputEl.focus();
    }
    return (
        <div onClick={(e) => {handleDivClick(e)}} className={Style.searchBar}>
            <img src="/magnifierLupe.png" alt="" width={40} onClick={(e) => {handleDivClick(e, true)}}/>
            <input
                id="characterSearch"
                type="text"
                placeholder="Search characters... (Name - Realm - Server)"
                value={query}
                onChange={handleChange}
                className={Style.input}
            /> 
            <DropDown inputString={query} />
        </div>
    );
}
