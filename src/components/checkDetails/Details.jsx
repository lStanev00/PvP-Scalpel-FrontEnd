import { useContext, useState, useOptimistic, useRef, useEffect, createContext } from "react";
import Style from '../../Styles/modular/charDetails.module.css';
import ReloadBTN from "./reloadBTN";
import PvPCards from "./PvPCards";
import PostTemplate from "./PostTemplate";
import NewPostForm from "./NewPostForm";
import { UserContext } from "../../hooks/ContextVariables";
import { useSearchParams } from "react-router-dom";
import { CharacterContext } from "../../pages/CharDetails";
import UserDataContainer from "./UserDataContainer";

export const DetailsProvider = createContext();

export default function Details() {
    const {user} = useContext(UserContext);
    const {data} = useContext(CharacterContext);
    const [isUpdating, setUpdating] = useState(false);
    const [posts, setPosts] = useState(data.posts);
    const [optimisticPosts, addOptimisticPost] = useOptimistic(
        posts,
        (currentPosts, newPost) => [...currentPosts, newPost]
    );
    const commentsRef = useRef([]);
    const [lookingForComment, setLFCom] = useSearchParams();

    useEffect(() => {

        try {
            const commentID = lookingForComment.get(`comment`);
            if (!commentID) return
    
            const div = commentsRef?.current[commentID];
    
            div.scrollIntoView({ behavior: "smooth" });

            // Save original styles
            const originalBorder = div.style.border;
    
            // Apply new styles
            div.style.border = "2px solid rgba(255, 204, 0, 0.6)";
    
            // Revert after 3 secs
            setTimeout(() => {
                div.style.border = originalBorder;
            }, 3000);
    
        } catch (error) {
            return
        }


    }, [lookingForComment])

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
            <DetailsProvider.Provider value={{optimisticPosts, addOptimisticPost, setPosts, posts}} >


                {/* Character Banner */}
                <div className={Style["banner"]}>
                        <img src={data.media.avatar} alt="Character Avatar" />
                        <div className={Style["banner-content"]}>
                            <strong>{data.name} - {data.playerRealm.name}</strong>
                            <span>{data.race} | Level {data.level} | {data.class.name} ({data.activeSpec.name})</span>
                        </div>
                        <ReloadBTN isUpdating={isUpdating} setUpdating={setUpdating} />
                </div>

                <UserDataContainer />
    
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
    
    
    
                    {/* Posts Section */}
                    {optimisticPosts && (<>
                        <section className={Style[`post-section`]}>
                        <h1>Comments</h1>
    
                    <div className={Style["post-section-wrap"]}>
                        
                        {optimisticPosts.length == 0 && (<>
                            
                            <p style={{textAlign:"center", fontWeight:"bold"}}>No comments yet! Be the first to submit one.</p>

                        </>
                        )}
                       {optimisticPosts.length > 0 && Object.entries(optimisticPosts).map(([key, post]) => {
                           return (
                            <div
                                style={{}}
                                ref={(el) => commentsRef.current[post._id] = el}
                                key={post._id} 
                            >

                                <PostTemplate 
                                postValue={post} 
                                optimistic={post.isOptimistic ? true : false}
                                />
                            </div>)
                        })
                       }
                       
                    </div>
                        </section>
                    </> 
                    )}

                    <NewPostForm characterID={data._id}/>
    
                    
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
            </DetailsProvider.Provider>
        );
}