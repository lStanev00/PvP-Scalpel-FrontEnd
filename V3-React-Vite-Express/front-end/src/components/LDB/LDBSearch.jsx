import { useState } from "react";
import liStyle from '../../Styles/modular/suggestionsLi.module.css'

export default function LDBSearch({ data, setPage, refs }) {
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
        <Suggestions suggestions={suggestions} setPage={setPage} data={data} refs={refs} />
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

function Suggestions({ suggestions, setPage, data, refs }) {
    if (!suggestions || suggestions.length === 0) return null;

    const [highlight, setHigh] = useState(false);

    const scrollToChar = (key) => {
      const element = refs.current[key];
      if(element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      } else{
        for (const page of data) {
          try {
            for (const char of page) {
              if(char?._id === key) {
                setPage(old => {
                  return page
                });
                setTimeout(() => {
                  const element = refs.current[key];
                  if(element) element.scrollIntoView({ behavior: "smooth", block: "start" });
                  return
                }, 100)
              }
            }
            
          } catch (error) {
            console.log(error)
          }
        }
      }
      
    }

    return (
        <ul id="suggestions">
                <li disabled style={{color: "#E5B80B",  fontWeight: "bold", textShadow: "0px 0px 5px rgba(255, 215, 0, 0.6)"}} className={liStyle["suggestion-item"]}>--- Please select from the dropdown! ---</li>
            {suggestions.map((player, index) => (
                <li 
                    onClick={() => scrollToChar(player._id)}
                    key={player._id + `/SEARCH`} 
                    className={liStyle["suggestion-item"]}
                    tabIndex={index}
                    style={{color: '#17E7E7'}}
                >
                    <img alt="Char IMG" src={player.media?.avatar} />

                    {player.name} - {(player.playerRealmSlug).replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                </li>
            ))}
        </ul>
    );
}
