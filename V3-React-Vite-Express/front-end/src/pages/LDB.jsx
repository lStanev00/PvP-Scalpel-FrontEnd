import { useState, useEffect } from "react";
import BlitzBtn from "../components/LDB/LDButtons/blitzButton";
import ContentContainer from "../components/LDB/ContentContainer";
import ShuffleBTN from "../components/LDB/LDButtons/shuffleButton";
import TwosBTN from "../components/LDB/LDButtons/twosButton";
import ThreesBTN from "../components/LDB/LDButtons/threesButton";

export default function LDB() {
    const [data, setData] = useState(undefined);
    const [page, setPage] = useState([]);
    const [content, setContent] = useState(undefined);
    return (
        <>
        <div className="bracket-buttons">
            <ShuffleBTN setData={setData} setPage={setPage} setContent={setContent} />
            <TwosBTN setData={setData} setPage={setPage} setContent={setContent} />
            {/* <button id="threes" className="bracket-btn">3v3 Arena</button> */}
            <ThreesBTN setData={setData} setPage={setPage} setContent={setContent} />
            <BlitzBtn setData={setData} setPage={setPage} setContent={setContent} />
            <button id="rbg" className="bracket-btn">Rated BG</button>
        </div>

        <ContentContainer data={data} content={content} page={page} setPage={setPage} />
        </>
    );
};