export default function LDBHeaderContent({  content  }) {

    if (content == `blitzContent`){
        return (<>
            <h1 className="leaderboard-title">PvP Leaderboard</h1>
            <h3 id="bracket-title">-\* Blitz BG */-</h3>
            </>)
    }
}