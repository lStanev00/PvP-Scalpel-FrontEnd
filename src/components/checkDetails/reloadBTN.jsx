import { useParams } from "react-router-dom"
import Style from '../../Styles/modular/charDetails.module.css';
import timeAgo, { isOlderThan5Minutes } from "../../helpers/timeAgo.js";
import httpFetch from "../../helpers/httpFetch.js";
import { useContext, useEffect, useState } from "react";
import { CharacterContext } from "../../pages/CharDetails.jsx";
export default function ReloadBTN({isUpdating, setUpdating}) {
    const { server, realm, name } = useParams();
    const {setData, data} = useContext(CharacterContext);

    const patchCharacterData = async () => {
        const apiEndpoint = `/patchCharacter/${server}/${realm}/${name}`;
        setUpdating(state => {return true}); // No waiting set
        try {
            const request = await httpFetch(apiEndpoint, {
                method: "PATCH"
            });

            if (!request.ok) return;
            const requestData = await request.json();

            if (request.status !== 200) return setData({errorMSG : requestData.messege});

            setData(requestData);
            setUpdating(false)
        } catch (error) {
            console.error("Fetch error:", error);
        }
    }

    if (!data || !data.updatedAt) return null;

    if (isUpdating) {
        return (
            <>
                <span className={Style["last-updated"]}></span>
                <button disabled className={Style["button"]}>Updating now . . .</button>
            </>
        )
    }

    const [ lastUpdatedAt, setLastUpdatedAt ] = useState(timeAgo( data.updatedAt ));
    const [ isDataOld, setIsDataOld ] = useState ( isOlderThan5Minutes( data.updatedAt ) );
    
    useEffect(() => {
        const updateDataIfNeeded = async () => {
            if (lastUpdatedAt === false) {
                await patchCharacterData();
            }
        };
    
        updateDataIfNeeded();
    }, [ lastUpdatedAt ]);

    useEffect(() => {
        setLastUpdatedAt(timeAgo( data.updatedAt ))
    }, [ data ])
    
    return (<>
        <span 
            className={
                Style["last-updated"]
            }

        >
                Last updated: {lastUpdatedAt}
            </span>
        <button 

            disabled={!isDataOld}
            
            title={isDataOld 
                ?  'Click to update'
                : 'Data is already fresh'
            }

            onClick={async () => {
                await patchCharacterData()}
            }

        className={Style["button"]}>{
            data.nowUpdating ?  "Updating now!" : "Update Now"
        }


        </button>
    </>)

}
