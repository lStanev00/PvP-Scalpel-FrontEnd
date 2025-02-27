import CharXP from "./CharXP";

export default function TableContent({  page  }) {
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