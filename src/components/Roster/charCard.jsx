import { useNavigate } from "react-router-dom";
import Style from "./CharCard.module.css";

export default function CharCard({ charArr }) {
    const navigate = useNavigate();
    const clickIt = (realm, name) => {
        navigate(`/check/eu/${realm}/${name}`);
    };
    return (
        <div className={Style.container}>
            {charArr.map((char) => (
                <div
                    key={char._id}
                    className={Style.card}
                    onClick={() => clickIt(char.playerRealm.slug, char.name)}>
                    <img
                        className={Style.image}
                        src={char.media?.banner}
                        alt={`${char.name} banner`}
                    />
                    <div className={Style.details}>
                        <h3>{char.name}</h3>
                        <p>Guild Rank: {char.guildInsight?.rank}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
