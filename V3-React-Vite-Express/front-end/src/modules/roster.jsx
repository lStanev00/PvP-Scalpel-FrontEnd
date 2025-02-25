import {useState, useEffect} from  'react';
import CharCard from '../components/charCard';

export default function RosterPage() {

    const [data, setData] = useState([])
    
    useEffect(() => {
        const fetchData = async () => {
            const req = await fetch(`https://api.pvpscalpel.com/member/list`,{
                headers: {
                    'Content-Type': 'application/json'
                },
                method: `POST`,
                body: JSON.stringify({
                    "query": ["rank", "media"]
                })
            })
            const data = await req.json();
            setData(data)

        }
        fetchData();
    }, [])

    console.log(data)
    return (
        <>
            <CharCard charArr={data} />
        </>
    )
}