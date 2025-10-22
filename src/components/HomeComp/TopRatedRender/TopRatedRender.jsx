import { useNavigate } from "react-router-dom";
import Style from "../WeeklyRender/WeeklyRender.module.css";

export default function TopRatedRender({ topData }) {
    if (!topData || Object.keys(topData).length === 0) return null;
    const navigate = useNavigate();

    const order = ["solo", "blitz", "3v3", "2v2", "BG"];
    const mapTitle = {
        solo: "Solo Shuffle",
        blitz: "Blitz",
        "3v3": "3v3",
        "2v2": "2v2",
        BG: "RBG",
    };

    return (
        <section className={Style.wrapper}>
            <h2 className={Style.title}>Top Rated Players</h2>
            <div className={Style.grid}>
                {order.map((bracket) => {
                    if(mapTitle[bracket] === "RBG") return null;
                    const player = topData[bracket];
                    if (!player) return null;
                    const { name, playerRealm, server } = player;
                    const urlPart = `${server}/${playerRealm.slug}/${name}`;

                    return (
                        <article
                            key={bracket}
                            className={Style.card}
                            onClick={() => navigate(`/check/${urlPart}`)}
                        >
                            <header className={Style.cardHead}>
                                {mapTitle[bracket]}
                            </header>
                            <div
                                className={Style.banner}
                                style={{ backgroundImage: `url(${player.media.banner})` }}
                            >
                                <img
                                    className={Style.spec}
                                    src={player.activeSpec.media}
                                    alt={player.activeSpec.name}
                                />
                            </div>
                            <div className={Style.info}>
                                <strong className={Style.name}>{player.name}</strong>
                                <span className={Style.meta}>
                                    {player.activeSpec.name} {player.class.name}
                                </span>
                                <span className={Style.gain}>
                                    {player.rating &&
                                        Object.values(player.rating)[0]?.currentSeason?.rating + " rating"}
                                </span>
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}
