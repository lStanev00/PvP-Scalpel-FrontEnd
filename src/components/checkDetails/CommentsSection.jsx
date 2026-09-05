/* eslint-disable react/prop-types -- Optional Watch empty-state presentation. */
import { FiMessageSquare } from "react-icons/fi";
import PostTemplate from "./PostTemplate";
import Style from "../../Styles/modular/CommentsSection.module.css";
import { useComments } from "./CommentsContext.js";

export default function CommentsSection({ variant = "default" }) {
    const { optimisticPosts, commentsRef } = useComments();

    if (!optimisticPosts) return null;

    return (
        <div className={Style.commentsContainer}>
            {optimisticPosts.length === 0 ? (
                <p className={`${Style.emptyState} ${variant === "watch" ? Style.watchEmpty : ""}`}>
                    {variant === "watch" ? (
                        <>
                            <FiMessageSquare aria-hidden="true" />
                            <span>No comments yet. Be the first to share your thoughts.</span>
                        </>
                    ) : "No comments yet! Be the first to share your thoughts."}
                </p>
            ) : (
                optimisticPosts.map((post) => (
                    <PostTemplate
                        key={post._id}
                        postValue={post}
                        optimistic={Boolean(post.isOptimistic)}
                        innerRef={(el) => {
                            if (commentsRef?.current) {
                                commentsRef.current[post._id] = el;
                            }
                        }}
                    />
                ))
            )}
        </div>
    );
}
