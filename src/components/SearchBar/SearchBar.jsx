import { useState } from "react";
import Style from "../../Styles/modular/SearchBar.module.css";

export default function SearchBar({ onSearch }) {
    const [query, setQuery] = useState("");

    const handleChange = (e) => {
        setQuery(e.target.value);
        onSearch?.(e.target.value);
    };

    return (
        <div className={Style.searchBar}>
            <img src="/magnifierLupe.png" alt="" width={25}/>
            <input
                type="text"
                placeholder="Search characters..."
                value={query}
                onChange={handleChange}
                className={Style.input}
            /> 
            
        </div>
    );
}
