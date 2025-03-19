import liStyle from "../../Styles/modular/suggestionsLi.module.css";
import hoverEffect from "../../Styles/modular/LDBSearchHoverEffect.module.css";
import { useEffect } from "react";
import buttonNav from "../../helpers/buttonNav";
export default function Suggestions({
  suggestions,
  setPage,
  data,
  refs,
  setSuggestions,
  liRef,
  currentLiIndex,
  setIndex,
}) {
  if (!suggestions || suggestions.length === 0) return null;
  const scrollToChar = (key) => {
    const element = refs.current[key];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      highlight(element);
      return setSuggestions(`nan`);
    } else {
      for (const page of data) {
        try {
          for (const char of page) {
            if (char?._id === key) {
              setPage(() => {
                return page;
              });
              setTimeout(() => {
                const element = refs.current[key];
                if (element) {
                  element.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                  highlight(element);
                  return setSuggestions(`nan`);
                }
              }, 100);
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  const removeSuggestions = (e) => {
    setSuggestions([]);
    setIndex(() => {
      return -1;
    });
  }; // Cleanup

  useEffect(() => {
    if (currentLiIndex === -1) return;
    if (liRef.current[currentLiIndex]) liRef.current[currentLiIndex].focus();
  }, [currentLiIndex]);

  useEffect(() => {
    document.addEventListener("click", removeSuggestions);

    return () => {
      document.removeEventListener("click", removeSuggestions);
    };
  }, []);
  useEffect(() => {
    // Release the falsy values to the junk collector
    liRef.current = liRef.current.filter(Boolean);
  }, [suggestions]);

  if (!suggestions || suggestions === `nan`) return;
  return (
    <ul
      id="suggestions"
      onKeyDown={(e) => {
        buttonNav(e, liRef, setIndex, currentLiIndex);
      }}
      tabIndex="0"
    >
      <li
        disabled
        style={{
          color: "#E5B80B",
          fontWeight: "bold",
          textShadow: "0px 0px 5px rgba(255, 215, 0, 0.6)",
        }}
        className={liStyle["suggestion-item"]}
      >
        --- Please select from the dropdown! ---
      </li>
      {suggestions.map((player, index) => {
        if (!player._id) return <></>;
        return (
          <li
            onClick={() => scrollToChar(player._id)}
            key={`${player._id}${index}` || `search-${index}`}
            ref={(el) => {
              if (player) {
                liRef.current[index] = el;
              } else if (!el) {
                liRef.current.splice(index, 1);
              }
            }}
            className={liStyle["suggestion-item"]}
            tabIndex={index}
            style={{ color: "#17E7E7" }}
          >
            <img alt="Char IMG" src={player.media?.avatar} />
            {player.name} -{" "}
            {player.playerRealmSlug
              .replace(/-/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase())}
          </li>
        );
      })}
    </ul>
  );
}

// Helper for eye catching highlight
function highlight(element) {
  if (!element) return;
  element.classList.add(hoverEffect["hover-effect"]);

  setTimeout(() => {
    element.classList.remove(hoverEffect["hover-effect"]);
  }, 3000);
}
