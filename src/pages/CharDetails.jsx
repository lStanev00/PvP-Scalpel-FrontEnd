import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { UserContext } from "../hooks/ContextVariables.jsx";
import { Details } from "../components/checkDetails/Details.jsx";
import delay from "../helpers/delay.js";
import Loading from "../components/loading.jsx";
import SEOChars from "../SEO/SEOChars.jsx";
import CharacterNotFound from "./CharacterNotFound.jsx";

export const CharacterContext = createContext();

export default function CharDetails() {
    const [data, setData] = useState(null);
    const [lastStatus, setLastStatus] = useState(null);
    const { server, realm, name } = useParams();
    const { httpFetch, inputRef } = useContext(UserContext);
    const location = useLocation().pathname;

    const getCharacterData = useCallback(async () => {
        try {
            const apiEndpoint = `/checkCharacter/${encodeURIComponent(
                server || ""
            )}/${encodeURIComponent(realm || "")}/${encodeURIComponent(name || "")}`;

            let response = await httpFetch(apiEndpoint);
            setLastStatus(response?.status ?? 0);
            let fetchData = response?.data;

            if (response?.ok && !fetchData) {
                await delay(1500);
                response = await httpFetch(apiEndpoint);
                setLastStatus(response?.status ?? 0);
                fetchData = response?.data;
            }

            if (!response?.ok || !fetchData || fetchData?.errorMSG) {
                if (fetchData?.errorMSG) setLastStatus(404);
                setData(undefined);
                return;
            }

            setLastStatus(200);
            setData(fetchData);
        } catch (error) {
            console.error("Fetch error:", error);
            setLastStatus(0);
            setData(undefined);
        }
    }, [httpFetch, name, realm, server]);
    useEffect(() => {
        if (inputRef?.current) inputRef.current.value = "";
        setLastStatus(null);
        setData(null);
        getCharacterData();
    }, [getCharacterData, inputRef, name, realm, server]);

    if (data === null) return <Loading />;
    if (data === undefined && lastStatus === 404) return <CharacterNotFound />;
    if (data === undefined) return <>Character not found.</>;
    if (data?.errorMSG)
        return (
            <>
                <h2>Error:</h2>
                <p>{data.errorMSG}</p>
            </>
        );

    if (!data?.rating) {
        return (
            <>
                <SEOChars char={data} />
                <p>Character data is missing PvP rating.</p>
            </>
        );
    }

    return (
        <>
            <SEOChars char={data} />
            <CharacterContext.Provider value={{ data, setData, location }}>
                <Details />
            </CharacterContext.Provider>
        </>
    );
}
