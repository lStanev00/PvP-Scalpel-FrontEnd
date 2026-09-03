import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../hooks/ContextVariables";
import { CharacterContext } from "../../pages/CharDetails";
import Style from "../../Styles/modular/UserDataContainer.module.css";
import { useNavigate } from "react-router-dom";
import { publicAssetUrl } from "../../helpers/assets.js";
import { CommentsContext } from "./CommentsContext.js";

const compactCount = new Intl.NumberFormat(undefined, {
    notation: "compact",
    maximumFractionDigits: 1,
});

function normalizeCount(value) {
    const count = Number(value);
    return Number.isFinite(count) && count >= 0 ? count : 0;
}

export default function UserDataContainer({ contextWindow = undefined }) {
    const navigate = useNavigate();
    const { user, httpFetch } = useContext(UserContext);
    const characterWindow = useContext(CharacterContext);
    const commentsWindow = useContext(CommentsContext);
    const { data, location } = contextWindow ?? characterWindow ?? {};
    const { posts = [], commentsRef } = commentsWindow ?? contextWindow ?? {};
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [isLikePending, setIsLikePending] = useState(false);
    const commentsCount = posts.length;
    const viewCount = normalizeCount(data?.checkedCount ?? data?.views);

    useEffect(() => {
        const likes = Array.isArray(data?.likes) ? data.likes : [];
        setIsLiked(Boolean(user?._id && likes.includes(user._id)));
        setLikesCount(likes.length);
    }, [data?.likes, user?._id]);

    const likeHandler = async (e) => {
        e.preventDefault();
        if (!data?._id || isLikePending) return;

        setIsLikePending(true);
        try {
            const req = await httpFetch(`/like/${data._id}`);

            if (req?.status === 401) {
                return navigate(`/login?target=${encodeURIComponent(location || "/")}`);
            }
            if (typeof req?.data?.isLiked === "boolean") setIsLiked(req.data.isLiked);
            if (req?.data?.likesCount != null) {
                setLikesCount(normalizeCount(req.data.likesCount));
            }
        } catch (error) {
            console.warn("Like request failed:", error);
        } finally {
            setIsLikePending(false);
        }
    };

    const commentsSectionClickHandler = (e) => {
        e.preventDefault();
        commentsRef?.current?.headSection?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section className={Style.rail} aria-label="Entry engagement">
            <button
                type="button"
                className={`${Style.segment} ${Style.action} ${isLiked ? Style.active : ""}`}
                onClick={likeHandler}
                aria-pressed={isLiked}
                aria-label={`${isLiked ? "Remove like" : "Like this entry"}. ${likesCount} ${
                    likesCount === 1 ? "like" : "likes"
                }`}
                disabled={isLikePending || !data?._id}
            >
                <img
                    className={Style.icon}
                    src={publicAssetUrl(
                        `user_action_icons/${isLiked ? "Liked" : "Like"}.png`,
                    )}
                    alt=""
                />
                <span className={Style.metric}>
                    <strong aria-live="polite">{compactCount.format(likesCount)}</strong>
                    <span>{likesCount === 1 ? "Like" : "Likes"}</span>
                </span>
            </button>

            <button
                type="button"
                className={`${Style.segment} ${Style.action}`}
                onClick={commentsSectionClickHandler}
                aria-label={`Go to ${commentsCount} ${
                    commentsCount === 1 ? "comment" : "comments"
                }`}
            >
                <img
                    className={Style.icon}
                    src={publicAssetUrl("user_action_icons/Comments.png")}
                    alt=""
                />
                <span className={Style.metric}>
                    <strong>{compactCount.format(commentsCount)}</strong>
                    <span>{commentsCount === 1 ? "Comment" : "Comments"}</span>
                </span>
            </button>

            <div className={Style.segment} aria-label={`${viewCount} views`}>
                <img
                    className={Style.icon}
                    src={publicAssetUrl("user_action_icons/View_Count.png")}
                    alt=""
                />
                <span className={Style.metric}>
                    <strong>{compactCount.format(viewCount)}</strong>
                    <span>{viewCount === 1 ? "View" : "Views"}</span>
                </span>
            </div>
        </section>
    );
}
