/* eslint-disable react/prop-types */

import { useParams } from "react-router-dom";
import Style from "../../Styles/modular/charDetails.module.css";
import timeAgo, { isOlderThan5Minutes } from "../../helpers/timeAgo.js";
import httpFetch from "../../helpers/httpFetch.js";
import { useCallback, useContext, useEffect, useState } from "react";
import { CharacterContext } from "../../pages/CharDetails.jsx";

export default function ReloadBTN({ isUpdating, setUpdating }) {
    const { server, realm, name } = useParams();
    const { setData, data } = useContext(CharacterContext);

    const [lastUpdatedAt, setLastUpdatedAt] = useState(() => {
        if (!data?.updatedAt) return null;
        return timeAgo(data.updatedAt);
    });

    const [isDataOld, setIsDataOld] = useState(() => {
        if (!data?.updatedAt) return false;
        return isOlderThan5Minutes(data.updatedAt);
    });

    const patchCharacterData = useCallback(async () => {
        const apiEndpoint = `/patchCharacter/${encodeURIComponent(
            server || ""
        )}/${encodeURIComponent(realm || "")}/${encodeURIComponent(name || "")}`;
        setUpdating(true);
        try {
            const request = await httpFetch(apiEndpoint, {
                method: "PATCH",
            });

            if (!request.ok) return;
            const requestData = await request.json();

            if (request.status !== 200) return setData({ errorMSG: requestData.messege });

            setData(requestData);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setUpdating(false);
        }
    }, [name, realm, server, setData, setUpdating]);

    useEffect(() => {
        if (!data?.updatedAt) return;
        setLastUpdatedAt(timeAgo(data.updatedAt));
        setIsDataOld(isOlderThan5Minutes(data.updatedAt));
    }, [data?.updatedAt]);

    useEffect(() => {
        if (!data?.updatedAt) return;
        if (lastUpdatedAt === false) patchCharacterData();
    }, [data?.updatedAt, lastUpdatedAt, patchCharacterData]);

    if (!data?.updatedAt) return null;

    if (isUpdating) {
        return (
            <>
                <span className={Style["last-updated"]}></span>
                <button disabled className={Style["button"]}>
                    Updating now . . .
                </button>
            </>
        );
    }
    
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
