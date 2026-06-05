import { useContext, useEffect, useState } from "react";
import Style from "../../Styles/modular/WeeklyTop.module.css";
import { UserContext } from "../../hooks/ContextVariables.jsx";
import { useNavigate } from "react-router-dom";
import { FaTrophy } from "react-icons/fa";

export default function WeeklyTop({ content }) {
    const { httpFetch } = useContext(UserContext);
    const bracket = content.replace("Content", "");
    const navigate = useNavigate();

    const [top, setTop] = useState([]);
    const [updated, setUpdated] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            try {
                const req = await httpFetch(`/weekly/${bracket ===  "BG" ? `RBG` : bracket}`);
                if (!cancelled && req?.ok && req?.data) {
                    const data = req.data?.data || []; // { data: [...], lastUpdated }
                    setTop((data || []).slice(0, 5));
                    setUpdated(req.data?.lastUpdated || null);
                }
            } catch (e) {
                if (!cancelled) {
                    setTop([]);
                    setUpdated(null);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [httpFetch, bracket]);

    return (
        <section className={Style.card} aria-labelledby="weekly-top-title">
            <header className={Style.header}>
                <span className={Style.headerIcon} aria-hidden="true">
                    <FaTrophy />
                </span>
                <h3 id="weekly-top-title">Weekly Top 5 Gainers</h3>
                <span className={Style.badge}>{bracket.toUpperCase()}</span>
                {/* <span className={Style.connectorTop} aria-hidden="true" /> */}
            </header>

            {loading ? (
                <div className={Style.loading}>Loading…</div>
            ) : top.length === 0 ? (
                <p className={Style.empty}>No weekly data.</p>
            ) : (
                <ul className={Style.list}>
                    {top.map((p, idx) => {
                        // /check/eu/chamber-of-aspects/yvonipa
                        const parts = p?.playerSearch.split(":").reverse();
                        parts.unshift("/check");
                        const navLink = parts.join("/")
                        return <li
                            onClick={() => navigate(navLink)}
                            key={`${p._id || p.name}-${idx}`}
                            className={`${Style.item} ${idx < 3 ? Style.podium : ""}`}>
                            <div className={Style.rank}>#{idx + 1}</div>
                            <img
                                src={p.media?.avatar}
                                alt={p.name}
                                className={Style.avatar}
                                loading="lazy"
                                width={44}
                                height={44}
                            />
                            <div className={Style.meta}>
                                <p className={Style.name}>{p.name}</p>
                                <p className={Style.realm}>{p.activeSpec.name}</p>
                            </div>
                            <div className={Style.rating}>
                                <span className={Style.startRating}>{p?.startRating || 0}</span>
                                <span
                                    className={`${Style.gain} ${
                                        p?.result < 0 ? Style.negative : ""
                                    }`}>
                                    {p?.result > 0 ? `+${p?.result}` : p?.result}
                                </span>
                            </div>
                        </li>;
                    })}
                </ul>
            )}

        </section>
    );
}
