import { useState } from "react";
import paginationStyles from '../../Styles/modular/pagination.module.css';

export default function PaginatioContainer ({ data, page ,setPage }) {
    const [pageCounter, setCounter] = useState(1);

    const nextPage = (e) => {
        setCounter(page => {
            const newValue = page + 1
            setPage(data[newValue - 1]);
            return newValue
        });

    }

    const lastPage = (e) => {
        setCounter((data.length));
        setPage(data[data.length - 1]);
    }

    const prevPage = (e) => {
        setCounter(page => {
            const newValue = page - 1;
            setPage(data[newValue - 1]);
            return newValue
        })
    }

    const firstPage = (e) => {
        setCounter(page => {
            const newValue = 1;
            setPage(data[0]);
            return newValue
        })
    }
    

    if (!data) return (<></>);

    return (
                <div className={paginationStyles["pagination-container"]}>
                    <button onClick={firstPage} className={paginationStyles["pagination-btn"]} disabled = {pageCounter === 1}>« First</button>
                    <button onClick={prevPage} className={paginationStyles["pagination-btn"]} disabled = {pageCounter === 1}>‹ Prev</button>
                    <span className={paginationStyles["pagination-info"]}>Page {pageCounter} of {data.length}</span>
                    <button onClick={nextPage} disabled = {pageCounter === (data.length)} className={paginationStyles["pagination-btn"] }>Next ›</button>
                    <button onClick={lastPage} disabled = {pageCounter === (data.length)} className={paginationStyles["pagination-btn"]}>Last »</button>
                </div>
    )
}