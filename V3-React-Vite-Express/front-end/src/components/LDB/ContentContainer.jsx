import LDBHeaderContent from "./LDBHeader";
import LDBSearch from "./LDBSearch";
import TableContent from "./TableContent";
import PaginatioContainer from "./paginationContainer";
import { useRef } from "react";
export default function ContentContainer({ data, content, page, setPage }) {
    const refs = useRef({});

    if (data) {return (
        
        <section className="leaderboard-container" style={{visibility: content ? `visible` : `hidden`}}>
            <LDBHeaderContent content={content} />
            <LDBSearch data={data} setPage={setPage} refs={refs}/>
            <TableContent page={page} content={content} refs={refs}/>
            <PaginatioContainer data={data} page={page} setPage={setPage} />
        </section>

    )} else return null;
}