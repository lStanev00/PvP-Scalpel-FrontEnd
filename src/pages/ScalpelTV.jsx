import { useContext, useEffect, useState } from "react";
import { FiPlay, FiTv, FiVideo } from "react-icons/fi";

import { UserContext } from "../hooks/ContextVariables.jsx";
import Style from "../Styles/modular/ScalpelTV.module.css";
import { getGameBrackets } from "../helpers/storageOperations/gameData.js";
import { useNavigate } from "react-router";

const CONTENT_ROOT = "https://bucket.pvpscalpel.com/pvp-scalpel-frontend/";

function buildPath(path) {
    if (typeof path !== "string" || !path.trim()) return null;

    try {
        return new URL(path, CONTENT_ROOT).href;
    } catch {
        return null;
    }
}

export default function ScalpelTV() {
    const { httpFetch } = useContext(UserContext);
    const [videosMeta, setVideosMeta] = useState(null);
    const [error, setError] = useState("");
    const brackets = getGameBrackets();
    const navigate = useNavigate();


    useEffect(() => {
        let cancelled = false;

        const retrieveVideoMeta = async () => {
            try {
                const request = await httpFetch("/videos");
                if (cancelled) return;

                if (request.status === 200 && Array.isArray(request.data)) {
                    setVideosMeta(request.data);
                    return;
                }

                setVideosMeta([]);
                setError("The video feed could not be loaded right now.");
            } catch {
                if (cancelled) return;
                setVideosMeta([]);
                setError("The video feed could not be loaded right now.");
            }
        };

        retrieveVideoMeta();

        return () => {
            cancelled = true;
        };
    }, [httpFetch]);

    return (
        <main className={Style.page}>
            <div className={Style.backdrop} aria-hidden="true">
                <span className={`${Style.glow} ${Style.glowTop}`} />
                <span className={`${Style.glow} ${Style.glowSide}`} />
                <span className={Style.pattern} />
            </div>

            <header className={Style.hero}>
                {/* <div className={Style.badge}>
                    <FiTv aria-hidden="true" />
                    <span>Scalpel TV</span>
                </div> */}
                <h1 className={Style.title}>Scalpel TV</h1>
                <p className={Style.intro}>
                    Watch matches, highlights, and moments from the PvP Scalpel community.
                </p>
            </header>

            {videosMeta === null && (
                <section className={Style.status} role="status" aria-live="polite">
                    <span className={Style.loader} aria-hidden="true" />
                    <strong>Loading videos</strong>
                    <p>Preparing the latest uploads...</p>
                </section>
            )}

            {videosMeta !== null && error && (
                <section className={`${Style.status} ${Style.error}`} role="alert">
                    <FiVideo aria-hidden="true" />
                    <strong>Feed unavailable</strong>
                    <p>{error}</p>
                </section>
            )}

            {videosMeta !== null && !error && videosMeta.length === 0 && (
                <section className={Style.status} role="status">
                    <FiVideo aria-hidden="true" />
                    <strong>No videos yet</strong>
                    <p>New community uploads will appear here.</p>
                </section>
            )}

            {videosMeta?.length > 0 && (
                <section className={Style.library} aria-labelledby="scalpel-tv-library-title">

                    <div className={Style.grid}>
                        {videosMeta.map((metaEntry, index) => {
                            const title = metaEntry?.title?.trim() || "Untitled video";
                            const thumbnail = buildPath(metaEntry?.manifest?.thumbnail);
                            const bracket = brackets.find(entry => {
                                const {_id} = entry;
                                return _id === metaEntry.bracket
                            });

                            return (
                                <article
                                    className={Style.card}
                                    key={metaEntry?._id || `${title}-${index}`}
                                    onClick={() => navigate(`/watch/${metaEntry._id}`)}
                                >
                                    <div className={Style.thumbnail}>
                                        {thumbnail ? (
                                            <img
                                                src={thumbnail}
                                                alt=""
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        ) : (
                                            <div className={Style.thumbnailFallback}>
                                                <FiVideo aria-hidden="true" />
                                            </div>
                                        )}
                                        <span className={Style.playIcon} aria-hidden="true">
                                            <FiPlay />
                                        </span>
                                    </div>

                                    <div className={Style.cardBody}>
                                        <span className={Style.cardLabel}>{bracket._id === 0 ? "PvP-S Video" : bracket.name || null}</span>
                                        <h3>{title}</h3>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </section>
            )}
        </main>
    );
}
