import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../hooks/ContextVariables";
import { CharacterContext } from "../../pages/CharDetails";
import Style from '../../Styles/modular/charDetails.module.css';
import { useNavigate } from "react-router-dom";


export default function UserDataContainer() {
    const navigate = useNavigate();
    const { user, httpFetch} = useContext(UserContext);
    const {data, location} = useContext(CharacterContext);
    const [ isLiked, setIsLiked ] = useState();

    useEffect(() => {   if (user?._id) setIsLiked((data?.likes).includes(user._id))   }, [])

    const likeHandler = async (e) => {
        e.preventDefault();
        const likeURL = `/like/${data._id}`
        const req = await httpFetch(likeURL);

        console.log(req.status);
        if(req.status == 401) return navigate(`/login?target=${location}`)
        setIsLiked(req.data?.isLiked);
    }

    return (<>
    <div className={Style["banner"]}>

            <img
            onClick={async (e) => await likeHandler(e)}
            src= {`/user_action_icons/${isLiked ? "Liked" : "Like" }.png`} 
            alt="Character Avatar"
            />
            <div className={Style["banner-content"]}>
                <strong>{data.name} - {data.playerRealm.name}</strong>
                <span>{data.race} | Level {data.level} | {data.class.name} ({data.activeSpec.name})</span>
            </div>
            
            {/* <img src= "/user_action_icons/Like.png" alt="Character Avatar" />
            <div className={Style["banner-content"]}>
                <strong>{data.name} - {data.playerRealm.name}</strong>
                <span>{data.race} | Level {data.level} | {data.class.name} ({data.activeSpec.name})</span>
            </div> */}
            {/* <ReloadBTN setData={setData} data={data} isUpdating={isUpdating} setUpdating={setUpdating} /> */}

    </div>
    
    </>)
}