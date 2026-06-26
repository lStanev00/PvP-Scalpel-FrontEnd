import { useMemo, useRef, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";

import { useCharacterSearch } from "../../../../hooks/useCharacterSearch.js";
import { publicAssetUrl } from "../../../../helpers/assets.js";
import { getGameClasses } from "../../../../helpers/storageOperations/gameData.js";
import { useVideoDetailsContext } from "../VideoDetailsProvider.js";
import Style from "./FormCharSelect.module.css";

function getCharacterId(entry) {
    return entry?.char?._id;
}

function hasCharacterId(characterId) {
    return characterId !== undefined && characterId !== null && characterId !== "";
}

function getCharacterLabel(entry) {
    const char = entry?.char;
    const name = char?.name || "Unknown character";
    const realm = entry?.realmName || char?.playerRealm?.name || char?.playerRealm?.slug || "Unknown realm";
    const server = (char?.server || char?.playerRealm?.server || "").toUpperCase();

    return {
        name,
        realm,
        server,
    };
}

function getClassIconMedia(char) {
    const classMedia = char?.class?.media;

    if (typeof classMedia === "string" && classMedia.trim() !== "") {
        return classMedia;
    }

    const className = char?.class?.name;

    if (typeof className === "string" && className.trim() !== "") {
        const cachedClass = getGameClasses()?.find((entry) => {
            const entryName = entry?.name;
            return (
                typeof entryName === "string" &&
                entryName.trim().toLowerCase() === className.trim().toLowerCase()
            );
        });

        if (typeof cachedClass?.media === "string" && cachedClass.media.trim() !== "") {
            return cachedClass.media;
        }
    }

    return publicAssetUrl("item_fallback.png");
}

function CharacterResult({ entry, onSelect }) {
    const char = entry?.char;
    const label = getCharacterLabel(entry);

    return (
        <li>
            <button
                type="button"
                className={Style.characterResult}
                onClick={() => onSelect(entry)}>
                <img
                    className={Style.characterIcon}
                    src={getClassIconMedia(char)}
                    alt={(char?.class?.name || "Unknown") + " class icon"}
                />
                <span className={Style.resultText}>
                    <strong>{label.name}</strong>
                    <small>{label.realm}</small>
                </span>
                {label.server && <span className={Style.serverPill}>{label.server}</span>}
            </button>
        </li>
    );
}

export default function FormCharSelect() {
    const searchInputRef = useRef(null);
    const [characterSearch, setCharacterSearch] = useState("");
    const [selectedCharacterEntries, setSelectedCharacterEntries] = useState([]);
    const { characters, addCharacter, removeCharacter } = useVideoDetailsContext();
    const {
        status,
        parsedInput,
        shouldSearch,
        exactMatch,
        chars,
    } = useCharacterSearch(characterSearch);

    const characterResults = useMemo(() => {
        const uniqueEntries = new Map();

        [...exactMatch, ...chars].forEach((entry) => {
            const characterId = getCharacterId(entry);

            if (!hasCharacterId(characterId) || uniqueEntries.has(characterId)) return;
            uniqueEntries.set(characterId, entry);
        });

        return [...uniqueEntries.values()];
    }, [chars, exactMatch]);

    const selectedCharacterIds = useMemo(
        () => new Set(characters),
        [characters],
    );

    const selectableResults = characterResults.filter((entry) => {
        return !selectedCharacterIds.has(getCharacterId(entry));
    });

    const handleCharacterSelect = (entry) => {
        const characterId = getCharacterId(entry);

        if (!hasCharacterId(characterId) || selectedCharacterIds.has(characterId)) return;

        addCharacter(characterId);
        setSelectedCharacterEntries((current) => [...current, entry]);
        setCharacterSearch("");
        requestAnimationFrame(() => searchInputRef.current?.focus());
    };

    const handleCharacterRemove = (characterId) => {
        removeCharacter(characterId);
        setSelectedCharacterEntries((current) => {
            return current.filter((entry) => getCharacterId(entry) !== characterId);
        });
    };

    return (
        <section className={Style.characterSection} aria-labelledby="media-characters-title">
            <div className={Style.sectionHeader}>
                <div>
                    <span className={Style.eyebrow}>Characters in the video (optional)</span>
                </div>
                <span className={Style.countPill}>{characters.length} selected</span>
            </div>

            <div className={Style.characterSearchWrap}>
                <label htmlFor="media-character-search">Search character</label>
                <div className={Style.searchBox}>
                    <FiSearch className={Style.searchIcon} aria-hidden="true" />
                    <input
                        id="media-character-search"
                        ref={searchInputRef}
                        type="text"
                        value={characterSearch}
                        onChange={(event) => setCharacterSearch(event.target.value)}
                        placeholder="Name - Realm - Server"
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck="false"
                        aria-describedby="media-character-help"
                    />
                </div>

                <p id="media-character-help" className={Style.helperText}>
                    Select a confirmed search result to add its character ID to this video.
                </p>

                {parsedInput.hasInput && (
                    <div className={Style.dropdown}>
                        {status === "loading" && shouldSearch && (
                            <div className={Style.dropdownState}>Searching characters...</div>
                        )}

                        {status === "ready" && selectableResults.length > 0 && (
                            <ul className={Style.resultList}>
                                {selectableResults.map((entry) => (
                                    <CharacterResult
                                        key={getCharacterId(entry)}
                                        entry={entry}
                                        onSelect={handleCharacterSelect}
                                    />
                                ))}
                            </ul>
                        )}

                        {status === "ready" && selectableResults.length === 0 && (
                            <div className={Style.dropdownState}>
                                {characterResults.length ? "Character already added." : "No confirmed character found."}
                            </div>
                        )}

                        {parsedInput.isTooShortName && (
                            <div className={Style.dropdownState}>Enter at least 3 letters.</div>
                        )}
                    </div>
                )}
            </div>

            {selectedCharacterEntries.length > 0 && (
                <ul className={Style.selectedCharacters} aria-label="Selected characters">
                    {selectedCharacterEntries.map((entry) => {
                        const characterId = getCharacterId(entry);
                        const label = getCharacterLabel(entry);

                        return (
                            <li key={characterId} className={Style.characterChip}>
                                <input type="hidden" name="characters" value={characterId} />
                                <img
                                    className={Style.characterIcon}
                                    src={getClassIconMedia(entry?.char)}
                                    alt={(entry?.char?.class?.name || "Unknown") + " class icon"}
                                />
                                <span>
                                    <strong>{label.name}</strong>
                                    <small>
                                        {label.realm}
                                        {label.server ? " - " + label.server : ""}
                                    </small>
                                </span>
                                <button
                                    type="button"
                                    className={Style.removeCharacter}
                                    onClick={() => handleCharacterRemove(characterId)}
                                    aria-label={"Remove " + label.name}>
                                    <FiX aria-hidden="true" />
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
}
