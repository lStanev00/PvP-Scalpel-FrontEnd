import { useState, useEffect } from "react";

export default function SearchBox({ data, setSearch }) {
    const [query, setQuery] = useState(``);

    const onClick = () => {
        document.getElementById(`searchInput`).value = ``;
        setQuery(``)
    }

    useEffect(() => {
        const onInput = (event) => {
            const searchValue = event.target.value;
            setQuery(searchValue.toLowerCase());
        }

        const inputEl = document.getElementById(`searchInput`);
        inputEl.addEventListener(`input`, onInput);

        return () => {
            inputEl.removeEventListener(`input`, onInput);
        }
    }, []);

    useEffect(() => {
        setSearch(data.filter(char => {
            return char.name.toLowerCase().includes(query)
        }))
    }, [query])

  return (
    <>
      <div className="search-container">
        <input
          autocomplete="off"
          type="text"
          id="searchInput"
          className="search-input"
          placeholder="Search for a character..."
        />
        <button onClick={onClick} id="searchBtn" className="search-btn">
          Clear
        </button>
      </div>
    </>
  );
}
