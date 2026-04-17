import Style from "../../Styles/modular/CommentsMain.module.css";
import CommentsSection from "./CommentsSection";
import NewPostForm from "./NewPostForm";

export default function Comments() {
    return (
        <main className={Style.main}>
            <NewPostForm />
            <section className={Style.contentWrapper}>
                <h1>Comments</h1>
                <CommentsSection />
            </section>
        </main>
    );
}
