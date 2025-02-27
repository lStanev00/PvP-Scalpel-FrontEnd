import { useState, useEffect } from "react";
import paginationStyles from '../Styles/pagination.module.css'

export default function LDB() {
    const [data, setData] = useState([]);
    const [page, setPage] = useState([]);
    useEffect(() => {
        
        async function fetchData() {
            let reqData;
            const res = await fetch(`https://api.pvpscalpel.com/LDB/blitz`);
            reqData = await res.json();
            let rank = 1;
            const paginatedData = [];
        
            for (let i = 0; i < reqData.length; i += 25) {
                const page = reqData.slice(i, i + 25);
                let pageMap = []
                    for (const char of page) {
                        let XP = undefined;
                        
                        const achieves = char?.achieves?.BG;
                        if(achieves){
                            for (const { name, description, _id } of achieves) {
                                
                                if ((name).includes(`Hero of the Alliance`) || (name).includes(`Hero of the Horde`)) {
                                    XP = {
                                        _id: _id,
                                        name: name,
                                    }
                                    break;
                                } else if(description.includes(`Earn a rating of`)) {
                                    XP = {_id: _id, name: name};
                                    const numXP = description.replace(`Earn a rating of `, ``)
                                    .replace(` in either Rated Battlegrounds or Rated Battleground Blitz.`, ``);
    
                                    XP.description = numXP;
                                    break;
                                }
                            }
                            char.XP = XP
                            
                            char.ladderRank = rank;
                            pageMap.push(char)
                            rank = rank + 1;
                        };
                    }
                    paginatedData.push(pageMap);
                
                }
                setData(paginatedData);
                setPage(paginatedData[0])
            
        }
        
        fetchData()
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

        <BlitzTableContent key={`blitz-LDB`} page={page} />

        <div className={paginationStyles["pagination-container"]}>
            <button className={paginationStyles["pagination-btn"]} disabled>« First</button>
            <button className={paginationStyles["pagination-btn"]} disabled>‹ Prev</button>
            <span className={paginationStyles["pagination-info"]}>Page 1 of {data.length}</span>
            <button className={paginationStyles["pagination-btn"]}>Next ›</button>
            <button className={paginationStyles["pagination-btn"]}>Last »</button>
        </div>


        </>
    );
};

function BlitzTableContent({  page  }) {
    function CharXP({  XP  }) {
       
        if (XP) {
            if (XP.description) {
                return (
                    
                        <td key={XP._id}>{XP.name}<br /><b>{XP.description}</b></td>
                    
                )
            } else {
                return (
                    
                        <td key={XP._id}>{XP.name}</td>
                    
                )
            }
        } else {
            return (
                
                    <td>No XP Yet</td>
                
            )
        }
    }
    try {
        return (
            <>
            <table className="leaderboard-table" id="leaderboard">
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Spec</th>
                        <th>Blitz Rating</th>
                        <th>BG XP</th>
                    </tr>
                </thead>
    
                <tbody id="leaderboard-body">
                    {
                    page.map(char =>{
                        return (
                            
                              <tr key={char?._id}>
                            <td>
                                <img style={{width: '3rem', height: '3rem'}} alt="Char IMG" src={char?.media?.avatar} />
                            </td>
                            <td><b>{char?.ladderRank}.</b> {char?.name}</td>
                            <td><b>{char?.spec}</b> ({char?.class})</td>
                            <td>{char?.rating.solo_bg}</td>
                                <CharXP key={char?.ladderRank} XP={char?.XP} />
                            {/* <td>Grand Marshal<br /><b> 2400</b></td> */}
                        </tr>
                            
                        )}
                    )}
    
                </tbody>
    
            </table>
            </>
        )
        
    } catch (error) {
        return(<></>)
    }
}