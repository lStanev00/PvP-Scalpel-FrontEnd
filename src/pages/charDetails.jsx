import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import Style from "./../Styles/modular/charDetails.module.css"
import ReloadBTN from "../components/checkDetails/reloadBTN.jsx";
import PvPCards from "../components/checkDetails/PvPCards.jsx";
import httpFetch from "../helpers/httpFetch.js";

export default function CharDetails() {
    const [data, setData] = useState(undefined);
    const { server, realm, name } = useParams();
    const [isUpdating, setUpdating] = useState(false);


    const getCharacterData = async () => { // This will be a websocket in the future
        try {
            const apiEndpoint = `/checkCharacter/${server}/${realm}/${name}`;
            let response = await httpFetch(apiEndpoint);

            if (!response.ok) return setData(undefined);
            const fetchData = await response.json();

            if (response.status == 404) return setData({errorMSG : fetchData.messege});

            setData(fetchData);
        } catch (error) {
            console.error("Fetch error:", error);
            setData(404);
        }
    };

    useEffect(() => {getCharacterData()}, []);

    if (data === undefined) return (<>LOADING......</>);

    if (data.errorMSG) return (
        <>
            <h1>
                {data.errorMSG}
            </h1>
        </>
    );
    // Sort PvP Ratings into Categories
    const shuffleRatings = {};
    const blitzRatings = {};
    const otherRatings = {};

    Object.entries(data.rating).forEach(([bracketKey, bracketData]) => {
        if (bracketKey.includes("shuffle")) {
            shuffleRatings[bracketKey] = bracketData;
        } else if (bracketKey.includes("blitz")) {
            blitzRatings[bracketKey] = bracketData;
        } else if (bracketKey == `2v2` || bracketKey == `3v3` || bracketKey == `rbg`){
            otherRatings[bracketKey] = bracketData;
        }
    });

    return (
        <>
            {/* Character Banner */}
            <div className={Style["banner"]}>
                    <img src={data.media.avatar} alt="Character Avatar" />
                    <div className={Style["banner-content"]}>
                        <strong>{data.name} - {data.playerRealm.name}</strong>
                        <span>{data.race} | Level {data.level} | {data.class.name} ({data.activeSpec.name})</span>
                    </div>
                    <ReloadBTN setData={setData} data={data} isUpdating={isUpdating} setUpdating={setUpdating} />
            </div>

            <section style={
                {
                    backgroundImage: `url('${data.media.charImg}')`,
                    backgroundPosition: 'center -100px',
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundAttachment: 'fixed',
                    overflow: "hidden",
                    filter: isUpdating ? 'blur(5px)' : 'none'
                }} 
                className={"container"}
                >

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
                                    return <PvPCards key={bracket._id} title = {title} bracketData = {bracket} Style={Style}/>
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
                                return <PvPCards key={bracket._id} title = {title} bracketData = {bracket} Style={Style}/>
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
                                return <PvPCards key={bracket._id} title = {title} bracketData = {bracket} Style={Style}/>

                            })}
                        </div>
                    </div>
                )}
                </section>

                </section>



                {/* Achievements Section */}
                {/* <div className={Style["section"]}>
                    <h1>Achievements ({data.achieves.points} Points)</h1>
                    <div className={Style["card"]}>
                        <img src="https://render.worldofwarcraft.com/eu/icons/56/achievement_arena_2v2_4.jpg" alt="Achievement" />
                        <div className={Style["card-content"]}>
                            <strong>Just the Two of Us: 1750</strong>
                            <span>Earn a 1750 personal rating in the 2v2 bracket of the arena.</span>
                        </div>
                    </div>
                </div> */}

                {/* Talent Trees Section */}
                {/* <div className={Style["section"]}> */}
                    {/* <h3>Talent Trees</h3>
                    <button className={Style["button"]}>Copy Talent Code</button>
                    <p>Protection Warrior Talents</p>
                </div> */}
            </section>
        </>
    );
}