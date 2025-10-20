import { useState, useEffect } from "react";
import paginationStyles from '../../Styles/modular/pagination.module.css';
import { FaAngleDoubleLeft, FaAngleLeft, FaAngleRight, FaAngleDoubleRight } from "react-icons/fa";

export default function PaginatioContainer ({ data, page ,setPage }) {
    const [pageCounter, setCounter] = useState(1); 
    useEffect(() => {
        setPage(data[pageCounter - 1]);
    }, [pageCounter, data, setPage]);

    const nextPage = (e) => {
        setCounter(page => {
            const newValue = page + 1
            return newValue
        });

    }

    const lastPage = (e) => {
        setCounter(() => data.length);
    }

    const prevPage = (e) => {
        setCounter(page => {
            const newValue = page - 1;
            return newValue
        })
    }

    const firstPage = (e) => {
        setCounter(page => {
            const newValue = 1;
            return newValue
        })
    }

    useEffect(()=>{
        setPage(data[0]);
        setCounter(1)
    },[data])
    useEffect(()=>{// Helps to determine in which page we are now due to outside change like from the search logic
        let pageIdx = 0;
        for (const pg of data) {
            pageIdx = pageIdx + 1;
            if(pg === page) {
                setCounter(now => {
                    return pageIdx
                });
                return
            }
        }
    },[page])
    

    if (!data) return (<></>);

   return (
        <div className={paginationStyles.container}>
            <button
                onClick={firstPage}
                className={paginationStyles.btn}
                disabled={pageCounter === 1}
            >
                <FaAngleDoubleLeft className={paginationStyles.icon} />
                <span>First</span>
            </button>

            <button
                onClick={prevPage}
                className={paginationStyles.btn}
                disabled={pageCounter === 1}
            >
                <FaAngleLeft className={paginationStyles.icon} />
                <span>Prev</span>
            </button>

            <span className={paginationStyles.info}>
                Page <strong>{pageCounter}</strong> of <strong>{data.length}</strong>
            </span>

            <button
                onClick={nextPage}
                className={paginationStyles.btn}
                disabled={pageCounter === data.length}
            >
                <span>Next</span>
                <FaAngleRight className={paginationStyles.icon} />
            </button>

            <button
                onClick={lastPage}
                className={paginationStyles.btn}
                disabled={pageCounter === data.length}
            >
                <span>Last</span>
                <FaAngleDoubleRight className={paginationStyles.icon} />
            </button>
        </div>
    );
}