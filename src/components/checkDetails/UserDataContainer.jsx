import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../hooks/ContextVariables";
import { CharacterContext } from "../../pages/CharDetails";
import Style from "../../Styles/modular/charDetails.module.css";
import { useNavigate } from "react-router-dom";
import { DetailsProvider } from "./Details";

export default function UserDataContainer() {
    const navigate = useNavigate();
    const { user, httpFetch } = useContext(UserContext);
    const { data, location } = useContext(CharacterContext);
    const [isLiked, setIsLiked] = useState();
    const [likesCount, setLikesCount] = useState();
    const [viewCount, setViewCount] = useState(data?.checkedCount);
    const { posts, commentsRef } = useContext(DetailsProvider);
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
        const likeURL = `/like/${data._id}`;
        const req = await httpFetch(likeURL);

        if (req.status == 401) return navigate(`/login?target=${location}`);
        setIsLiked(req.data?.isLiked);
        setLikesCount(req.data.likesCount);
    };

    const commentsSectionClickHandler = (e) => {
        e.preventDefault();

        const commentsSection = commentsRef.headSection;
        return commentsSection.scrollIntoView({ behavior: "smooth" });
    };

    return (
            <div className={Style["banner"]}>
                <img
                    style={{
                        cursor: "pointer",
                        transition: "transform 0.2s ease",
                    }}
                    onClick={async (e) => await likeHandler(e)}
                    src={`/user_action_icons/${isLiked ? "Liked" : "Like"}.png`}
                    alt="Character Avatar"
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
                    src="/user_action_icons/Comments.png"
                    alt="Character Avatar"
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

                <img src="/user_action_icons/View_Count.png" alt="Character Avatar" />
                <div className={Style["banner-content"]}>
                    <strong>{viewCount} Views</strong>
                </div>
            </div>
    );
}
