import { useEffect, useState } from "react"
import exctractSearch from "../../../helpers/extractSearch.js";

export default function DropDown({inputString}) {
    const [searchData, setSearchData] = useState(inputString);

    useEffect(() => {
        const checker = inputString;

        const handler = setTimeout(() => {
            if (checker === inputString && inputString !== "") {
                console.log(exctractSearch(inputString));
            }
        }, 400);

        return () => clearTimeout(handler); 
    }, [inputString]);


    if (inputString === "") return null
    if (inputString === undefined) return null;
    if (!(Array.isArray(inputString))) return null;
    if (searchData) {

        return (<>
            have data
        </>)

    }
}