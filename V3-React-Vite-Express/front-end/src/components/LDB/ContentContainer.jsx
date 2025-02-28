import LDBHeaderContent from "./LDBHeader";
import LDBSearch from "./LDBSearch";
import TableContent from "./TableContent";
import PaginatioContainer from "./paginationContainer";
export default function ContentContainer({ data, content, page, setPage }) {
    if (data) {return (
        
        <section className="leaderboard-container" style={{visibility: content ? `visible` : `hidden`}}>
            <LDBHeaderContent content={content} />
            <LDBSearch data={data} setPage={setPage}/>
            <TableContent page={page} content={content}/>
            <PaginatioContainer data={data} page={page} setPage={setPage} />
        </section>

    )} else return null;
}