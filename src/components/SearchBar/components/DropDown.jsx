import { useContext, useEffect, useState } from "react"
import exctractSearch from "../../../helpers/extractSearch.js";
import { UserContext } from "../../../hooks/ContextVariables.jsx";
import DropDownItem from "./DropDownItem.jsx";
import Style from "../../../Styles/modular/DropDownSearch.module.css"

export default function DropDown({inputString}) {
    const [searchData, setSearchData] = useState(inputString);
    const { httpFetch } = useContext(UserContext);

    useEffect(() => {
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


    if (inputString === "") return null
    if (inputString === undefined) return null;
    // if (!(Array.isArray(inputString))) return null;
    if (searchData) {

        return (
            <ul className={Style.dropdown}>
                {searchData.chars && (searchData.chars.map(entry => <DropDownItem key={entry.char._id} entry={entry} Style={Style} />))}
            </ul>
        )

    }
}