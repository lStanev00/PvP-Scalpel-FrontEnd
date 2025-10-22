import { useContext } from "react";
import PostTemplate from "./PostTemplate";
import { DetailsProvider } from "./Details";
import Style from "../../Styles/modular/CommentsSection.module.css";

export default function CommentsSection() {
    const { optimisticPosts, commentsRef } = useContext(DetailsProvider);

    if (!optimisticPosts) return null;

    return (
        <section className={Style.commentsContainer}>
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
        </section>
    );
}
