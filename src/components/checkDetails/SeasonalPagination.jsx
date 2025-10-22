import { useEffect, useState } from "react";
import Style from "../../Styles/modular/SeasonalPagination.module.css";
import { AchievementDiv } from "./Achievements.jsx";
import { v4 as uuidv4 } from "uuid";
import { FaAngleLeft, FaAngleRight, FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";

export default function SeasonalPagination({ seasonalAchievesMap }) {
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [currentPage, setCurrentPage] = useState(undefined);
    const [paginatedData, setPaginatedData] = useState([]);

    useEffect(() => {
        if (!seasonalAchievesMap || seasonalAchievesMap.size <= 1) return;
        const shadowResult = [];

        if (seasonalAchievesMap.size <= 2) {
            shadowResult.push([]);
            for (const entry of seasonalAchievesMap.entries()) {
                shadowResult[0].push(entry);
            }
        } else {
            let pageAdded = 0;
            let pageShadow = [];

            for (const entry of seasonalAchievesMap.entries()) {
                if (entry[0] === "noSeason") continue;
                if (pageAdded >= 1) {
                    shadowResult.push(pageShadow);
                    pageShadow = [];
                    pageAdded = 0;
                }

                pageShadow.push(entry);
                pageAdded += 1;
            }
            if (pageShadow.length > 0) shadowResult.push(pageShadow);
        }

        setPaginatedData(() => shadowResult);
        setCurrentPage(() => 0);
        setCurrentPage(() => shadowResult[currentPageIndex]);
    }, [seasonalAchievesMap]);

    useEffect(() => {
        if (paginatedData.length != 0) {
            setCurrentPage(paginatedData[currentPageIndex]);
        }
    }, [currentPageIndex, seasonalAchievesMap]);

    if (!seasonalAchievesMap || !currentPage) return null;

    return (
        <>
            {seasonalAchievesMap.size !== 0 && (
                <div className={Style.seasonalContainer}>
                    <h1>Achievements</h1>
                    <div className={Style.pageContent}>
                        {Array.from(currentPage).map(([key, value]) => {
                            if (key === "noSeason") return null;
                            return (
                                <div key={uuidv4()} className={Style.seasonalMain}>
                                    <h2>{key}</h2>
                                    <div className={Style.seasonalAchieves}>
                                        {value &&
                                            Object.entries(value).map(([seasonIndex, achList]) =>
                                                achList.map((ach) => {
                                                    if (!ach.criteria) {
                                                        <AchievementDiv
                                                            key={uuidv4()}
                                                            seasonal={true}
                                                            achData={ach}
                                                        />;
                                                    }

                                                    try {
                                                        return (
                                                            <AchievementDiv
                                                                key={(
                                                                    ach._id ||
                                                                    ach.criteria ||
                                                                    ach.name
                                                                ).replace(/\s+/g, "-")}
                                                                seasonal={true}
                                                                achData={ach}
                                                            />
                                                        );
                                                    } catch (error) {
                                                        return (
                                                            <AchievementDiv
                                                                key={ach._id || ach.criteria}
                                                                seasonal={true}
                                                                achData={ach}
                                                            />
                                                        );
                                                    }
                                                })
                                            )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {paginatedData.length > 1 && (
                        <div className={Style.paginationContainer}>
                            <button
                                disabled={currentPageIndex === 0}
                                onClick={() => setCurrentPageIndex(0)}
                                className={Style.navBtn}>
                                <FaAngleDoubleLeft />
                                <span>First</span>
                            </button>

                            <button
                                disabled={currentPageIndex === 0}
                                onClick={() => setCurrentPageIndex((now) => now - 1)}
                                className={Style.navBtn}>
                                <FaAngleLeft />
                                <span>Prev</span>
                            </button>

                            <p className={Style.pageInfo}>
                                Page <span>{currentPageIndex + 1}</span> /{" "}
                                <span>{paginatedData.length}</span>
                            </p>

                            <button
                                disabled={currentPageIndex === paginatedData.length - 1}
                                onClick={() => setCurrentPageIndex((now) => now + 1)}
                                className={Style.navBtn}>
                                <span>Next</span>
                                <FaAngleRight />
                            </button>

                            <button
                                disabled={currentPageIndex === paginatedData.length - 1}
                                onClick={() => setCurrentPageIndex(paginatedData.length - 1)}
                                className={Style.navBtn}>
                                <span>Last</span>
                                <FaAngleDoubleRight />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
