import { useContext, useEffect, useState } from "react"
import exctractSearch from "../../../helpers/extractSearch.js";
import { UserContext } from "../../../hooks/ContextVariables.jsx";
import DropDownItem from "./DropDownItem.jsx";
import Style from "../../../Styles/modular/DropDownSearch.module.css"
import Loading from "../../loading.jsx";
import fromResultFromSearch from "../../../helpers/fromResultFromSearch.js";

export default function DropDown({inputString, visible}) {
    const [searchData, setSearchData] = useState(inputString);
    const { httpFetch, inputRef } = useContext(UserContext);

    useEffect(() => {
        if (inputString !== "" && inputString.length > 2) setSearchData("!!!LOADING!!!");
        const checker = inputString;
        const handler = setTimeout(async () => {
            if (checker === inputString && inputString !== "") {
                const searchString = (exctractSearch(inputString));
                const req = await httpFetch(`/searchCharacter?search=${searchString}`)
                console.log(req?.data)
                if(req.ok && req.data) {
                    setSearchData(fromResultFromSearch(req))
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
                {
                    searchData.addChars 
                    && Array.isArray(searchData.addChars)
                    && (
                        searchData.addChars.map((entry, index) => <DropDownItem key={`${index}:${entry?.charName}:${entry?.realmSlug}`} Style={Style} guessChar={entry}/>)
                    )
                }
                {
                    searchData.exactMatch
                    && Array.isArray(searchData.exactMatch)
                    && (
                        searchData.exactMatch.map(entry => <DropDownItem key={entry.char._id} entry={entry} Style={Style}/>) 
                    )
                }
                {
                searchData.chars 
                && (
                    searchData.chars.map(entry => <DropDownItem key={entry.char._id} entry={entry} Style={Style}/>)
                )
                }
            </ul>
        )

    }
}