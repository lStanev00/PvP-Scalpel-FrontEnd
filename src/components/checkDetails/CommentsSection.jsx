import PostTemplate from "./PostTemplate";
import Style from "../../Styles/modular/CommentsSection.module.css";

export default function CommentsSection({ optimisticPosts, commentsRef }) {
    if (!optimisticPosts) return null;

    return (
        <section className={Style.commentsContainer}>
            <h2 className={Style.sectionTitle}>Comments</h2>

            <div
                ref={(el) => {
                    if (commentsRef) commentsRef.headSection = el;
                }}
                className={Style.commentList}
            >
                {optimisticPosts.length === 0 && (
                    <p className={Style.emptyState}>
                        No comments yet! Be the first to submit one.
                    </p>
                )}

                {optimisticPosts.length > 0 &&
                    Object.entries(optimisticPosts).map(([key, post]) => (
                        <PostTemplate
                            key={post._id}
                            postValue={post}
                            optimistic={Boolean(post.isOptimistic)}
                            innerRef={(el) => {
                                if (commentsRef && commentsRef.current) {
                                    commentsRef.current[post._id] = el;
                                }
                            }}
                        />
                    ))}
            </div>
        </section>
    );
}
