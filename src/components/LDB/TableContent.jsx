import { useNavigate } from "react-router-dom";
import CharXP from "./CharXP";

export default function TableContent({  page, content, refs  }) {
    const navigate = useNavigate();
    const clickIt = (realm, name) => {navigate(`/check/eu/${realm}/${name}`)}

    if (content == `blitzContent`){
        try {
            return (
                <>
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
                            const rating = ((Object.entries(char.rating))[0][1]).currentSeason.rating
                            return (
                                
                                  <tr onClick={() => {clickIt(char.playerRealm.slug, char.name)}} key={char?._id} ref={el => (refs.current[char?._id] = el)}>
                                <td>
                                    <img style={{width: '3rem', height: '3rem'}} alt="Char IMG" src={char?.media?.avatar} />
                                </td>
                                <td><b>{char?.ladderRank}.</b> {char?.name}</td>
                                <td><b>{char?.spec}</b> ({char?.class})</td>
                                <td>{rating}</td>
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
                            const rating = ((Object.entries(char.rating))[0][1]).currentSeason.rating;
                            return (
                                
                            <tr onClick={() => {clickIt(char.playerRealm.slug, char.name)}} key={char?._id} ref={el => (refs.current[char?._id] = el)}>
                                <td>
                                    <img style={{width: '3rem', height: '3rem'}} alt="Char IMG" src={char?.media?.avatar} />
                                </td>
                                <td><b>{char?.ladderRank}.</b> {char?.name}</td>
                                <td><b>{char?.spec}</b> ({char?.class})</td>
                                <td>{rating}</td>
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
                                
                                  <tr onClick={() => {clickIt(char.playerRealm.slug, char.name)}} key={char?._id} ref={el => (refs.current[char?._id] = el)}>
                                <td>
                                    <img style={{width: '3rem', height: '3rem'}} alt="Char IMG" src={char?.media?.avatar} />
                                </td>
                                <td><b>{char?.ladderRank}.</b> {char?.name}</td>
                                <td><b>{char?.activeSpec?.name}</b> ({char?.class?.name})</td>
                                <td>{char?.rating?.['2v2']?.currentSeason?.rating}</td>
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
    } else if (content === `3v3Content`) {
        try {
            return (
                <>
                    <br />
                
                <table className="leaderboard-table" id="leaderboard">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Spec</th>
                            <th>3v3 Rating</th>
                            <th>Arena XP</th>
                        </tr>
                    </thead>
        
                    <tbody id="leaderboard-body">
                        {
                        page.map(char =>{
                            return (
                                
                                  <tr onClick={() => {clickIt(char.playerRealm.slug, char.name)}} key={char?._id} ref={el => (refs.current[char?._id] = el)}>
                                <td>
                                    <img style={{width: '3rem', height: '3rem'}} alt="Char IMG" src={char?.media?.avatar} />
                                </td>
                                <td><b>{char?.ladderRank}.</b> {char?.name}</td>
                                <td><b>{char?.activeSpec?.name}</b> ({char?.class?.name})</td>
                                <td>{char?.rating?.['3v3'].currentSeason?.rating}</td>
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
    } else if (content == `BGContent`){
        try {
            return (
                <>
                    <br />
                
                <table className="leaderboard-table" id="leaderboard">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Spec</th>
                            <th>Rated BG Rating</th>
                            <th>BG XP</th>
                        </tr>
                    </thead>
        
                    <tbody id="leaderboard-body">
                        {
                        page.map(char =>{
                            return (
                                
                                  <tr onClick={() => {clickIt(char.playerRealm.slug, char.name)}} key={char?._id} ref={el => (refs.current[char?._id] = el)}>
                                <td>
                                    <img style={{width: '3rem', height: '3rem'}} alt="Char IMG" src={char?.media?.avatar} />
                                </td>
                                <td><b>{char?.ladderRank}.</b> {char?.name}</td>
                                <td><b>{char?.activeSpec?.name}</b> ({char?.class?.name})</td>
                                <td>{char?.rating.rbg.currentSeason.rating}</td>
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
    }
}