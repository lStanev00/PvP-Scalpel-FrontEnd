import { useContext, useEffect, useState } from "react"
import exctractSearch from "../../../helpers/extractSearch.js";
import { UserContext } from "../../../hooks/ContextVariables.jsx";
import DropDownItem from "./DropDownItem.jsx";
import Style from "../../../Styles/modular/DropDownSearch.module.css"
import Loading from "../../loading.jsx";

export default function DropDown({inputString, inputRef, visible}) {
    const [searchData, setSearchData] = useState(inputString);
    const { httpFetch } = useContext(UserContext);

    useEffect(() => {
        if (inputString !== "" && inputString.length > 2) setSearchData("!!!LOADING!!!");
        const checker = inputString;
        const handler = setTimeout(async () => {
            if (checker === inputString && inputString !== "") {
                const searchString = (exctractSearch(inputString));
                const req = await httpFetch(`/searchCharacter?search=${searchString}`)
                console.log(req)
                if(req.ok && req.data) {
                    setSearchData(req.data)
                }
            }
        }, 400);

        return () => clearTimeout(handler); 
    }, [inputString]);
    if (searchData === "!!!LOADING!!!") return (
        <ul className={Style.dropdown}><Loading height={199}/></ul>

    )
    if (inputString === "") return null
    if (inputString === undefined) return null;
    if (searchData && inputString !== "" && inputRef?.current?.value !== "" && visible) {

        return (
            <ul className={Style.dropdown}>
                {searchData.chars && (searchData.chars.map(entry => <DropDownItem key={entry.char._id} entry={entry} Style={Style} inputRef={inputRef}/>))}
            </ul>
        )

    }
}