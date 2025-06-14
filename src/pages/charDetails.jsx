import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom"
import { UserContext } from "../hooks/ContextVariables.jsx";
import { Details } from "../components/checkDetails/Details.jsx";
import delay from "../helpers/delay.js";

export const CharacterContext = createContext();


export default function CharDetails() {
    const [data, setData] = useState(undefined);
    const { server, realm, name } = useParams();
    const {  httpFetch } = useContext(UserContext)
    const location = (useLocation()).pathname;



    const getCharacterData = async () => { // This will be a websocket in the future
        try {
            const apiEndpoint = `/checkCharacter/${server}/${realm}/${name}`;
            let response = await httpFetch(apiEndpoint);

            if (!response.ok) return setData(undefined);
            let fetchData = response.data;

            if (response.status == 404) return setData({errorMSG : fetchData.messege});
            if (fetchData === null || !fetchData || !response?.data) {
                await delay(1500);
                response = await httpFetch(apiEndpoint);
                fetchData = response.data;
                
            }
            setData(fetchData);
        } catch (error) {
            console.error("Fetch error:", error);
            setData(404);
        }
    };
    
    useEffect(() => {getCharacterData()}, []);

    if (data === undefined) return (<>LOADING......</>);

    return (
    <CharacterContext.Provider value={{data, setData, location}}>

        <Details />

    </CharacterContext.Provider>
)

}


