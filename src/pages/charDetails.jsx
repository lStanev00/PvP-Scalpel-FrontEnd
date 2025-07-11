import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom"
import { UserContext } from "../hooks/ContextVariables.jsx";
import { Details } from "../components/checkDetails/Details.jsx";
import delay from "../helpers/delay.js";
import ArmoryItemHover from "../components/checkDetails/ArmoryItemHover.jsx";

export const CharacterContext = createContext();


export default function CharDetails() {
    const [data, setData] = useState(undefined);
    const { server, realm, name } = useParams();
    const {  httpFetch } = useContext(UserContext)
    const location = (useLocation()).pathname;
    const [hoverItem, setHoverItem] = useState(null);
    const [coursorPosition, setCoursorPosition] = useState({x : 0, y : 0});



    const getCharacterData = async () => {
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
    <CharacterContext.Provider value={{data, setData, location, hoverItem, setHoverItem, coursorPosition, setCoursorPosition}}>

        <Details />
        <ArmoryItemHover />

    </CharacterContext.Provider>
)

}


