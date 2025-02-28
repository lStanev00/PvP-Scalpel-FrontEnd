import CharXP from "./CharXP";

export default function TableContent({  page, content  }) {

    if (content == `blitzContent`){
        try {
            return (
                <>
                    <div className="search-container">
                        <input type="text" id="searchInput" className="search-input" placeholder="Search for a character..." />
                        <button id="searchBtn" className="search-btn">Clear</button>
                        <ul id="suggestions"></ul>
                    </div>
                    <h3>
                        <p className="error-msg" style={{ display: "none", color: "red", justifyContent: "center", marginTop: "1.5rem", marginBottom: "1.5rem" }}>
                        </p>
                    </h3>
                    <br />
                
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
    } else if (content === `shuffleContent`) {
        try {
            return (
                <>
                    <div className="search-container">
                        <input type="text" id="searchInput" className="search-input" placeholder="Search for a character..." />
                        <button id="searchBtn" className="search-btn">Clear</button>
                        <ul id="suggestions"></ul>
                    </div>
                    <h3>
                        <p className="error-msg" style={{ display: "none", color: "red", justifyContent: "center", marginTop: "1.5rem", marginBottom: "1.5rem" }}>
                        </p>
                    </h3>
                    <br />
                
                <table className="leaderboard-table" id="leaderboard">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Spec</th>
                            <th>Solo Shuffle Rateing</th>
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
                                <td>{char?.rating.solo}</td>
                            </tr>
                                
                            )}
                        )}
        
                    </tbody>
        
                </table>
                </>
            )
        } catch (error) {
            return (<></>)
        }
    } else if (content === `2v2Content`) {
        try {
            return (
                <>
                    <div className="search-container">
                        <input type="text" id="searchInput" className="search-input" placeholder="Search for a character..." />
                        <button id="searchBtn" className="search-btn">Clear</button>
                        <ul id="suggestions"></ul>
                    </div>
                    <h3>
                        <p className="error-msg" style={{ display: "none", color: "red", justifyContent: "center", marginTop: "1.5rem", marginBottom: "1.5rem" }}>
                        </p>
                    </h3>
                    <br />
                
                <table className="leaderboard-table" id="leaderboard">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Spec</th>
                            <th>2v2 Rating</th>
                            <th>Arena XP</th>
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
                                <td>{char?.rating?.['2v2']}</td>
                                <CharXP XP={char?.XP} />
                            </tr>
                                
                            )}
                        )}
        
                    </tbody>
        
                </table>
                </>
            )
        } catch (error) {
            return (<></>)
        }
    }
}