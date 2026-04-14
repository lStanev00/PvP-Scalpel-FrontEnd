const STORAGE_KEY = "pvpscalpel.lobbyTableSort";

const DEFAULT_SORT = {
    sortKey: "rating",
    sortDirection: "desc",
};

const ALLOWED_SORT_KEYS = new Set(["role", "rating", "record", "xp", "ilvl"]);
const ALLOWED_SORT_DIRECTIONS = new Set(["asc", "desc"]);

function getStorage() {
    if (typeof window === "undefined") return null;
    return window.localStorage;
}

function normalizeSortValue(value) {
    if (!value || typeof value !== "object") {
        return { ...DEFAULT_SORT };
    }

    const sortKey = String(value.sortKey || "");
    const sortDirection = String(value.sortDirection || "");

    if (!ALLOWED_SORT_KEYS.has(sortKey) || !ALLOWED_SORT_DIRECTIONS.has(sortDirection)) {
        return { ...DEFAULT_SORT };
    }

    return {
        sortKey,
        sortDirection,
    };
}

export function getLobbyTableSort() {
    const storage = getStorage();
    if (!storage) return { ...DEFAULT_SORT };

    const storedValue = storage.getItem(STORAGE_KEY);
    if (!storedValue) return { ...DEFAULT_SORT };

    try {
        return normalizeSortValue(JSON.parse(storedValue));
    } catch {
        return { ...DEFAULT_SORT };
    }
}

export function setLobbyTableSort(value) {
    const nextValue = normalizeSortValue(value);
    const storage = getStorage();

    if (!storage) {
        return nextValue;
    }

    storage.setItem(STORAGE_KEY, JSON.stringify(nextValue));
    return nextValue;
}
