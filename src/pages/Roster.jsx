import { useState, useEffect, useContext } from "react";
import CharCard from "../components/Roster/charCard.jsx";
import SearchBox from "../components/Roster/searchBox.jsx";
import GuildRanks from "../components/Roster/GuildRanks.jsx";
import Loading from "../components/loading.jsx";
import Style from "../Styles/modular/Roster.module.css";
import { UserContext } from "../hooks/ContextVariables.jsx";
import { groupedRanks } from "../components/Roster/helpers/guildRanks.js";
import SEORoster from "../SEO/SEORoster.jsx";

export default function RosterPage() {
    const { httpFetch } = useContext(UserContext);

    const [data, setData] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [query, setQuery] = useState("");
    const [selectedGroup, setSelectedGroup] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const req = await httpFetch(`/member/list`);
            if (req.ok && Array.isArray(req.data)) {
                setData(req.data);
                setFiltered(req.data);
            }
        };
        fetchData();
    }, [httpFetch]);

    useEffect(() => {
        if (!data.length) return;

        let results = data;

        // 1) Text search (by name, realm, server — adjust as you like)
        if (query.trim() !== "") {
            const q = query.toLowerCase();
            results = results.filter(
                (c) =>
                    c.name?.toLowerCase().includes(q) ||
                    c.playerRealm?.name?.toLowerCase().includes(q) ||
                    c.server?.toLowerCase().includes(q)
            );
        }

        // 2) Grouped rank filter (uses rankNumber)
        if (selectedGroup && groupedRanks[selectedGroup]) {
            const allowed = new Set(groupedRanks[selectedGroup]); // O(1) lookup
            results = results.filter((c) => allowed.has(Number(c.guildInsight?.rankNumber)));
        }

        setFiltered(results);
    }, [query, selectedGroup, data]);

    if (!data.length) return <Loading />;

    return (
        <>
            <SEORoster />
            <section className={Style.page}>
                <h1 className={Style.title}>Guild Roster</h1>
                <div className={Style.divider}></div>

                <SearchBox setQuery={setQuery} />
                <GuildRanks setSelectedGroup={setSelectedGroup} selectedGroup={selectedGroup} />
                <CharCard charArr={filtered} />
            </section>
        </>
    );
}
