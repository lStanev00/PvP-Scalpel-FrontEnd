import { useParams } from "react-router-dom"
import Style from '../../Styles/modular/charDetails.module.css';
import timeAgo from "../../helpers/timeAgo.js";
import httpFetch from "../../helpers/httpFetch.js";
export default function ReloadBTN({setData, data, isUpdating, setUpdating}) {
    const { server, realm, name } = useParams();

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
    return (<>
        <span className={Style["last-updated"]}>Last updated: {timeAgo(data.updatedAt)}</span>
        <button onClick={async () => {await patchCharacterData()}} className={Style["button"]}>{data.nowUpdating ?  "Updating now!" : "Update Now"}</button>
    </>)

}
