import { useContext, useEffect, useState } from "react"
import exctractSearch from "../../../helpers/extractSearch.js";
import { UserContext } from "../../../hooks/ContextVariables.jsx";
import DropDownItem from "./DropDownItem.jsx";
import Style from "../../../Styles/modular/DropDownSearch.module.css"
import Loading from "../../loading.jsx";
import fromResultFromSearch from "../../../helpers/fromResultFromSearch.js";

function getServerPriority(entry) {
    const normalizedEntry = Array.isArray(entry) ? entry[0] : entry;
    const server = (
        normalizedEntry?.server
        || normalizedEntry?.char?.server
        || normalizedEntry?.char?.playerRealm?.server
        || ""
    ).toLowerCase();

    if (server === "eu") return 0;
    if (server === "us") return 1;
    return 2;
}

function sortByServerPriority(entries) {
    if (!Array.isArray(entries)) return entries;

    return [...entries].sort((a, b) => getServerPriority(a) - getServerPriority(b));
}

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
        const sortedAddChars = sortByServerPriority(searchData?.addChars);
        const sortedExactMatch = sortByServerPriority(searchData?.exactMatch);
        const sortedChars = sortByServerPriority(searchData?.chars);

        return (
            <ul className={Style.dropdown}>
                {
                    sortedAddChars
                    && Array.isArray(sortedAddChars)
                    && (
                        sortedAddChars.map((entry, index) => <DropDownItem key={`${index}:${entry?.charName}:${entry?.realmSlug}`} Style={Style} guessChar={entry}/>)
                    )
                }
                {
                    sortedExactMatch
                    && Array.isArray(sortedExactMatch)
                    && (
                        sortedExactMatch
                            .filter(Boolean)
                            .map((entry, index) => {
                                const key = entry?.char?._id ?? entry?._id ?? `${index}:${entry?.charName ?? "unknown"}`;
                                return <DropDownItem key={key} entry={entry} Style={Style}/>
                            })
                    )
                }
                {
                sortedChars
                && (
                    sortedChars.map(entry => <DropDownItem key={entry.char._id} entry={entry} Style={Style}/>)
                )
                }
            </ul>
        )

    }
}
