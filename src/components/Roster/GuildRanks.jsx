import Style from "./GuildRanks.module.css";
import { GiCrossedSwords } from "react-icons/gi";

export default function GuildRanks({ setSelectedGroup, selectedGroup }) {
    const sections = [
        { key: "staff", title: "Staff & Leadership", desc: "Guild management and officers." },
        { key: "gifted", title: "Gifted PvP Players", desc: "Top-performing combatants." },
        { key: "active", title: "Active Members", desc: "Dedicated daily players." },
        { key: "others", title: "Alts & Initiates", desc: "Secondary characters and newcomers." },
    ];

    const onSelect = (key) => {
        setSelectedGroup((prev) => (prev === key ? null : key));
    };

    return (
        <section className={Style.guildRanks}>
            <h2 className={Style.title}>Guild Structure</h2>
            <div className={Style.divider}></div>

            <div className={Style.wrapper}>
                {sections.map((sec) => (
                    <button
                        type="button"
                        key={sec.key}
                        className={`${Style.card} ${selectedGroup === sec.key ? Style.active : ""}`}
                        onClick={() => onSelect(sec.key)}
                        aria-pressed={selectedGroup === sec.key}
                    >
                        <h3 className={Style.cardTitle}>
                            <GiCrossedSwords className={Style.icon} /> {sec.title}
                        </h3>
                        <p className={Style.desc}>{sec.desc}</p>
                    </button>
                ))}
            </div>
        </section>
    );
}
