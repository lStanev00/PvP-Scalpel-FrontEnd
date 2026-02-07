import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { UserContext } from "../hooks/ContextVariables.jsx";
import { Details } from "../components/checkDetails/Details.jsx";
import delay from "../helpers/delay.js";
import Loading from "../components/loading.jsx";
import SEOChars from "../SEO/SEOChars.jsx";

export const CharacterContext = createContext();

export default function CharDetails() {
    const [data, setData] = useState(null);
    const { server, realm, name } = useParams();
    const { httpFetch, inputRef } = useContext(UserContext);
    const location = useLocation().pathname;

    const getCharacterData = async () => {
        try {
            const apiEndpoint = `/checkCharacter/${encodeURIComponent(
                server || ""
            )}/${encodeURIComponent(realm || "")}/${encodeURIComponent(name || "")}`;

            let response = await httpFetch(apiEndpoint);
            let fetchData = response?.data;

            if (response?.ok && !fetchData) {
                await delay(1500);
                response = await httpFetch(apiEndpoint);
                fetchData = response?.data;
            }

            if (!response?.ok || !fetchData || fetchData?.errorMSG) {
                setData(undefined);
                return;
            }

            setData(fetchData);
        } catch (error) {
            console.error("Fetch error:", error);
            setData(undefined);
        }
    };
    useEffect(() => {
        if (inputRef?.current) inputRef.current.value = "";
        setData(null);
        getCharacterData();
    }, [server, realm, name]);

    if (data === null) return <Loading />;
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
