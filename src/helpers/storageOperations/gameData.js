import { httpFetchWithCredentials } from "../httpFetch.js";

const STORAGE_KEY = "gameData";
const GAME_DATA_TTL_MS = 2 * 24 * 60 * 60 * 1000;
export const GAME_DATA_STORAGE_EVENT = "gameDataStorageChanged";
let pendingGameDataRefresh = null;

/**
 * @typedef {"tank" | "damage" | "healer"} GameRole
 */

/**
 * @typedef {object} GameSpecialization
 * @property {number} _id
 * @property {string} name
 * @property {string} media
 * @property {GameRole} role
 * @property {number} relClass
 */

/**
 * @typedef {object} GameClass
 * @property {number} _id
 * @property {string} name
 * @property {string} media
 * @property {GameSpecialization[]=} specs
 */

/**
 * @typedef {object} GameBracket
 * @property {number} _id
 * @property {string} name
 * @property {boolean} isRated
 * @property {boolean} isSolo
 * @property {string=} slug
 * @property {number=} blizID
 */

/**
 * @typedef {object} GameData
 * @property {GameClass[]=} classes
 * @property {GameSpecialization[]=} specs
 * @property {GameBracket[]=} brackets
 * @property {number=} updatedAt
 */

function getStorage() {
    if (typeof window === "undefined") return null;
    return window.localStorage;
}

function dispatchGameDataStorageEvent(value) {
    if (typeof window === "undefined") return;

    window.dispatchEvent(new CustomEvent(GAME_DATA_STORAGE_EVENT, { detail: value }));
}

function isNonEmptyArray(value) {
    return Array.isArray(value) && value.length > 0;
}

/**
 * Returns whether the cached game data is missing one of the required datasets.
 *
 * @param {GameData} value - Parsed `gameData` object.
 * @returns {boolean} True when a full refresh should be requested.
 */
export function isGameDataMissingRequiredValue(value) {
    return (
        !isNonEmptyArray(value?.classes) ||
        !isNonEmptyArray(value?.specs) ||
        !isNonEmptyArray(value?.brackets)
    );
}

function shouldRefreshGameData(value) {
    return isGameDataExpired(value) || isGameDataMissingRequiredValue(value);
}

function requestGameDataRefreshIfNeeded(value) {
    if (!shouldRefreshGameData(value)) return;
    void refreshGameDataCache();
}

function extractArrayPayload(response) {
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.data?.value)) return response.data.value;
    return null;
}

function getPayloadType(response) {
    if (Array.isArray(response?.data)) return "array";
    if (Array.isArray(response?.data?.value)) return "wrapped-array";
    if (response?.data === null) return "null";
    return typeof response?.data;
}

/**
 * Reads the persisted game data payload from localStorage.
 *
 * @returns {GameData} Parsed `gameData` object or an empty object fallback.
 */
export function getGameData() {
    const storage = getStorage();
    if (!storage) return {};

    const storedValue = storage.getItem(STORAGE_KEY);
    if (!storedValue) return {};

    try {
        const parsedValue = JSON.parse(storedValue);
        return parsedValue && typeof parsedValue === "object" ? parsedValue : {};
    } catch {
        return {};
    }
}

/**
 * Persists the full game data payload to localStorage.
 *
 * @param {GameData} value - Complete `gameData` object to store.
 * @returns {GameData} The stored value.
 */
export function setGameData(value) {
    const storage = getStorage();
    if (!storage) return value;

    storage.setItem(STORAGE_KEY, JSON.stringify(value));
    dispatchGameDataStorageEvent(value);
    return value;
}

/**
 * Returns whether the cached game data is older than the supported TTL.
 *
 * @param {GameData} value - Parsed `gameData` object.
 * @returns {boolean} True when the cache should be refreshed.
 */
export function isGameDataExpired(value) {
    const updatedAt = Number(value?.updatedAt);
    return !Number.isFinite(updatedAt) || Date.now() - updatedAt >= GAME_DATA_TTL_MS;
}

/**
 * Refreshes all game data datasets and stores them under one fresh `gameData` object.
 *
 * @returns {Promise<GameData | undefined>} Updated cache or undefined when refresh failed.
 */
export function refreshGameDataCache() {
    if (pendingGameDataRefresh) return pendingGameDataRefresh;

    pendingGameDataRefresh = (async () => {
        const [classesReq, specsReq, bracketsReq] = await Promise.all([
            httpFetchWithCredentials("/game/classes"),
            httpFetchWithCredentials("/game/specs"),
            httpFetchWithCredentials("/game/brackets"),
        ]);

        const classes = extractArrayPayload(classesReq);
        const specs = extractArrayPayload(specsReq);
        const brackets = extractArrayPayload(bracketsReq);

        if (!classes || !specs || !brackets) {
            console.warn("gameData refresh failed: invalid API payload", {
                classes: {
                    status: classesReq.status,
                    ok: classesReq.ok,
                    payloadType: getPayloadType(classesReq),
                },
                specs: {
                    status: specsReq.status,
                    ok: specsReq.ok,
                    payloadType: getPayloadType(specsReq),
                },
                brackets: {
                    status: bracketsReq.status,
                    ok: bracketsReq.ok,
                    payloadType: getPayloadType(bracketsReq),
                },
            });
            return undefined;
        }

        return setGameData({
            classes,
            specs,
            brackets,
            updatedAt: Date.now(),
        });
    })()
        .catch((error) => {
            console.warn("gameData refresh failed");
            console.error(error);
            return undefined;
        })
        .finally(() => {
            pendingGameDataRefresh = null;
        });

    return pendingGameDataRefresh;
}

/**
 * Returns the cached game classes collection.
 *
 * @returns {GameClass[] | undefined} Stored `classes` value.
 */
export function getGameClasses() {
    const gameData = getGameData();
    requestGameDataRefreshIfNeeded(gameData);
    return gameData.classes;
}

/**
 * Merges and persists the cached game classes collection.
 *
 * @param {GameClass[]} classes - Classes payload to store under `gameData.classes`.
 * @returns {GameData} The updated `gameData` object.
 */
export function setGameClasses(classes) {
    const nextValue = {
        ...getGameData(),
        classes,
        updatedAt: Date.now(),
    };

    return setGameData(nextValue);
}

/**
 * Returns the cached game specs collection.
 *
 * @returns {GameSpecialization[] | undefined} Stored `specs` value.
 */
export function getGameSpecs() {
    const gameData = getGameData();
    requestGameDataRefreshIfNeeded(gameData);
    return gameData.specs;
}

/**
 * Merges and persists the cached game specs collection.
 *
 * @param {GameSpecialization[]} specs - Specs payload to store under `gameData.specs`.
 * @returns {GameData} The updated `gameData` object.
 */
export function setGameSpecs(specs) {
    const nextValue = {
        ...getGameData(),
        specs,
        updatedAt: Date.now(),
    };

    return setGameData(nextValue);
}

/**
 * Returns the cached game brackets collection.
 *
 * @returns {GameBracket[] | undefined} Stored `brackets` value.
 */
export function getGameBrackets() {
    const gameData = getGameData();
    requestGameDataRefreshIfNeeded(gameData);
    return gameData.brackets;
}

/**
 * Merges and persists the cached game brackets collection.
 *
 * @param {GameBracket[]} brackets - Brackets payload to store under `gameData.brackets`.
 * @returns {GameData} The updated `gameData` object.
 */
export function setGameBrackets(brackets) {
    const nextValue = {
        ...getGameData(),
        brackets,
        updatedAt: Date.now(),
    };

    return setGameData(nextValue);
}
