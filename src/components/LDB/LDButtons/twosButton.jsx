import { GiBattleAxe } from "react-icons/gi";
import Style from "./BracketButton.module.css";
import { UserContext } from "../../../hooks/ContextVariables.jsx";
import { useContext } from "react";

export default function TwosBTN({ setData, setPage, setContent }) {

    const { httpFetch } = useContext(UserContext);


    const clickHandler = async () => {
        setData(() => undefined);
        const res = await httpFetch(`/LDB/2v2`);
        let reqData = res?.data;
        let rank = 1;
        const paginatedData = [];

        for (let i = 0; i < reqData.length; i += 10) {
            const page = reqData.slice(i, i + 10);
            let pageMap = [];
            for (const char of page) {
                const achieves = char?.achieves?.["2s"] ?? undefined;

                if (achieves) {
                    try {
                        const description = achieves.description
                            .replace("Earn a ", "")
                            .replace(" personal rating in the 2v2 bracket of the arena.", "");

                        char.XP = {
                            name: "Just the Two of Us:",
                            description,
                        };
                    } catch (error) {}
                }
                char.ladderRank = rank;
                pageMap.push(char);
                rank = rank + 1;
            }
            paginatedData.push(pageMap);
        }
        setData(paginatedData);
        setPage(paginatedData[0]);
        setContent(`2v2Content`);
    };
    return (
        <button onClick={clickHandler} id="twos" className={Style.button}>
            <GiBattleAxe className={Style.icon} />
            <span className={Style.label}>2v2 Arena</span>
        </button>
    );
}
