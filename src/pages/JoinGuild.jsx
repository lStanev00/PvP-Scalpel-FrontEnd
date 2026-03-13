import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaChevronRight,
    FaCrown,
    FaDiscord,
    FaLock,
    FaShieldAlt,
    FaStar,
    FaUserFriends,
} from "react-icons/fa";
import { GiCrossedSwords } from "react-icons/gi";
import Style from "../Styles/modular/JoinGuild.module.css";
import { groupedRanks, guildRanks } from "../components/Roster/helpers/guildRanks.js";
import { UserContext } from "../hooks/ContextVariables.jsx";
import SEOJoinGuild from "../SEO/SEOJoinGuild.jsx";

export default function JoinGuild() {
    const navigate = useNavigate();
    const [staff, setStaff] = useState([]);
    const [hoveredPerk, setHoveredPerk] = useState(null);
    const staffContainerRef = useRef(null);
    const staffGridRef = useRef(null);
    const { httpFetch } = useContext(UserContext);

    useEffect(() => {
        async function loadStaff() {
            try {
                const res = await httpFetch("/member/list");
                if (!res.ok) return;
                const data = res?.data;

                const members = data
                    .filter((member) => groupedRanks.staff.includes(member.guildInsight.rankNumber))
                    .sort((a, b) => a.guildInsight.rankNumber - b.guildInsight.rankNumber);

                setStaff(members);
            } catch (err) {
                console.error("Failed to fetch guild staff:", err);
            }
        }

        loadStaff();
    }, []);

    const perks = [
        {
            icon: GiCrossedSwords,
            title: "Competitive PvP",
            desc: "Arenas, Battlegrounds, Blitz and world PvP with players who queue to win.",
        },
        {
            icon: FaUserFriends,
            title: "Active Community",
            desc: "Daily sessions, strategy talks, and respectful teammates who push you to improve.",
        },
        {
            icon: FaCrown,
            title: "Rank Progression",
            desc: "Climb our internal ranks and earn recognition among the best.",
        },
        {
            icon: FaShieldAlt,
            title: "Guild Support",
            desc: "Gear advice, comp theory, and veteran mentorship on demand.",
        },
    ];

    const requirements = [
        "Level 80+",
        "1500+ PvP rating preferred",
        "Active Discord participation",
        "Respectful and team-oriented attitude",
        "Basic English communication skills",
    ];

    const steps = [
        { num: "01", text: "Join our Discord server using the button below." },
        {
            num: "02",
            text: "Search for the character you want to join with on the PvP Scalpel app and copy the link.",
        },
        {
            num: "03",
            text: "Post the character link in #recruitment together with a short introduction.",
        },
        {
            num: "04",
            text: "A staff member will review the post and invite you in-game if approved.",
        },
    ];

    const scrollToCharacterSearch = () => {
        const el = document.querySelector("#characterSearch");
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            setTimeout(() => el.focus(), 300);
        }
    };

    const handleStaffWheel = (event) => {
        const grid = staffGridRef.current;
        if (!grid) return;

        const isDesktopScroller = grid.scrollWidth > grid.clientWidth;
        if (!isDesktopScroller) return;

        if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

        event.preventDefault();
        event.stopPropagation();
        grid.scrollBy({
            left: event.deltaY,
            behavior: "auto",
        });
    };

    useEffect(() => {
        const container = staffContainerRef.current;
        if (!container) return undefined;

        const onWheel = (event) => {
            handleStaffWheel(event);
        };

        container.addEventListener("wheel", onWheel, { passive: false });

        return () => {
            container.removeEventListener("wheel", onWheel);
        };
    }, []);

    return (
        <>
            <SEOJoinGuild />

            <section className={Style.page}>
                <div className={Style.backdrop} aria-hidden="true">
                    <div className={`${Style.glow} ${Style.glowTop}`} />
                    <div className={`${Style.glow} ${Style.glowBottom}`} />
                    <div className={`${Style.gridGlow} ${Style.gridGlowLeft}`} />
                    <div className={`${Style.gridGlow} ${Style.gridGlowRight}`} />
                </div>

                <div className={Style.hero}>
                    <div className={Style.heroInner}>
                        <img
                            src="/logo/logo_resized.png"
                            alt="PvP Scalpel Logo"
                            className={Style.logo}
                        />

                        <div className={Style.badge}>
                            <FaLock className={Style.badgeIcon} />
                            <span style={{ whiteSpace: "nowrap" }}>Private Guild - Invite Only</span>
                        </div>

                        <h1 className={Style.title}>
                            Join PvP Scalpel
                            <span className={Style.titleUnderline} />
                        </h1>

                        <p className={Style.heroText}>
                            We don&apos;t recruit numbers - we recruit{" "}
                            <span className={Style.heroTextStrong}>competitors</span>. An exclusive
                            Alliance PvP guild where precision meets performance.
                        </p>

                        <div className={Style.heroActions}>
                            <a
                                href="https://discord.gg/4E83N87DmM"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${Style.button} ${Style.discordButton}`}>
                                <FaDiscord />
                                <span>Apply via Discord</span>
                            </a>

                            <button
                                type="button"
                                onClick={scrollToCharacterSearch}
                                className={`${Style.button} ${Style.searchButton}`}>
                                <GiCrossedSwords />
                                <span>Search Your Character</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={Style.content}>
                    <section className={Style.section}>
                        <h2 className={Style.sectionHeading}>Why Players Choose Us</h2>

                        <div className={Style.perkGrid}>
                            {perks.map((perk, index) => {
                                const Icon = perk.icon;
                                const isActive = hoveredPerk === index;

                                return (
                                    <article
                                        key={perk.title}
                                        className={`${Style.perkCard} ${
                                            isActive ? Style.perkCardActive : ""
                                        }`}
                                        onMouseEnter={() => setHoveredPerk(index)}
                                        onMouseLeave={() => setHoveredPerk(null)}>
                                        <div className={Style.perkHeading}>
                                            <Icon className={Style.perkIcon} />
                                            <h3>{perk.title}</h3>
                                        </div>
                                        <p>{perk.desc}</p>
                                    </article>
                                );
                            })}
                        </div>
                    </section>

                    <section className={Style.section}>
                        <article className={`${Style.panel} ${Style.aboutCard}`}>
                            <h2 className={Style.panelHeading}>About the Guild</h2>

                            <div className={Style.aboutText}>
                                <p>
                                    <span className={Style.highlightGold}>PvP Scalpel</span> is one
                                    of the most respected and performance-driven PvP guilds in the
                                    world.
                                    <br />
                                    We are a{" "}
                                    <span className={Style.highlightGold}>
                                        private, invite-only
                                    </span>{" "}
                                    community - and we intend to keep it that way.
                                </p>

                                <p>
                                    We unite{" "}
                                    <span className={Style.highlightStrong}>
                                        Alliance players from multiple realms
                                    </span>{" "}
                                    who share a passion for competitive Arenas, Battlegrounds,
                                    Blitz, and World PvP. Our members are active daily, working
                                    together to climb rankings, refine strategies, and dominate
                                    every challenge Azeroth throws at us.
                                </p>

                                <p>
                                    Whether you&apos;re chasing Gladiator titles or simply love
                                    clean, coordinated fights - you&apos;ll find partners, guidance,
                                    and real camaraderie here.
                                </p>
                            </div>
                        </article>
                    </section>

                    <section className={`${Style.section} ${Style.splitSection}`}>
                        <article className={Style.panel}>
                            <h2 className={Style.panelHeadingGold}>
                                <FaStar />
                                <span>Requirements</span>
                            </h2>

                            <ul className={Style.requirementsList}>
                                {requirements.map((requirement) => (
                                    <li key={requirement} className={Style.requirementItem}>
                                        <FaChevronRight className={Style.chevron} />
                                        <span>{requirement}</span>
                                    </li>
                                ))}
                            </ul>
                        </article>

                        <article className={Style.panel}>
                            <h2 className={Style.panelHeadingGold}>
                                <FaShieldAlt />
                                <span>How to Join</span>
                            </h2>

                            <div className={Style.stepList}>
                                {steps.map((step) => (
                                    <div key={step.num} className={Style.stepRow}>
                                        <span className={Style.stepNumber}>{step.num}</span>
                                        <p>{step.text}</p>
                                    </div>
                                ))}
                            </div>
                        </article>
                    </section>

                    <section className={Style.section}>
                        <div ref={staffContainerRef} className={Style.staffContainer}>
                            <h2>Staff Members to Look for</h2>
                            <div ref={staffGridRef} className={Style.staffGrid}>
                                {staff.length > 0 ? (
                                    staff.map((member) => (
                                        <div
                                            key={member._id || member.name}
                                            className={Style.staffCard}
                                            data-rank={member.guildInsight.rankNumber}
                                            onClick={() => {
                                                navigate(
                                                    `/check/${member?.server}/${member?.playerRealm?.slug}/${member?.name}`,
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
                    </section>
                </div>
            </section>
        </>
    );
}
