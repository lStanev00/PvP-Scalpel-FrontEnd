import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BlitzBtn from "../components/LDB/LDButtons/blitzButton";
import ContentContainer from "../components/LDB/ContentContainer";
import ShuffleBTN from "../components/LDB/LDButtons/shuffleButton";
import TwosBTN from "../components/LDB/LDButtons/twosButton";
import ThreesBTN from "../components/LDB/LDButtons/threesButton";
import BGBtn from "../components/LDB/LDButtons/BGButton";
import Style from "../Styles/modular/LDBMain.module.css";
import SEOLeaderboard from "../SEO/SEOLeaderboard";

export default function LDB() {
    const [data, setData] = useState(undefined);
    const [page, setPage] = useState([]);
    const [content, setContent] = useState(undefined);
    const [slug, setSlug] = useState("leaderboard");

    const navigate = useNavigate();
    const location = useLocation();

    // map content ↔ slug
    const map = {
        shuffleContent: "solo-shuffle",
        "2v2Content": "2v2",
        "3v3Content": "3v3",
        blitzContent: "blitz",
        BGContent: "rated-bg",
    };

    const reverseMap = Object.fromEntries(
        Object.entries(map).map(([key, value]) => [value, key])
    );

    // Update slug + browser URL when content changes
    useEffect(() => {
        if (!content) return;
        const newSlug = map[content] || "leaderboard";
        setSlug(newSlug);
        navigate(`/leaderboard/${newSlug}`, { replace: true });
    }, [content]);

    // Detect URL on page load or direct access
    useEffect(() => {
        const path = location.pathname.split("/leaderboard/")[1];
        if (!path) return;

        const matchedContent = reverseMap[path];
        if (matchedContent) {
            setContent(matchedContent);
        }
    }, [location.pathname]);

    // Default open Blitz if no slug
    useEffect(() => {
        if (!location.pathname.includes("/leaderboard/")) {
            const blitzBtn = document.querySelector("#blitz");
            if (blitzBtn) blitzBtn.click();
        }
    }, []);

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
