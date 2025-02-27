import {useState, useEffect} from  'react';
import CharCard from '../components/charCard';
import SearchBox from '../components/searchBox';

export default function RosterPage() {

    const [data, setData] = useState([]);
    const [search, setSearch] = useState([]);
    
    useEffect(() => {
        const fetchData = async () => {
            const req = await fetch(`https://api.pvpscalpel.com/member/list`,{
                headers: {
                    'Content-Type': 'application/json'
                },
                method: `POST`,
                cache: 'no-store',
                body: JSON.stringify({
                    "query": ["rank", "media"]
                })
            })
            const data = await req.json();
            setData(data);
            setSearch(data);
        }
        fetchData();
    }, []);

    console.log(data)
    return (
        <>
            <SearchBox data = {data} setSearch={setSearch} />
            <CharCard charArr={search} />
        </>
    )
}