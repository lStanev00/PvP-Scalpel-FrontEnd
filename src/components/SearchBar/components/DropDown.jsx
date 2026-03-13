import { useContext, useEffect, useState } from "react"
import exctractSearch from "../../../helpers/extractSearch.js";
import { UserContext } from "../../../hooks/ContextVariables.jsx";
import DropDownItem from "./DropDownItem.jsx";
import Style from "../../../Styles/modular/DropDownSearch.module.css"
import Loading from "../../loading.jsx";
import fromResultFromSearch from "../../../helpers/fromResultFromSearch.js";

function parseSearchInput(inputString) {
    const rawValue = typeof inputString === "string" ? inputString.trim() : "";
    const [rawName = "", rawRealm = ""] = rawValue.split("-");
    const name = rawName.trim();
    const realm = rawRealm.trim();
    const nameLength = name.replaceAll(" ", "").length;

    return {
        hasInput: rawValue.length > 0,
        name,
        realm,
        hasRealm: realm.length > 0,
        nameLength,
        isTooShortName: nameLength > 0 && nameLength < 3,
    };
}

function hasRenderableItems(searchData) {
    return [searchData?.addChars, searchData?.exactMatch, searchData?.chars].some(
        (entries) => Array.isArray(entries) && entries.length > 0,
    );
}

function InfoPanel({ title, children }) {
    return (
        <div className={`${Style.dropdown} ${Style.dropdownInfo}`}>
            <div className={Style.infoCard}>
                <p className={Style.infoTitle}>{title}</p>
                {children}
            </div>
        </div>
    );
}

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
    const [searchState, setSearchState] = useState({ status: "idle", data: null });
    const { httpFetch, inputRef } = useContext(UserContext);
    const parsedInput = parseSearchInput(inputString);
    const shouldSearch = parsedInput.hasInput && !parsedInput.isTooShortName;

    useEffect(() => {
        if (!parsedInput.hasInput || parsedInput.isTooShortName) {
            setSearchState({ status: "idle", data: null });
            return undefined;
        }

        setSearchState({ status: "loading", data: null });
        const checker = inputString;
        const handler = setTimeout(async () => {
            if (checker === inputString) {
                const searchString = (exctractSearch(inputString));
                if (!searchString) {
                    setSearchState({ status: "idle", data: null });
                    return;
                }

                const req = await httpFetch(`/searchCharacter?search=${searchString}`);
                if(req.ok && req.data) {
                    setSearchState({ status: "ready", data: fromResultFromSearch(req) });
                } else {
                    setSearchState({ status: "ready", data: null });
                }
            }
        }, 400);

        return () => clearTimeout(handler); 
    }, [httpFetch, inputString, parsedInput.hasInput, parsedInput.isTooShortName]);

    if (!visible || inputString === undefined) return null;

    if (!parsedInput.hasInput) {
        return (
            <InfoPanel title="Start tiping">
                <p className={Style.infoText}>
                    Search with this format: <span>Name - Realm - Server</span>
                </p>
                <p className={Style.infoHint}>
                    Example: <span>Jaina - Silvermoon - EU</span>
                </p>
                <p className={Style.infoHint}>
                    Use a dash to split the character name, realm, and server.
                </p>
            </InfoPanel>
        );
    }

    if (parsedInput.isTooShortName && !parsedInput.hasRealm) {
        return (
            <InfoPanel title="Keep typing">
                <p className={Style.infoText}>
                    Enter at least <span>3 letters</span> in the character name before searching.
                </p>
            </InfoPanel>
        );
    }

    if (searchState.status === "loading" && shouldSearch) return (
        <ul className={Style.dropdown}><Loading height={199}/></ul>

    )

    const searchData = searchState.data;
    const sortedAddChars = sortByServerPriority(searchData?.addChars);
    const sortedExactMatch = sortByServerPriority(searchData?.exactMatch);
    const sortedChars = sortByServerPriority(searchData?.chars);
    const hasResults = hasRenderableItems({
        addChars: sortedAddChars,
        exactMatch: sortedExactMatch,
        chars: sortedChars,
    });

    if (searchState.status === "ready" && !hasResults && !parsedInput.hasRealm) {
        return (
            <InfoPanel title="Add a realm">
                <p className={Style.infoText}>
                    No character was found yet. Add the realm after a dash to narrow it down.
                </p>
                <p className={Style.infoHint}>
                    Example: <span>Name - Realm - Server</span>
                </p>
            </InfoPanel>
        );
    }

    if (searchState.status === "ready" && inputRef?.current?.value !== "" && (hasResults || parsedInput.hasRealm)) {
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

    return null;
}
