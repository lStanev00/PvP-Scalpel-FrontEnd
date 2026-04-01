/* eslint-disable react/prop-types */

import { FiShield } from "react-icons/fi";
import StatsToggle from "../checkDetails/StatsToggle.jsx";
import CardStyle from "../../Styles/modular/PvPCards.module.css";
import PageStyle from "../../Styles/modular/LobbyScan.module.css";

function CardIcon({ src, alt }) {
    if (src) {
        return <img className={CardStyle.mediaIcon} src={src} alt={alt} />;
    }

    return (
        <div className={`${CardStyle.mediaIcon} ${PageStyle.lobbyIconFallback}`} aria-hidden="true">
            <FiShield />
        </div>
    );
}

function InfoRow({ icon, alt, label, title, value, rowClassName = "" }) {
    return (
        <section
            style={{
                minHeight: "unset",
                height: "fit-content"
            }}
            className={`${CardStyle.cardSection} ${CardStyle.recordSection} ${PageStyle.lobbyInfoRow} ${rowClassName}`}
        >
            <div className={PageStyle.lobbyInfoIcon}>
                <CardIcon src={icon} alt={alt} />
            </div>

            <div className={CardStyle.recordCopy}>
                <p className={CardStyle.sectionLabel}>{label}</p>
                <strong className={CardStyle.recordTitle}>{title}</strong>
            </div>

            {value ? <span className={CardStyle.recordValue}>{value}</span> : null}
        </section>
    );
}

export default function LobbyPlayerCard({ card, onOpen }) {
    const isClickable = Boolean(card.href && typeof onOpen === "function");

    const openCard = () => {
        if (!isClickable) return;
        onOpen(card.href);
    };

    return (
        <article
            style={{
                maxHeight: "unset",
                height: "fit-content"
            }}
            className={`${CardStyle["pvp-card"]} ${PageStyle.lobbyCard} ${
                isClickable ? PageStyle.lobbyCardReady : ""
            } ${card.status === "missing" ? PageStyle.lobbyCardMissing : ""}`}
            onClick={openCard}
            onKeyDown={(event) => {
                if (!isClickable) return;

                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openCard();
                }
            }}
            role={isClickable ? "link" : undefined}
            tabIndex={isClickable ? 0 : undefined}
        >
            <header className={`${CardStyle.cardHeader} ${CardStyle.cardHeaderSplit}`}>
                <div className={CardStyle.bracketLabel}>{card.name}</div>
                <div className={CardStyle.specLabel}>{card.role}</div>
            </header>

            <div className={CardStyle.cardMain}>
                <section className={`${CardStyle.cardSection} ${CardStyle.heroSection}`}>
                    <CardIcon src={card.specIcon} alt={`${card.name} specialization`} />

                    <div className={CardStyle.heroMeta}>
                        <span className={CardStyle["pvp-rating"]}>{card.ratingValue}</span>
                    </div>

                    <p className={CardStyle.sectionLabel}>Rating</p>
                </section>

                <div className={PageStyle.lobbyInfoStack} style={{
                    gap: "1rem"
                }}>
                    <InfoRow
                        icon={card.recordIcon}
                        alt={`${card.name} record`}
                        label="Record"
                        title={card.recordTitle}
                        value={card.recordValue}
                        rowClassName={PageStyle.lobbyInfoRowFirst}
                    />
                    <div style={{
                        borderTop: "1px solid rgba(255, 255, 255, 0.08)"
                    }}></div>
                    <InfoRow
                        icon={card.avgIcon}
                        alt={`${card.name} average item level`}
                        label="Avg ilvl"
                        title={card.avgItemLevel}
                        rowClassName={PageStyle.lobbyInfoRowLast}
                    />
                </div>
            </div>

            <div className={CardStyle.statsFooter}>
                {card.currentSeason ? (
                    <StatsToggle currentSeason={card.currentSeason} />
                ) : (
                    <div className={PageStyle.lobbyFooterSpacer} aria-hidden="true" />
                )}
            </div>
        </article>
    );
}
// 2|Юлягодх:свежевательдуш:eu(264)|Twattu:argent-dawn:eu(261)|Revolutîon:sanguino:eu(70)|Lychezar:chamber-of-aspects:eu(73)|Брэйвхартх:gordunni:eu(252)|Jussì:ravencrest:eu(64)|Vengeance:frostwolf:eu(254)|Möppíe:argent-dawn:eu(256)
// 2[Adventureman:argent-dawn:eu(254)|Oifik:frostmane:eu(1480)|Zamruka:ravenholdt:eu(261)|Калмычка:gordunni:eu(256)|Akemi:eredar:eu(252)|Øéyx:ravencrest:eu(1468)|Lychezar:chamber-of-aspects:eu(73)|Снюсловер:gordunni:eu(102)][Aylanur:ravencrest:eu(103)|Balúr:thrall:eu(264)|Canhalli:the-maelstrom:eu(270)|Causality:sylvanas:eu(577)|Ledva:drakthul:eu(70)|Onlylock:ragnaros:eu(267)|Tyranorde:hyjal:eu(73)|Zaijko:stormscale:eu(251)]
