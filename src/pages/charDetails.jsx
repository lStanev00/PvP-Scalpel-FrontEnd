import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom"
import { UserContext } from "../hooks/ContextVariables.jsx";
import { Details } from "../components/checkDetails/Details.jsx";
import delay from "../helpers/delay.js";
import ArmoryItemHover from "../components/checkDetails/ArmoryItemHover.jsx";
import Loading from "../components/loading.jsx";

export const CharacterContext = createContext();


export default function CharDetails() {
    const [data, setData] = useState(null);
    const { server, realm, name } = useParams();
    const {  httpFetch } = useContext(UserContext)
    const location = (useLocation()).pathname;
    const [hoverItem, setHoverItem] = useState(null);
    const [coursorPosition, setCoursorPosition] = useState({x : 0, y : 0});



    const getCharacterData = async () => {
        const apiEndpoint = `/checkCharacter/${server}/${realm}/${name}`;
        let response = await httpFetch(apiEndpoint);
        try {

            let fetchData = response.data;
            if (!response.ok) return setData(undefined);

            if (response.status == 404) return setData(undefined);
            if (fetchData === null || !fetchData || !response?.data) {
                await delay(1500);
                response = await httpFetch(apiEndpoint);
                fetchData = response.data;
                
            }
            setData(undefined)
            setData(fetchData);
        } catch (error) {
            console.error("Fetch error:", error);
            setData(undefined);
        }
    };
    
    useEffect(() => {getCharacterData()}, []);

if (data === null) return (<Loading />)
if (data === undefined) return (<>Character not found.</>)
if (data?.errorMSG) return (<><h2>Error:</h2><p>{data.errorMSG}</p></>)


    if (data.rating) return (
    <CharacterContext.Provider value={{data, setData, location, hoverItem, setHoverItem, coursorPosition, setCoursorPosition}}>


        {data.rating && (
            <>
                <Details />
                <ArmoryItemHover />
            </>
        )}

    </CharacterContext.Provider>
)

}


