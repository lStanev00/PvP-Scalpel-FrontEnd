import { useContext, useState } from "react";
import { UserContext } from "../../hooks/ContextVariables";
import { CharacterContext } from "../../pages/CharDetails";
import Style from '../../Styles/modular/charDetails.module.css';


export default function UserDataContainer() {
    const { user, httpFetch} = useContext(UserContext);
    const {data} = useContext(CharacterContext);
    const [ isLiked, setIsLiked ] = useState((data.likes).includes(user._id));

    const likeHandler = async (e) => {
        e.preventDefault();
        const likeURL = `/like/${data._id}`
        console.log((data.likes).includes(user._id))
        const req = await httpFetch(likeURL);

        console.log(req.data)
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
            
            <img src= "/user_action_icons/Like.png" alt="Character Avatar" />
            <div className={Style["banner-content"]}>
                <strong>{data.name} - {data.playerRealm.name}</strong>
                <span>{data.race} | Level {data.level} | {data.class.name} ({data.activeSpec.name})</span>
            </div>
            {/* <ReloadBTN setData={setData} data={data} isUpdating={isUpdating} setUpdating={setUpdating} /> */}

    </div>
    
    </>)
}