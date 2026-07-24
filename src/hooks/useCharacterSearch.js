import { useContext, useEffect, useMemo, useState } from "react";
import exctractSearch from "../helpers/extractSearch.js";
import fromResultFromSearch from "../helpers/fromResultFromSearch.js";
import { UserContext } from "./ContextVariables.jsx";

export function parseCharacterSearchInput(inputString) {
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
    if (!Array.isArray(entries)) return [];
    return [...entries].filter(Boolean).sort((a, b) => getServerPriority(a) - getServerPriority(b));
}

export function useCharacterSearch(inputString, delay = 400) {
    const [searchState, setSearchState] = useState({ status: "idle", data: null });
    const { httpFetch } = useContext(UserContext);
    const parsedInput = useMemo(
        () => parseCharacterSearchInput(inputString),
        [inputString],
    );

    useEffect(() => {
        if (!parsedInput.hasInput || parsedInput.isTooShortName) {
            setSearchState({ status: "idle", data: null });
            return undefined;
        }

        let active = true;
        setSearchState({ status: "loading", data: null });

        const handler = setTimeout(async () => {
            const searchString = exctractSearch(inputString);
            if (!searchString) {
                if (active) setSearchState({ status: "idle", data: null });
                return;
            }

            const req = await httpFetch(`/searchCharacter?search=${searchString}`);
            if (!active) return;

            if (req.ok && req.data) {
                setSearchState({ status: "ready", data: fromResultFromSearch(req) });
            } else {
                setSearchState({ status: "ready", data: null });
            }
        }, delay);

        return () => {
            active = false;
            clearTimeout(handler);
        };
    }, [
        delay,
        httpFetch,
        inputString,
        parsedInput.hasInput,
        parsedInput.isTooShortName,
    ]);

    const results = useMemo(() => {
        const addChars = sortByServerPriority(searchState.data?.addChars);
        const exactMatch = sortByServerPriority(searchState.data?.exactMatch);
        const chars = sortByServerPriority(searchState.data?.chars);

        return {
            addChars,
            exactMatch,
            chars,
            storedCharacters: [...exactMatch, ...chars].filter((entry) => entry?.char?._id),
        };
    }, [searchState.data]);

    return {
        ...searchState,
        parsedInput,
        shouldSearch: parsedInput.hasInput && !parsedInput.isTooShortName,
        ...results,
    };
}
