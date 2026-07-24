import { useMemo, useRef, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";

import { useCharacterSearch } from "../../../../hooks/useCharacterSearch.js";
import { publicAssetUrl } from "../../../../helpers/assets.js";
import { getGameClasses } from "../../../../helpers/storageOperations/gameData.js";
import { useVideoDetailsContext } from "../VideoDetailsProvider.js";
import Style from "./FormCharSelect.module.css";

function normalizeSearchEntry(entry) {
    return Array.isArray(entry) ? entry[0] : entry;
}

function getCharacterId(entry) {
    return normalizeSearchEntry(entry)?.char?._id;
}

function hasCharacterId(characterId) {
    return characterId !== undefined && characterId !== null && characterId !== "";
}

function getCharacterLabel(entry) {
    const normalizedEntry = normalizeSearchEntry(entry);
    const char = normalizedEntry?.char;
    const name = char?.name || "Unknown character";
    const realm = normalizedEntry?.realmName || char?.playerRealm?.name || char?.playerRealm?.slug || "Unknown realm";
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
    const normalizedEntry = normalizeSearchEntry(entry);
    const char = normalizedEntry?.char;
    const label = getCharacterLabel(normalizedEntry);

    return (
        <li>
            <button
                type="button"
                className={Style.characterResult}
                onClick={() => onSelect(normalizedEntry)}>
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

function GuessResult({ guessChar }) {
    const region = (guessChar?.server || "").toUpperCase();

    return (
        <li>
            <div className={`${Style.characterResult} ${Style.guessResult}`} aria-disabled="true">
                <img
                    className={Style.characterIcon}
                    src={publicAssetUrl("plus_icon.png")}
                    alt=""
                    aria-hidden="true"
                />
                <span className={Style.resultText}>
                    <strong>
                        {guessChar?.charName} - {guessChar?.realmName}
                    </strong>
                    <small>Search match needs confirmation before it can be attached.</small>
                </span>
                {region && <span className={Style.serverPill}>{region}</span>}
            </div>
        </li>
    );
}

function DropdownInfo({ children }) {
    return <div className={Style.dropdownState}>{children}</div>;
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
        addChars,
        exactMatch,
        chars,
    } = useCharacterSearch(characterSearch);

    const characterResults = useMemo(() => {
        const uniqueEntries = new Map();

        [...exactMatch, ...chars].forEach((entry) => {
            const normalizedEntry = normalizeSearchEntry(entry);
            const characterId = getCharacterId(normalizedEntry);

            if (!hasCharacterId(characterId) || uniqueEntries.has(characterId)) return;
            uniqueEntries.set(characterId, normalizedEntry);
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

    const showDropdown = parsedInput.hasInput;
    const hasGuessResults = Array.isArray(addChars) && addChars.length > 0;
    const hasSelectableResults = selectableResults.length > 0;

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

                {showDropdown && (
                    <div className={Style.dropdown}>
                        {parsedInput.isTooShortName && !parsedInput.hasRealm && (
                            <DropdownInfo>Enter at least 3 letters.</DropdownInfo>
                        )}

                        {status === "loading" && shouldSearch && (
                            <DropdownInfo>Searching characters...</DropdownInfo>
                        )}

                        {status === "ready" && (hasGuessResults || hasSelectableResults) && (
                            <ul className={Style.resultList}>
                                {hasGuessResults && addChars.map((entry, index) => (
                                    <GuessResult
                                        key={`${index}:${entry?.charName}:${entry?.realmSlug}`}
                                        guessChar={entry}
                                    />
                                ))}
                                {selectableResults.map((entry) => (
                                    <CharacterResult
                                        key={getCharacterId(entry)}
                                        entry={entry}
                                        onSelect={handleCharacterSelect}
                                    />
                                ))}
                            </ul>
                        )}

                        {status === "ready" && !hasGuessResults && !hasSelectableResults && !parsedInput.isTooShortName && (
                            <DropdownInfo>
                                {characterResults.length
                                    ? "Character already added."
                                    : parsedInput.hasRealm
                                        ? "No confirmed character found."
                                        : "Add a realm after a dash to narrow it down."}
                            </DropdownInfo>
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
                                    src={getClassIconMedia(normalizeSearchEntry(entry)?.char)}
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
