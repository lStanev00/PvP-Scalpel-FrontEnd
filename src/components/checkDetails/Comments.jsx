/* eslint-disable react/prop-types -- Optional presentation variant; context ownership is unchanged. */
import Style from "../../Styles/modular/CommentsMain.module.css";
import CommentsSection from "./CommentsSection";
import NewPostForm from "./NewPostForm";
import { useComments } from "./CommentsContext.js";

export default function Comments({ variant = "default" }) {
    const { commentsRef, optimisticPosts } = useComments();
    const commentsCount = optimisticPosts?.length ?? 0;

    return (
        <section
            className={`${Style.main} ${variant === "watch" ? Style.watch : ""}`}
            aria-labelledby="comments-heading"
            ref={(element) => {
                commentsRef.current.headSection = element;
            }}
        >
            <header className={Style.header}>
                <h2 id="comments-heading">
                    {commentsCount} {commentsCount === 1 ? "Comment" : "Comments"}
                </h2>
            </header>
            <NewPostForm variant={variant} />
            <CommentsSection variant={variant} />
        </section>
    );
}
