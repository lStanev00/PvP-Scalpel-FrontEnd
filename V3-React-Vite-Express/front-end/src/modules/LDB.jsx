import { useState, useEffect } from "react";
export default function LDB() {
    const [data, setData] = useState();
    
    useEffect(async () => {
    const request = await (
        await fetch(`https://api.pvpscalpel.com/LDB/blitz`)
    ).json();

    const maxPage = 25;
    
    
    setData(request);
    }, []);
    return (
        <>
        <div className="bracket-buttons">
            <button id="shuffle" className="bracket-btn">Solo Shuffle</button>
            <button id="twos" className="bracket-btn">2v2 Arena</button>
            <button id="threes" className="bracket-btn">3v3 Arena</button>
            <button id="blitz" className="bracket-btn">Blitz BG</button>
            <button id="rbg" className="bracket-btn">Rated BG</button>
        </div>
    
        <section className="leaderboard-container">
            <h1 className="leaderboard-title">PvP Leaderboard</h1>
            <h3 id="bracket-title">-\* Blitz BG */-</h3>
    
            <div className="search-container">
                <input type="text" id="searchInput" className="search-input" placeholder="Search for a character..." />
                <button id="searchBtn" className="search-btn">Search</button>
                <ul id="suggestions"></ul>
            </div>
            <h3>
                <p className="error-msg" style={{ display: "none", color: "red", justifyContent: "center", marginTop: "1.5rem", marginBottom: "1.5rem" }}>
                </p>
            </h3>
        </section>
        </>
    );
};