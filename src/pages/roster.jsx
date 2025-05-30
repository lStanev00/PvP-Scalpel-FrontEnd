import {useState, useEffect} from  'react';
import CharCard from '../components/Roster/charCard';
import SearchBox from '../components/Roster/searchBox';
import httpFetch from '../helpers/httpFetch.js';

export default function RosterPage() {

    const [data, setData] = useState([]);
    const [search, setSearch] = useState([]);
    
    useEffect(() => {
        const fetchData = async () => {
            const req = await httpFetch(`/member/list`)
            const data = await req.json();
            setData(data);
            setSearch(data);
        }
        fetchData();
    }, []);

    return (
        <>
            <SearchBox data = {data} setSearch={setSearch} />
            <CharCard charArr={search} />
        </>
    )
}