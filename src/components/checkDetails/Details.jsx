import { useContext, useState, useOptimistic, useRef, useEffect, createContext } from "react";
import Style from "../../Styles/modular/charDetails.module.css";
import ReloadBTN from "./reloadBTN.jsx";
import { useSearchParams } from "react-router-dom";
import { CharacterContext } from "../../pages/CharDetails.jsx";
import UserDataContainer from "./UserDataContainer.jsx";
import StatsChart from "./StatsChart.jsx";
import AchevementsSection from "./Achievements.jsx";
import TalentsSection from "./TallentsSection.jsx";
import Armory from "./Armory.jsx";
import PvPRatingsSection from "./PvPRatingsSection.jsx";
import Comments from "./Comments.jsx";

export const DetailsProvider = createContext();

export function Details() {
    const { data } = useContext(CharacterContext);
    const [isUpdating, setUpdating] = useState(false);
    const [posts, setPosts] = useState(data?.posts);
    const [optimisticPosts, addOptimisticPost] = useOptimistic(posts, (currentPosts, newPost) => [
        ...currentPosts,
        newPost,
    ]);
    const commentsRef = useRef([]);
    const [lookingForComment, setLFCom] = useSearchParams();

    useEffect(() => {
        try {
            const commentID = lookingForComment.get(`comment`);
            if (!commentID) return;

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
            return;
        }
    }, [lookingForComment]);

    if (data?.errorMSG)
        return (
            <>
                <h1>{data.errorMSG}</h1>
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
            const { listAchievements } = data;

            if (
                listAchievements &&
                Array.isArray(listAchievements) &&
                listAchievements.length > 0
            ) {
                const strategistExist = listAchievements.find((entry) =>
                    entry.name.includes("Strategist")
                );
                if (strategistExist) {
                    console.info(strategistExist);
                    if (blitzRatings[bracketKey]) {
                        blitzRatings[bracketKey].achieves = {
                            name: "Strategist",
                            media: strategistExist?.media,
                        };
                    }
                }
            }
        } else if (bracketKey == `2v2` || bracketKey == `3v3` || bracketKey == `rbg`) {
            if (
                (!bracketData?.achieves && bracketData?.currentSeason?.rating === 0) ||
                bracketData?.currentSeason?.rating === undefined
            ) {
            } else {
                otherRatings[bracketKey] = bracketData;
            }
        }
    });

    return (
        <div
            style={
                data.media === null
                    ? {
                          filter: isUpdating ? "blur(5px)" : "none",
                      }
                    : {
                          backgroundImage: `url('${data.media.charImg}')`,
                          backgroundPosition: "center",
                          backgroundSize: "cover",
                          backgroundRepeat: "no-repeat",
                          backgroundAttachment: "fixed",
                          overflow: "hidden",
                          filter: isUpdating ? "blur(5px)" : "none",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                      }
            }>
            <DetailsProvider.Provider
                value={{ commentsRef, optimisticPosts, addOptimisticPost, setPosts, posts, Style }}>
                {/* Character Banner */}
                <div className={Style["banner"]}>
                    <img src={data.media.avatar} alt="Character Avatar" />
                    <div className={Style["banner-content"]}>
                        <h3 className={Style.bannerCharName}>
                            {data.name} - {data.playerRealm.name}
                        </h3>
                        <span>
                            {data.race} | Level {data.level} | {data.class.name} (
                            {data.activeSpec.name}){" "}
                            {data.guildName && <>| Guild: {data.guildName}</>}
                        </span>
                    </div>
                    <ReloadBTN isUpdating={isUpdating} setUpdating={setUpdating} />
                </div>

                <UserDataContainer />

                <section className={Style.statsGrid}>
                    <PvPRatingsSection
                        otherRatings={otherRatings}
                        blitzRatings={blitzRatings}
                        shuffleRatings={shuffleRatings}
                        data={data}
                        Style={Style}
                    />
                    <AchevementsSection />
                </section>
                <section className={Style["armoryLayout"]}>
                    <div className={Style["armoryRight"]}>
                        <TalentsSection />
                        <StatsChart />
                    </div>
                    <Armory />
                </section>

                {/* Comments Section */}
                <Comments />
            </DetailsProvider.Provider>
        </div>
    );
}
