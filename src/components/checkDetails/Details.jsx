import { useContext, useState } from "react";
import Style from "../../Styles/modular/charDetails.module.css";
import ReloadBTN from "./reloadBTN.jsx";
import { CharacterContext } from "../../pages/CharDetails.jsx";
import UserDataContainer from "./UserDataContainer.jsx";
import StatsChart from "./StatsChart.jsx";
import AchevementsSection from "./Achievements.jsx";
import TalentsSection from "./TallentsSection.jsx";
import Armory from "./Armory.jsx";
import PvPRatingsSection from "./PvPRatingsSection.jsx";
import Comments from "./Comments.jsx";
import { CommentsProvider } from "./CommentsContext.js";

export function Details() {
    const { data, location } = useContext(CharacterContext);
    const [isUpdating, setUpdating] = useState(false);

    // Missing data case on brute tests appearing 0/1000 so wont overengineer this case
    if (data?.errorMSG) return <h1>{data.errorMSG}</h1>;

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
                    entry.name.includes("Strategist"),
                );
                if (strategistExist) {
                    if (blitzRatings[bracketKey]) {
                        blitzRatings[bracketKey].achieves = {
                            name: "Strategist",
                            media: strategistExist?.media,
                        };
                    }
                }
            }
        } else if (bracketKey == `2v2` || bracketKey == `3v3` || bracketKey == `rbg`) {
            // const rating = bracketData?.currentSeason?.rating;
            // const shouldSkip =
            //     (!bracketData?.achieves && rating === 0) || rating === undefined;

            // if (!shouldSkip) {
            // }
            otherRatings[bracketKey] = bracketData;
        }
    });

    return (
        <CommentsProvider initialPosts={data?.posts} entryID={data?._id}>
            <div>
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
                    }
                >
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

                    <UserDataContainer contextWindow={{ data, location }} />

                    <section className={Style.statsFeed}>
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
                        <Armory ParentStyle={Style} />
                    </section>
                </div>
                <Comments />
            </div>
        </CommentsProvider>
    );
}
