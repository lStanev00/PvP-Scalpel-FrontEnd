const STORAGE_KEY = "gameData";

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
 * @typedef {object} GameData
 * @property {GameClass[]=} classes
 * @property {GameSpecialization[]=} specs
 */

function getStorage() {
    if (typeof window === "undefined") return null;
    return window.localStorage;
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
    return value;
}

/**
 * Returns the cached game classes collection.
 *
 * @returns {GameClass[] | undefined} Stored `classes` value.
 */
export function getGameClasses() {
    return getGameData().classes;
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
    };

    return setGameData(nextValue);
}

/**
 * Returns the cached game specs collection.
 *
 * @returns {GameSpecialization[] | undefined} Stored `specs` value.
 */
export function getGameSpecs() {
    return getGameData().specs;
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
    };

    return setGameData(nextValue);
}
