import { useState } from "react";
import Style from "./SearchBox.module.css";

export default function SearchBox({ setQuery }) {
    const [input, setInput] = useState("");

    const onChange = (e) => {
        setInput(e.target.value);
        setQuery(e.target.value);
    };

    const clearSearch = () => {
        setInput("");
        setQuery("");
    };

    return (
        <div className={Style.container}>
            <input
                type="text"
                placeholder="Search for a character..."
                className={Style.input}
                value={input}
                onChange={onChange}
                autoComplete="off"
            />
            <button onClick={clearSearch} className={Style.btn}>Clear</button>
        </div>
    );
}
