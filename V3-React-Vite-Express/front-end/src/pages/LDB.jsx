import { useState, useEffect } from "react";
import BlitzBtn from "../components/LDB/LDButtons/blitzButton";
import ContentContainer from "../components/LDB/ContentContainer";

export default function LDB() {
    const [data, setData] = useState(undefined);
    const [page, setPage] = useState([]);
    const [content, setContent] = useState(undefined);
    return (
        <>
        <div className="bracket-buttons">
            <button id="shuffle" className="bracket-btn">Solo Shuffle</button>
            <button id="twos" className="bracket-btn">2v2 Arena</button>
            <button id="threes" className="bracket-btn">3v3 Arena</button>
            <BlitzBtn setData={setData} setPage={setPage} setContent={setContent}/>
            <button id="rbg" className="bracket-btn">Rated BG</button>
        </div>

        <ContentContainer data={data} content={content} page={page} setPage={setPage} />
        </>
    );
};