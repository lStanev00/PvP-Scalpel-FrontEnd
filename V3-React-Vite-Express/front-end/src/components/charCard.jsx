export default function CharCard({ charArr }){
    return (
        <>
        <div className="roster-container" id="rosterContainer">
            {charArr.map(char => 
                            <div className="character-card" key={char._id}>
                            <img alt="No img in blizzard's API" src={char.media?.banner} />
                            <div className="character-details">
                                <h3>{char.name}</h3>
                                <p>Guild Rank: {char.rank}</p>
                            </div>
                </div>
            )}
        </div>
        </>
    )
}