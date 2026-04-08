import { httpFetchWithCredentials } from "./httpFetch.js";
import {
    getGameData,
    setGameData,
    setGameClasses,
    setGameSpecs,
} from "./storageOperations/gameData.js";

/**
 * Ensures the cached game metadata exists in local storage and backfills missing datasets.
 *
 * @returns {Promise<void>}
 */
export default async function localStorageValidatoor() {
    let gameData = getGameData();

    if (!Object.keys(gameData).length) {
        gameData = {};
        setGameData(gameData);
    }

    const { classes, specs } = gameData;

    if (!classes) {
        try {
            const req = await httpFetchWithCredentials("/game/classes");

            if (req.data) {
                setGameClasses(req.data);
            }
        } catch (error) {
            console.warn("req failed");
            console.error(error);
        }
    }

    if (!specs) {
        try {
            const req = await httpFetchWithCredentials("/game/specs");

            if (req.data) {
                setGameSpecs(req.data);
            }
        } catch (error) {
            console.warn("req failed");
            console.error(error);
        }
    }
}
