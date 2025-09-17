import {useState, useEffect} from  'react';
import CharCard from '../components/Roster/charCard.jsx';
import SearchBox from '../components/Roster/searchBox.jsx';
import httpFetch from '../helpers/httpFetch.js';
import Loading from '../components/loading.jsx';

export default function RosterPage() {

    const [data, setData] = useState(undefined);
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

    if (data === undefined) return (<Loading />)

    return (
        <>
            <SearchBox data = {data} setSearch={setSearch} />
            <CharCard charArr={search} />
        </>
    )
}