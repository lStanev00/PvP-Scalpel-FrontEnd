import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BlitzBtn from "../components/LDB/LDButtons/blitzButton";
import ContentContainer from "../components/LDB/ContentContainer";
import ShuffleBTN from "../components/LDB/LDButtons/shuffleButton";
import TwosBTN from "../components/LDB/LDButtons/twosButton";
import ThreesBTN from "../components/LDB/LDButtons/threesButton";
import BGBtn from "../components/LDB/LDButtons/BGButton";
import Style from "../Styles/modular/LDBMain.module.css";
import SEOLeaderboard from "../SEO/SEOLeaderboard";

const CONTENT_TO_SLUG = {
    shuffleContent: "solo-shuffle",
    "2v2Content": "2v2",
    "3v3Content": "3v3",
    blitzContent: "blitz",
    BGContent: "rated-bg",
};

const SLUG_TO_CONTENT = Object.fromEntries(
    Object.entries(CONTENT_TO_SLUG).map(([key, value]) => [value, key])
);

const CONTENT_TO_BUTTON_SELECTOR = {
    shuffleContent: "#shuffle",
    "2v2Content": "#twos",
    "3v3Content": "#threes",
    blitzContent: "#blitz",
    BGContent: "#rbg",
};

export default function LDB() {
    const [data, setData] = useState(undefined);
    const [page, setPage] = useState([]);
    const [content, setContent] = useState(undefined);
    const [slug, setSlug] = useState("leaderboard");
    const contentRef = useRef(content);

    const navigate = useNavigate();
    const location = useLocation();

    // map content ↔ slug
    // (mappings defined above)

    useEffect(() => {
        contentRef.current = content;
    }, [content]);

    // Update slug + browser URL when content changes
    useEffect(() => {
        if (!content) return;
        const newSlug = CONTENT_TO_SLUG[content] || "leaderboard";
        setSlug(newSlug);
        const targetPath = `/leaderboard/${newSlug}`;
        if (location.pathname !== targetPath) {
            navigate(targetPath, { replace: true });
        }
    }, [content, location.pathname, navigate]);

    // Detect URL on page load or direct access, then trigger the correct bracket fetch.
    useEffect(() => {
        const rawPath = location.pathname.split("/leaderboard/")[1];
        if (!rawPath) return;

        const path = rawPath.replace(/\/+$/, "");

        const matchedContent = SLUG_TO_CONTENT[path];
        if (!matchedContent) return;
        if (matchedContent === contentRef.current) return;

        const selector = CONTENT_TO_BUTTON_SELECTOR[matchedContent];
        const btn = selector ? document.querySelector(selector) : null;
        if (btn) btn.click();
    }, [location.pathname]);

    // Default open Blitz if no slug
    useEffect(() => {
        if (location.pathname === "/leaderboard" || location.pathname === "/leaderboard/") {
            const blitzBtn = document.querySelector("#blitz");
            if (blitzBtn) blitzBtn.click();
        }
    }, [location.pathname]);

    return (
        <>
            <SEOLeaderboard content={content} slug={slug} />

            <div className={Style.buttonsWrapper}>
                <ShuffleBTN setData={setData} setPage={setPage} setContent={setContent} />
                <TwosBTN setData={setData} setPage={setPage} setContent={setContent} />
                <ThreesBTN setData={setData} setPage={setPage} setContent={setContent} />
                <BlitzBtn setData={setData} setPage={setPage} setContent={setContent} />
                <BGBtn setData={setData} setPage={setPage} setContent={setContent} />
            </div>

            <ContentContainer data={data} content={content} page={page} setPage={setPage} />
        </>
    );
}
