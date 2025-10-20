import Style from "../../Styles/modular/LDBHeader.module.css"

export default function LDBHeaderContent({ content }) {
    const bracketNames = {
        blitzContent: "Blitz Battleground",
        shuffleContent: "Solo Shuffle",
        "2v2Content": "2v2 Arena",
        "3v3Content": "3v3 Arena",
        BGContent: "Rated Battleground",
    }

    const bracketTitle = bracketNames[content] || "Leaderboard"

    return (
        <div className={Style.headerWrapper}>
            <h1 className={Style.mainTitle}>PvP Leaderboard</h1>
            <div className={Style.subWrapper}>
                <span className={Style.subLine}></span>
                <h3 className={Style.subTitle}>{bracketTitle}</h3>
                <span className={Style.subLine}></span>
            </div>
        </div>
    )
}