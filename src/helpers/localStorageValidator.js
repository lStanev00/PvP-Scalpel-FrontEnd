/**
 * Developer note:
 * This module owns startup validation for the `gameData` localStorage entry.
 * It delegates cache repair to `storageOperations/gameData.js`, which keeps
 * classes, specs, and brackets cached under one object and refreshes the whole
 * cache when any required dataset is missing or the two-day TTL has expired.
 *
 * Brackets API responses are wrapped as `{ value, Count }`; only `value` is
 * persisted under `gameData.brackets`.
 */
import {
    getGameData,
    isGameDataExpired,
    isGameDataMissingRequiredValue,
    refreshGameDataCache,
} from "./storageOperations/gameData.js";

/**
 * Ensures the cached game metadata exists in local storage and backfills missing datasets.
 *
 * @returns {Promise<void>}
 */
export default async function localStorageValidatoor() {
    const gameData = getGameData();

    if (isGameDataExpired(gameData) || isGameDataMissingRequiredValue(gameData)) {
        await refreshGameDataCache();
    }
}
