import { useEffect, useState, useRef } from "react";
import Suggestions from "./SuggestionsLi";
import buttonNav from "../../helpers/buttonNav";

export default function LDBSearch({ data, setPage, refs }) {
  const [suggestions, setSuggestions] = useState(`nan`);
  const [currentLiIndex, setIndex] = useState(Number);
  const liRef = useRef([]);
  const inputChecker = async (event) => {
    const input = event.target.value;
    const result = [];

    if (input == "") return setSuggestions(undefined);
    if (data) {
      for (const page of data) {
        page.filter((char) => {
          if (char.name.toLowerCase().includes(input.toLowerCase())) {
            result.push(char);
          }
        });
      }
      setSuggestions(result);
    }
  };
  const clear = (e) => {
    setSuggestions(undefined);
  };

  useEffect(() => {
    if (suggestions === `nan`)
      document.getElementById(`searchInput`).value = ``;
  }, [suggestions]);
  return (
    <>
      <div className="search-container">
        <input
          onKeyDown={(e) => {
            buttonNav(e, liRef, setIndex, currentLiIndex);
          }}
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
        <Suggestions
          setIndex={setIndex}
          currentLiIndex={currentLiIndex}
          suggestions={suggestions}
          setPage={setPage}
          data={data}
          refs={refs}
          setSuggestions={setSuggestions}
          liRef={liRef}
        />
      </div>
    </>
  );
}
