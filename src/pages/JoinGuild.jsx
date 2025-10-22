import { useEffect, useState } from "react";
import Style from "../Styles/modular/JoinGuild.module.css";
import { groupedRanks, guildRanks } from "../components/Roster/helpers/guildRanks.js";
import { useContext } from "react";
import { UserContext } from "../hooks/ContextVariables.jsx";
import SEOJoinGuild from "../SEO/SEOJoinGuild.jsx";
import { useNavigate } from "react-router-dom";
export default function JoinGuild() {
    const navigate = useNavigate();
    const [staff, setStaff] = useState([]);
    const { httpFetch } = useContext(UserContext);

    useEffect(() => {
        async function loadStaff() {
            try {
                const res = await httpFetch("/member/list");
                if (!res.ok) return;
                const data = res?.data;

                const members = data
                    .filter((m) => groupedRanks.staff.includes(m.guildInsight.rankNumber))
                    .sort((a, b) => a.guildInsight.rankNumber - b.guildInsight.rankNumber);

                setStaff(members);
            } catch (err) {
                console.error("Failed to fetch guild staff:", err);
            }
        }

        loadStaff();
    }, []);

    return (
        <>
            <SEOJoinGuild />

            <section className={Style.container}>
                <div className={Style.header}>
                    <img
                        src="/logo/logo_resized.png"
                        alt="PvP Scalpel Logo"
                        className={Style.logo}
                    />
                    <h1 className={Style.title}>Join PvP Scalpel</h1>
                    <p className={Style.subtitle}>Precision. Performance. Power.</p>
                </div>

                <div className={Style.content}>
                    <div className={Style.card}>
                        <h2>About the Guild</h2>
                        <p className={Style.intro}>
                            Welcome to <strong>PvP Scalpel</strong> — one of the most respected and
                            performance-driven PvP guilds in the world.
                        </p>

                        <p>
                            We unite <strong>Alliance players from multiple realms</strong> who
                            share a passion for competitive Arenas, Battlegrounds, Blitz, and World
                            PvP. Our members are active daily, working together to climb rankings,
                            refine strategies, and enjoy every challenge Azeroth offers.
                        </p>

                        <p>
                            Whether you’re chasing Gladiator titles or simply love clean,
                            coordinated fights — you’ll find partners, guidance, and friendship
                            here. Join us and become part of a thriving PvP community that blends{" "}
                            <strong>precision, performance, and power</strong> — the true spirit of{" "}
                            <strong>PvP Scalpel</strong>.
                        </p>
                    </div>

                    <div className={Style.card}>
                        <h2>Requirements</h2>
                        <ul>
                            <li>Level 80+</li>
                            <li>1500+ PvP rating preferred</li>
                            <li>Active Discord participation</li>
                            <li>Respectful and team-oriented attitude</li>
                            <li>Basic English communication skills</li>
                        </ul>
                    </div>

                    <div className={Style.card}>
                        <h2>How to Join</h2>
                        <ol>
                            <li>Join our Discord using the button below.</li>
                            <li>
                                Search for the character you want to join with on our{" "}
                                <strong>PvP Scalpel</strong> web app and copy your character’s link.
                            </li>
                            <li>
                                Go to the <strong>#recruitment</strong> channel in Discord and paste
                                your character link there, along with a short message about
                                yourself.
                            </li>
                            <li>
                                One of our staff members will review it and invite you in-game once
                                approved.
                            </li>
                        </ol>

                        <div className={Style.btnRow}>
                            <a
                                href="https://discord.gg/4E83N87DmM"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${Style.button} ${Style.discord}`}>
                                Join Discord
                            </a>

                            <button
                                onClick={() => {
                                    const el = document.querySelector("#characterSearch");
                                    if (el) {
                                        el.scrollIntoView({ behavior: "smooth", block: "center" });
                                        setTimeout(() => el.focus(), 300);
                                    }
                                }}
                                className={`${Style.button} ${Style.guild}`}>
                                Search your Character
                            </button>
                        </div>
                    </div>

                    <div className={Style.staffContainer}>
                        <h2>Staff Members to Look for</h2>
                        <div className={Style.staffGrid}>
                            {staff.length > 0 ? (
                                staff.map((member) => (
                                    <div
                                        key={member._id || member.name}
                                        className={Style.staffCard}
                                        data-rank={member.guildInsight.rankNumber}
                                        onClick={() => {
                                            navigate(
                                                `/check/${member?.server}/${member?.playerRealm?.slug}/${member?.name}`
                                            );
                                        }}>
                                        <img
                                            src={member.media?.avatar}
                                            alt={member.name}
                                            className={Style.staffAvatar}
                                        />
                                        <div className={Style.staffInfo}>
                                            <h3>{member.name}</h3>
                                            <p>{guildRanks[member.guildInsight.rankNumber]}</p>
                                            <span className={Style.realm}>
                                                {member.playerRealm?.name}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className={Style.loading}>Fetching staff data...</p>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
