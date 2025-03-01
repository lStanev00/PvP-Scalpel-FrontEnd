import { useState } from "react";
import liStyle from '../../Styles/modular/suggestionsLi.module.css'

export default function LDBSearch({ data }) {
    const [suggestions, setSuggestions] = useState(undefined);
    const inputChecker = async (event) => {
        const input = event.target.value;
        const result = [];
        if (data) {
            for (const page of data) {
                page.filter(char => {
                    if (char.name.toLowerCase().includes(input.toLowerCase())) {
                        result.push(char);
                    }
                })
            }
            setSuggestions(result)
        }
        
    }

    const clear =  (e) => {
        setSuggestions(undefined);

        document.getElementById(`searchInput`).value = ``
    }
  return (
    <>
      <div className="search-container">
        <input 
          autoComplete="off" 
          onInput={inputChecker}
          type="text"
          id="searchInput"
          className="search-input"
          placeholder="Search for a character..."
        />
        <button onClick={clear} id="searchBtn" className="search-btn">
          Clear
        </button>
        <Suggestions suggestions={suggestions} />
      </div>
      <h3>
        <p
          className="error-msg"
          style={{
            display: "none",
            color: "red",
            justifyContent: "center",
            marginTop: "1.5rem",
            marginBottom: "1.5rem",
          }}
        ></p>
      </h3>{" "}
    </>
  );
}

function Suggestions({ suggestions }) {
    if (!suggestions || suggestions.length === 0) return null;

    return (
        <ul id="suggestions">
                <li disabled className={liStyle["suggestion-item"]}>--- Please select from the dropdown! ---</li>
            {suggestions.map((player, index) => (
                <li 
                    key={player._id} 
                    className={liStyle["suggestion-item"]}
                    tabIndex={index}
                    id={player._id}
                >
                    <img alt="Char IMG" src={player.media?.avatar} />

                    {player.name} - {(player.playerRealmSlug).replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                </li>
            ))}
        </ul>
    );
}
