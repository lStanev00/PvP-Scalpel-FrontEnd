import { GiCrossedSwords } from "react-icons/gi";
import httpFetch from "../../../helpers/httpFetch.js";
import Style from "./BracketButton.module.css"

export default function ShuffleBTN({ setData, setPage, setContent }) {
    const clickHandler = async () => {
        setData(() => undefined);
        const res = await httpFetch(`/LDB/solo`);
        let reqData = await res.json();
        let rank = 1;
        const paginatedData = [];

        for (let i = 0; i < reqData.length; i += 15) {
            const page = reqData.slice(i, i + 15);
            let pageMap = [];

            for (const char of page) {
                let [bracket, bracketClass, bracketSpec] = Object.keys(char.rating)[0].split(`-`);
                char["class"] = bracketClass.replace(/^./, (c) => c.toUpperCase());
                char["spec"] = bracketSpec.replace(/^./, (c) => c.toUpperCase());

                char.ladderRank = rank;
                pageMap.push(char);
                rank = rank + 1;
            }

            paginatedData.push(pageMap);
        }

        setData(paginatedData);
        setPage(paginatedData[0]);
        setContent(`shuffleContent`);
    };

    return (
        <button onClick={clickHandler} id="shuffle" className={Style.button}>
            <GiCrossedSwords className={Style.icon} />
            <span className={Style.label}>Solo Shuffle</span>
        </button>
    );
}
