import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../hooks/ContextVariables";
import { CharacterContext } from "../../pages/CharDetails";
import Style from "../../Styles/modular/charDetails.module.css";
import { useNavigate } from "react-router-dom";
import { DetailsProvider } from "./Details";
import { publicAssetUrl } from "../../helpers/assets.js";

export default function UserDataContainer({contextWindow = undefined}) {
    const navigate = useNavigate();
    const { user, httpFetch } = useContext(UserContext);
    const characterWindow = useContext(CharacterContext);
    const detailsWindow = useContext(DetailsProvider);
    const { data, location } = contextWindow ?? characterWindow ?? {};
    const { posts = [], commentsRef } = contextWindow ?? detailsWindow ?? {};
    const [isLiked, setIsLiked] = useState();
    const [likesCount, setLikesCount] = useState();
    const [viewCount, setViewCount] = useState(data?.checkedCount);
    const [commentsCount, setCMCount] = useState(posts?.length);

    useEffect(() => {
        const errorHandleForComs = () => {
            if (!commentsCount)
                setCMCount((now) => {
                    return 0;
                });
        };

        errorHandleForComs();
    }, [commentsCount]);

    useEffect(() => {
        if (user?._id && data?.likes) setIsLiked((data?.likes).includes(user?._id));

        if (data?.likes) setLikesCount(data.likes.length);
    }, []);

    useEffect(() => {
        setCMCount(posts.length);
    }, [posts]);

    const likeHandler = async (e) => {
        e.preventDefault();
        if (!data?._id) return;

        const likeURL = `/like/${data._id}`;
        const req = await httpFetch(likeURL);

        if (req.status == 401) return navigate(`/login?target=${location}`);
        setIsLiked(req.data?.isLiked);
        setLikesCount(req.data.likesCount);
    };

    const commentsSectionClickHandler = (e) => {
        e.preventDefault();
        commentsRef?.headSection?.scrollIntoView({ behavior: "smooth" });
    };

    return (
            <div className={Style["banner"]}>
                <img
                    style={{
                        cursor: "pointer",
                        transition: "transform 0.2s ease",
                    }}
                    onClick={async (e) => await likeHandler(e)}
                    src={publicAssetUrl(
                        `user_action_icons/${isLiked ? "Liked" : "Like"}.png`,
                    )}
                    alt="Like/d icon"
                />
                <div className={Style["banner-content"]}>
                    <strong>{likesCount ? likesCount : 0} Likes</strong>
                    <span>
                        {isLiked ? "You Liked this Character" : "Give a like hit the thumbup"}
                    </span>
                </div>

                <img
                    style={{
                        cursor: "pointer",
                    }}
                    onClick={commentsSectionClickHandler}
                    src={publicAssetUrl("user_action_icons/Comments.png")}
                    alt="Comments count icon (on click go to comments)"
                />
                <div
                    style={{
                        cursor: "pointer",
                    }}
                    onClick={commentsSectionClickHandler}
                    className={Style["banner-content"]}>
                    <strong>
                        {commentsCount} {commentsCount == 1 ? "Comment" : "Comments"}
                    </strong>
                </div>

                <img
                    src={publicAssetUrl("user_action_icons/View_Count.png")}
                    alt="Views count icon"
                />
                <div className={Style["banner-content"]}>
                    <strong>{viewCount} Views</strong>
                </div>
            </div>
    );
}
