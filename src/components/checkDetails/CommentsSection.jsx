import PostTemplate from "./PostTemplate";
import Style from "../../Styles/modular/CommentsSection.module.css";
import { useComments } from "./CommentsContext.js";

export default function CommentsSection() {
    const { optimisticPosts, commentsRef } = useComments();

    if (!optimisticPosts) return null;

    return (
        <div className={Style.commentsContainer}>
            {optimisticPosts.length === 0 ? (
                <p className={Style.emptyState}>
                    No comments yet! Be the first to share your thoughts.
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
