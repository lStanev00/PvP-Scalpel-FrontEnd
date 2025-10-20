import { useContext, useEffect, useState } from "react";
import Style from "../../Styles/modular/WeeklyTop.module.css";
import { UserContext } from "../../hooks/ContextVariables.jsx";

export default function WeeklyTop({ content }) {
    const { httpFetch } = useContext(UserContext);
    const bracket = content.replace("Content", "");

    const [top, setTop] = useState([]);
    const [updated, setUpdated] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            try {
                const req = await httpFetch(`/weekly/${bracket}`);
                if (!cancelled && req?.ok && req?.data) {
                    const data = req.data?.data || []; // { data: [...], lastUpdated }
                    console.info(data);
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
        <div className={Style.card}>
            <div className={Style.header}>
                <h3>Weekly Top 5</h3>
                <span className={Style.badge}>{bracket.toUpperCase()}</span>
            </div>

            {loading ? (
                <div className={Style.loading}>Loading…</div>
            ) : top.length === 0 ? (
                <p className={Style.empty}>No weekly data.</p>
            ) : (
                <ul className={Style.list}>
                    {top.map((p, idx) => (
                        <li
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
                                <div className={Style.name}>{p.name}</div>
                                {/* <div className={Style.realm}>
                  {p.playerRealm?.name} • {p.server?.toUpperCase?.()}
                </div> */}
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
                        </li>
                    ))}
                </ul>
            )}

            <div className={Style.footer}>
                <span>Updated</span>
                <time>{updated ? new Date(updated).toLocaleString() : "—"}</time>
            </div>
        </div>
    );
}
