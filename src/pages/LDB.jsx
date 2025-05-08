import { useEffect, useState } from "react";
import BlitzBtn from "../components/LDB/LDButtons/blitzButton";
import ContentContainer from "../components/LDB/ContentContainer";
import ShuffleBTN from "../components/LDB/LDButtons/shuffleButton";
import TwosBTN from "../components/LDB/LDButtons/twosButton";
import ThreesBTN from "../components/LDB/LDButtons/threesButton";
import BGBtn from "../components/LDB/LDButtons/BGButton";

export default function LDB() {
    const [data, setData] = useState(undefined);
    const [page, setPage] = useState([]);
    const [content, setContent] = useState(undefined);

    useEffect(() => {
        
        const blitzBtn = document.querySelector("#blitz");

        if(blitzBtn) blitzBtn.click();
    }, [])

    return (
        <>
        <div className="bracket-buttons">
            <ShuffleBTN setData={setData} setPage={setPage} setContent={setContent} />
            <TwosBTN setData={setData} setPage={setPage} setContent={setContent} />
            <ThreesBTN setData={setData} setPage={setPage} setContent={setContent} />
            <BlitzBtn setData={setData} setPage={setPage} setContent={setContent} />
            <BGBtn setData={setData} setPage={setPage} setContent={setContent} />
        </div>

        <ContentContainer data={data} content={content} page={page} setPage={setPage} />
        </>
    );
};