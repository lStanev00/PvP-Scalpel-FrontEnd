/* eslint-disable react/prop-types */

import { useMemo, useState } from "react";
import { FaMagnifyingGlass, FaPlus, FaXmark } from "react-icons/fa6";
import { publicAssetUrl } from "../../helpers/assets.js";
import { useCharacterSearch } from "../../hooks/useCharacterSearch.js";

function normalizeCharacter(entry) {
    const char = entry?.char;
    if (!char?._id) return null;

    return {
        id: char._id,
        name: char.name || "Unknown character",
        realm: entry?.realmName || char?.playerRealm?.name || "Unknown realm",
        server: (char.server || char?.playerRealm?.server || "").toUpperCase(),
        className: char?.class?.name || "Unknown class",
        image:
            char?.class?.media
            || char?.media?.avatar
            || publicAssetUrl("item_fallback.png"),
    };
}

export default function CharacterMultiSelect({
    selected,
    onChange,
    styles,
}) {
    const [query, setQuery] = useState("");
    const [focused, setFocused] = useState(false);
    const search = useCharacterSearch(query);
    const selectedIds = useMemo(() => new Set(selected.map((entry) => entry.id)), [selected]);
    const results = search.storedCharacters
        .map(normalizeCharacter)
        .filter((entry) => entry && !selectedIds.has(entry.id));

    const addCharacter = (character) => {
        onChange([...selected, character]);
        setQuery("");
        setFocused(false);
    };

    return (
        <div className={styles.characterPicker}>
            <div className={styles.characterSearch}>
                <FaMagnifyingGlass aria-hidden="true" />
                <input
                    type="text"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => window.setTimeout(() => setFocused(false), 120)}
                    placeholder={
                        selected.length
                            ? "Add another character..."
                            : "Search character name - realm - server"
                    }
                    autoComplete="off"
                    spellCheck="false"
                    aria-label="Search characters to attach"
                />

                {focused && query.trim() && (
                    <div className={styles.characterResults}>
                        {search.status === "loading" && (
                            <p className={styles.searchMessage}>Searching characters...</p>
                        )}
                        {search.status === "ready" && results.length === 0 && (
                            <p className={styles.searchMessage}>
                                No stored characters found. Guessed characters cannot be attached.
                            </p>
                        )}
                        {results.map((character) => (
                            <button
                                type="button"
                                key={character.id}
                                className={styles.characterResult}
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => addCharacter(character)}
                            >
                                <img src={character.image} alt="" />
                                <span>
                                    <strong>{character.name}</strong>
                                    <small>
                                        {character.realm} {character.server ? `- ${character.server}` : ""}
                                    </small>
                                </span>
                                <FaPlus aria-hidden="true" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {selected.length > 0 && (
                <div className={styles.selectedCharacters}>
                    {selected.map((character) => (
                        <article key={character.id} className={styles.characterCard}>
                            <img src={character.image} alt="" />
                            <div>
                                <strong>{character.name}</strong>
                                <span>
                                    {character.realm} {character.server ? `- ${character.server}` : ""}
                                </span>
                                <small>{character.className}</small>
                            </div>
                            <button
                                type="button"
                                onClick={() => onChange(
                                    selected.filter((entry) => entry.id !== character.id),
                                )}
                                aria-label={`Remove ${character.name}`}
                            >
                                <FaXmark />
                            </button>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}
