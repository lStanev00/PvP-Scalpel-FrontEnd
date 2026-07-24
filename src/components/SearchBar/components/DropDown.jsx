/* eslint-disable react/prop-types */

import { useContext } from "react"
import { UserContext } from "../../../hooks/ContextVariables.jsx";
import DropDownItem from "./DropDownItem.jsx";
import Style from "../../../Styles/modular/DropDownSearch.module.css"
import Loading from "../../loading.jsx";
import { useCharacterSearch } from "../../../hooks/useCharacterSearch.js";

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

export default function DropDown({inputString, visible}) {
    const { inputRef } = useContext(UserContext);
    const {
        status,
        parsedInput,
        shouldSearch,
        addChars,
        exactMatch,
        chars,
    } = useCharacterSearch(inputString);

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

    if (status === "loading" && shouldSearch) return (
        <ul className={Style.dropdown}><Loading height={199}/></ul>

    )

    const hasResults = hasRenderableItems({
        addChars,
        exactMatch,
        chars,
    });

    if (status === "ready" && !hasResults && !parsedInput.hasRealm) {
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

    if (status === "ready" && inputRef?.current?.value !== "" && (hasResults || parsedInput.hasRealm)) {
        return (
            <ul className={Style.dropdown}>
                {
                    addChars
                    && Array.isArray(addChars)
                    && (
                        addChars.map((entry, index) => <DropDownItem key={`${index}:${entry?.charName}:${entry?.realmSlug}`} Style={Style} guessChar={entry}/>)
                    )
                }
                {
                    exactMatch
                    && Array.isArray(exactMatch)
                    && (
                        exactMatch
                            .filter(Boolean)
                            .map((entry, index) => {
                                const key = entry?.char?._id ?? entry?._id ?? `${index}:${entry?.charName ?? "unknown"}`;
                                return <DropDownItem key={key} entry={entry} Style={Style}/>
                            })
                    )
                }
                {
                chars
                && (
                    chars.map(entry => <DropDownItem key={entry.char._id} entry={entry} Style={Style}/>)
                )
                }
            </ul>
        )

    }

    return null;
}
