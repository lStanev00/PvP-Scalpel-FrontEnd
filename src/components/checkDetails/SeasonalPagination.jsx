import { useEffect, useState } from "react";
import Style from "../../Styles/modular/SeasonalPagination.modlule.css"

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

        setPaginatedData(shadowResult);
        setCurrentPage(shadowResult[0]);
    }, [seasonalAchievesMap]);

    if (!seasonalAchievesMap || !currentPage) return null;

    return (
        <>
            <div>
                <h2>Seasonal Achievements - Page {currentPageIndex + 1}</h2>
                {currentPage.map(([expansion, seasonData]) => (
                    <div key={expansion}>
                        <h3>{expansion}</h3>
                        {/* You can render the seasonData here */}
                    </div>
                ))}
            </div>
        </>
    );
}
