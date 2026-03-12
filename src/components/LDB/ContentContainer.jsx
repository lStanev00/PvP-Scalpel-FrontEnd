import Loading from "../loading";
import LDBSearch from "./LDBSearch";
import TableContent from "./TableContent";
import WeeklyTop from "./WeeklyTopLadder";
import PaginatioContainer from "./paginationContainer";
import { useRef } from "react";
import Style from "../../Styles/modular/Leaderboard.module.css";

export default function ContentContainer({ data, content, page, setPage }) {
    const refs = useRef({});

    if (data === undefined) return <Loading />;

    return (
        <section
            className={`${Style.leaderboardContainer} ${content ? Style.fadeIn : Style.fadeOut}`}
            style={{ visibility: content ? "visible" : "hidden" }}>
            {/* Main Table aStnd Search */}
            <div className={Style.mainContent}>
                <div className={Style.MainLDB}>
                    <LDBSearch data={data} setPage={setPage} refs={refs} />
                    <TableContent page={page} content={content} refs={refs} />
                    <PaginatioContainer data={data} page={page} setPage={setPage} />
                </div>
                <aside className={Style.sidePanel}>
                    <WeeklyTop content={content} />
                </aside>
            </div>

            {/* Sticky Weekly Top Sidebar */}
        </section>
    );
}
