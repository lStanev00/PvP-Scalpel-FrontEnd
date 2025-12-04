import { useContext, useEffect, useRef, useState } from "react";
import Style from "../../Styles/modular/SearchBar.module.css";
import DropDown from "./components/DropDown";
import { UserContext } from "../../hooks/ContextVariables";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";

export default function SearchBar({ onSearch }) {
    const [query, setQuery] = useState("");
    const searchBarEl = useRef();
    const [visible, setVisible] = useState(true);
    const {inputRef} = useContext(UserContext);

    const handleChange = (e) => {
        setVisible(true)
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

    useEffect(() => {
        const clickListener = (e) => {
            
            const closestElement = e.target.closest('#searchBar');

            setVisible(!closestElement ? false : true)
        }
        document.addEventListener("click", clickListener);
        return () => document.removeEventListener("click", clickListener);
    }, [])
    return (
        <div 
            onClick={(e) => {handleDivClick(e)}} 
            className={Style.searchBar}
            ref={(el) => searchBarEl.current = el}
            id="searchBar"
        >
            {/* <img src="/magnifierLupe.png" alt="" width={40} onClick={(e) => {handleDivClick(e, true)}}/> */}
            <HiOutlineMagnifyingGlass width={40} onClick={(e) => {handleDivClick(e, true)}}/>
            <input
                ref = {(el) =>  inputRef.current = el}
                id="characterSearch"
                type="text"
                placeholder="Search characters... (Name - Realm - Server)"
                value={query}
                onChange={handleChange}
                className={Style.input}
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"

            /> 
            <DropDown inputString={query} visible={visible}/>
        </div>
    );
}
