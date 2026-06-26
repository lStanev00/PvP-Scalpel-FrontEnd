import { useEffect, useMemo, useState } from "react";

import {
    GAME_DATA_STORAGE_EVENT,
    getGameBrackets,
} from "../../../../helpers/storageOperations/gameData.js";
import Style from "./FormBracketSelect.module.css";

function readCachedBrackets() {
    const brackets = getGameBrackets();
    return Array.isArray(brackets) ? brackets : [];
}

export default function FormBracketSelect() {
    const [brackets, setBrackets] = useState(readCachedBrackets);
    const sortedBrackets = useMemo(() => {
        const unknownBracket = brackets.find((bracket) => bracket?._id === 0);
        const remainingBrackets = brackets
            .filter((bracket) => bracket?._id !== 0)
            .sort((left, right) => {
                return (
                    Number(right?.isRated) - Number(left?.isRated) ||
                    Number(right?.isSolo) - Number(left?.isSolo) ||
                    String(left?.name || "").localeCompare(String(right?.name || ""))
                );
            });

        return unknownBracket ? [unknownBracket, ...remainingBrackets] : remainingBrackets;
    }, [brackets]);

    useEffect(() => {
        const refreshBrackets = () => {
            setBrackets(readCachedBrackets());
        };

        window.addEventListener(GAME_DATA_STORAGE_EVENT, refreshBrackets);
        window.addEventListener("storage", refreshBrackets);

        return () => {
            window.removeEventListener(GAME_DATA_STORAGE_EVENT, refreshBrackets);
            window.removeEventListener("storage", refreshBrackets);
        };
    }, []);

    return (
        <div className={Style.field}>
            <label htmlFor="media-video-bracket">Bracket</label>
            <select id="media-video-bracket" name="bracket" defaultValue="0">
                {!sortedBrackets.length && (
                    <option value="" disabled>
                        Loading brackets
                    </option>
                )}
                {sortedBrackets.map((bracket) => (
                    <option key={bracket._id} value={bracket._id}>
                        {bracket.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
