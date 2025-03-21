import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import Style from "./../Styles/modular/charDetails.module.css"
import TableStyle from "./../Styles/modular/checkDetailsPvPTable.module.css"

export default function CharDetails() {
    const [data, setData] = useState(undefined);
    const { server, realm, name } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiEndpoint = `https://api.pvpscalpel.com/checkCharacter/${server}/${realm}/${name}`;
                const response = await fetch(apiEndpoint);
    
                if (!response.ok) return setData(undefined);
    
                const fetchData = await response.json();
                if (response.status === 202) fetchData["nowUpdating"] = true;
    
                setData(fetchData);
            } catch (error) {
                console.error("Fetch error:", error);
                setData(undefined);
            }
        };
    
        fetchData();
    }, []);


    if (!data) return (<>LOADING......</>);
    // Sort PvP Ratings into Categories
    const shuffleRatings = {};
    const blitzRatings = {};
    const otherRatings = {};

    Object.entries(data.rating).forEach(([bracketKey, bracketData]) => {
        if (bracketKey.includes("shuffle")) {
            shuffleRatings[bracketKey] = bracketData;
        } else if (bracketKey.includes("blitz")) {
            blitzRatings[bracketKey] = bracketData;
        } else {
            otherRatings[bracketKey] = bracketData;
        }
    });

    return (
        <>
            <section style={{backgroundImage: `url('${data.media.charImg}')`, backgroundPosition: 'center'}} className={"container"}>
                {/* Character Banner */}
                <div className={Style["banner"]}>
                    <img src={data.media.avatar} alt="Character Avatar" />
                    <div className={Style["banner-content"]}>
                        <strong>{data.name} - {data.playerRealm.name}</strong>
                        <span>{data.race} | Level {data.level} | {data.class.name} ({data.activeSpec.name})</span>
                    </div>
                    <span className={Style["last-updated"]}>Last updated: {timeAgo(data.updatedAt)}</span>
                    <button className={Style["button"]}>{data.nowUpdating ?  "Updating now!" : "Update Now"}</button>
                </div>
                <section className={Style["pvp-div"]}>

                <section className={Style["pvp-section"]}>
                    {/* General PvP Ratings Section (2v2, 3v3, RBG) */}
                    {Object.keys(otherRatings).length > 0 && (
                        <div className={Style["section"]}>
                            <h1>PvP Ratings</h1>
                            <div className={Style["pvp-container"]}>
                                {Object.entries(otherRatings).map(([key, bracket]) => {
                                    let title = String;
                                    if (key ==`rbg`) {
                                        title = `Rated Battleground`;
                                        bracket.achieves = data.achieves?.RBG?.XP
                                    } else if (key == `2v2`) {
                                        title = `Arena 2v2`;
                                        bracket.achieves = data?.achieves['2s']
                                    } else {
                                        title = `Arena 3v3`;
                                        bracket.achieves = data?.achieves['3s']
                                    }
                                    return renderPvPCard(title, bracket)
                                    })}
                            </div>
                        </div>
                    )}
                </section>

                <section className={Style["pvp-section"]}>
                
                {/* Blitz Section */}
                {Object.keys(blitzRatings).length > 0 && (
                    <div className={Style["section"]}>
                        <h1>Blitz Ratings</h1>
                        <div className={Style["pvp-container"]}>
                            {Object.entries(blitzRatings).map(([key, bracket]) => {
                                let [bracketName, charClass, spec] = key.split(`-`);
                                const title = spec.replace(/^./, match => match.toUpperCase());
                                bracket.achieves = data?.achieves.Blitz?.XP
                                return renderPvPCard(title, bracket)
                            })}
                        </div>
                    </div>
                )}
                </section>


                <section className={Style["pvp-section"]}>

                {/* Solo Shuffle Section */}
                {Object.keys(shuffleRatings).length > 0 && (
                    <div className={Style["section"]}>
                        <h1>Solo Shuffle Ratings</h1>
                        <div className={Style["pvp-container"]}>
                            {Object.entries(shuffleRatings).map(([key, bracket]) => {
                                let [bracketName, charClass, spec] = key.split(`-`);
                                const title = spec.replace(/^./, match => match.toUpperCase());
                                return renderPvPCard(title, bracket)
                            })}
                        </div>
                    </div>
                )}
                </section>

                </section>



                {/* Achievements Section */}
                <div className={Style["section"]}>
                    <h1>Achievements ({data.achieves.points} Points)</h1>
                    <div className={Style["card"]}>
                        <img src="https://render.worldofwarcraft.com/eu/icons/56/achievement_arena_2v2_4.jpg" alt="Achievement" />
                        <div className={Style["card-content"]}>
                            <strong>Just the Two of Us: 1750</strong>
                            <span>Earn a 1750 personal rating in the 2v2 bracket of the arena.</span>
                        </div>
                    </div>
                </div>

                {/* Talent Trees Section */}
                <div className={Style["section"]}>
                    <h3>Talent Trees</h3>
                    <button className={Style["button"]}>Copy Talent Code</button>
                    <p>Protection Warrior Talents</p>
                </div>
            </section>
        </>
    );
}

// Function to Render PvP Cards
function renderPvPCard(title, bracketData) {
    return (
        <div key={title} className={Style["pvp-card"]}>
            <section className={Style["inner-section"]}>

                
            <div className={Style["spec-border-div"]}>
                <p className={Style["spec-title"]}>{title}</p>
            </div>
            <div className={Style["pvp-spec"]}>
            {/* This Season */}
                
                <div className={Style["pvp-details"]}>
                    <p>Rating</p>
                    <img src={bracketData.currentSeason.title.media} alt="PvP Rank Icon" />
                    <div className={Style["pvp-card-info"]}>
                        <strong>{bracketData.currentSeason.title.name}</strong>
                        <span className={Style["pvp-rating"]}> {bracketData.currentSeason.rating}</span>  
                    </div>

                </div>

                {/* XP */}

                {bracketData.achieves && (
                    <div className={Style["pvp-details"]}>
                        <p>Record</p>
                        <img src={bracketData.achieves.media} alt="PvP Rank Icon" />
                        <div className={Style['pvp-card-info']}>
                            <strong>{bracketData.achieves.name}</strong>
                            {bracketData.record && (<span className={Style["pvp-rating"]}> {bracketData.record}</span>)}
                        </div>
                    </div>

                )}
            </div>

            {/* Matches Played Stats */}
            <table className={TableStyle["pvp-table"]}>
                <thead>
                    <tr>
                        <th></th>
                        <th>Weekly</th>
                        <th>Season</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td>Played</td>
                        <td>{bracketData.currentSeason.weeklyMatchStatistics.played}</td>
                        <td>{bracketData.currentSeason.seasonMatchStatistics.played}</td>
                    </tr>
                    <tr>
                        <td>Won</td>
                        <td>{bracketData.currentSeason.weeklyMatchStatistics.won}</td>
                        <td>{bracketData.currentSeason.seasonMatchStatistics.won}</td>
                    </tr>
                    <tr>
                        <td>Lost</td>
                        <td>{bracketData.currentSeason.weeklyMatchStatistics.lost}</td>
                        <td>{bracketData.currentSeason.seasonMatchStatistics.lost}</td>
                    </tr>
                </tbody>
            </table>
            </section>

        </div>
    );
}


// Function to Convert Timestamp to Human Readable Format
function timeAgo(updatedAt) {
    const updatedTime = new Date(updatedAt).getTime();
    const now = Date.now();
    const diff = now - updatedTime;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day(s) ago`;
    if (hours > 0) return `${hours} hour(s) ago`;
    if (minutes > 0) return `${minutes} minute(s) ago`;
    return `${seconds} second(s) ago`;
}