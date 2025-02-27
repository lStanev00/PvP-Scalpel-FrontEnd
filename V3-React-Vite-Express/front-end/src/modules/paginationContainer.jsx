import { useState } from "react";
import paginationStyles from '../Styles/pagination.module.css';


export default function PaginatioContainer ({ data, page ,setPage }) {
    const [pageCounter, setCounter] = useState(1);

    if (!data) return (<></>);

    return (
                <div className={paginationStyles["pagination-container"]}>
                    <button className={paginationStyles["pagination-btn"]} disabled>« First</button>
                    <button className={paginationStyles["pagination-btn"]} disabled>‹ Prev</button>
                    <span className={paginationStyles["pagination-info"]}>Page {pageCounter} of {data.length}</span>
                    <button className={paginationStyles["pagination-btn"]}>Next ›</button>
                    <button className={paginationStyles["pagination-btn"]}>Last »</button>
                </div>
    )
}