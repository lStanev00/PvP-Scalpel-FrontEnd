import Style from "../../Styles/modular/CommentsMain.module.css";
import CommentsSection from "./CommentsSection";
import NewPostForm from "./NewPostForm";

export default function Comments() {
    return (
        <main className={Style.main}>
            <h1>Comments</h1>
            <section className={Style.contentWrapper}>
                <CommentsSection />
                <NewPostForm />

            </section>
        </main>
    );
}
