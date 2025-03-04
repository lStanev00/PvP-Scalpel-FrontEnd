import { useEffect, useState } from "react";
import Suggestions from "./SuggestionsLi";

export default function LDBSearch({ data, setPage, refs }) {
    const [suggestions, setSuggestions] = useState(`nan`);
    const inputChecker = async (event) => {
        const input = event.target.value;
        const result = [];

        if (input == "")  return setSuggestions(undefined)
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
    }

    useEffect(() => {
        if (suggestions === `nan`) document.getElementById(`searchInput`).value = ``;
    }, [suggestions])
  return (
    <>
      <div className="search-container">
        <input 
          autoComplete="off"
          autoCorrect="off"
          onInput={inputChecker}
          type="text"
          id="searchInput"
          className="search-input"
          placeholder="Search for a character..."
        />
        <button onClick={clear} id="searchBtn" className="search-btn">
          Clear
        </button>
        <Suggestions suggestions={suggestions} setPage={setPage} data={data} refs={refs} setSuggestions={setSuggestions} />
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