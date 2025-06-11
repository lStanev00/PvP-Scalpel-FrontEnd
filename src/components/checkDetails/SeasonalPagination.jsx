import { useEffect, useState } from "react";
import Style from "../../Styles/modular/SeasonalPagination.module.css"
import {AchievementDiv} from "./Achievements.jsx";
import { v4 as uuidv4 } from 'uuid';


export default function SeasonalPagination({ seasonalAchievesMap }) {
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [currentPage, setCurrentPage] = useState(undefined);
    const [paginatedData, setPaginatedData] = useState([]);

    useEffect(() => {
        if (!seasonalAchievesMap || seasonalAchievesMap.size === 0) return;

        let pageAdded = 0;
        const shadowResult = [];
        let pageShadow = [];

        for (const entry of seasonalAchievesMap.entries()) {
            if (pageAdded >= 2) {
                shadowResult.push(pageShadow);
                pageShadow = [];
                pageAdded = 0;
            }

            pageShadow.push(entry);
            pageAdded += 1;
        }

        if (pageShadow.length > 0) shadowResult.push(pageShadow);

        setPaginatedData(() => shadowResult);
        setCurrentPage(() => 0);
        setCurrentPage(() => shadowResult[currentPageIndex]);
    }, [seasonalAchievesMap]);

    if (!seasonalAchievesMap || !currentPage) return null;

    return (
        <>
                    {seasonalAchievesMap.size !== 0 && (

                        <div className={Style.seasonalContainer}>
                            <h1>Seasonal Achievements</h1>
                            <div className={Style.pageContent}>

                                {Array.from(currentPage).map(([key, value]) => {
                                    if (key === "noSeason") return null;
                                    return (
                                    <div key={uuidv4()} className={Style.seasonalMain}>
                                        <h2>{key}</h2>
                                        <div className={Style.seasonalAchieves}>
                                            {value && Object.entries(value).map(([seasonIndex, achList]) => (
                                                achList.map(ach => {

                                                    if(!ach.criteria) {
                                                        <AchievementDiv key={uuidv4()} seasonal={true} achData={ach} />

                                                    }

                                                    try {
                                                        
                                                        return (
                                                            <AchievementDiv key={(ach._id || ach.criteria || ach.name).replace(/\s+/g, "-")} seasonal={true} achData={ach} />
                                                        )
                                                    } catch (error) {
                                                    return <AchievementDiv key={ach._id ||ach.criteria} seasonal={true} achData={ach} />

                                                    }

                                                })
                                            ))}
                                        </div>
                                    </div>
                                    );
                                })}


                            </div>
                                <div className={Style.navDiv}>
                                    <button
    	                                disabled={currentPageIndex == 0 ? `true` : "false"}
                                    >First Page
                                    </button>

                                    <button
    	                                disabled={currentPageIndex == 0 ? `true` : "false"}
                                    >
                                        {"< Prev"}
                                    </button>

                                    <p>{currentPageIndex + 1}</p>

                                    <button
                                    >
                                        {"Next >"}
                                    </button>

                                    <button
                                    >
                                        Last Page
                                    </button>
                                </div>

                </div>
                )}
        </>
    );
}
