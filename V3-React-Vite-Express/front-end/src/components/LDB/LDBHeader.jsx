export default function LDBHeaderContent({  content  }) {

    if (content == `blitzContent`){
        return (<>
            <h1 className="leaderboard-title">PvP Leaderboard</h1>
            <h3 id="bracket-title">-\* Blitz BG */-</h3>
            </>)
} else if (content ===`shuffleContent`) {
    return (<>
        <h1 className="leaderboard-title">PvP Leaderboard</h1>
        <h3 id="bracket-title">-\* Solo Shuffle */-</h3>
        </>)
} else if (content ===`2v2Content`) {
    return (<>
        <h1 className="leaderboard-title">PvP Leaderboard</h1>
        <h3 id="bracket-title">-\* 2V2 */-</h3>
        </>)
} else if (content ===`3v3Content`) {
    return (<>
        <h1 className="leaderboard-title">PvP Leaderboard</h1>
        <h3 id="bracket-title">-\* 3V3 */-</h3>
        </>)
}
}