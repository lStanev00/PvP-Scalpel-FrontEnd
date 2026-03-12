import { useMemo, useState } from "react";
import Style from "../../Styles/modular/SeasonalPagination.module.css";
import { AchievementDiv } from "./Achievements.jsx";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";

function cleanTooltipDescription(description) {
    if (!description) return "";

    const cleaned = description
        .replace(/\s*\([^)]*\)/g, "")
        .replace(/\s+(?:during|in)\s+[A-Za-z][A-Za-z' -]+ Season \d+\.?$/i, " in a PvP season.")
        .replace(/\s{2,}/g, " ")
        .replace(/\s+\.$/, ".")
        .trim();

    return cleaned;
}

function buildPrefixSummary(seasonalAchievesMap) {
    const grouped = new Map();

    for (const [expansionName, seasonMap] of seasonalAchievesMap) {
        if (expansionName === "noSeason" || !seasonMap) continue;

        for (const achList of Object.values(seasonMap)) {
            if (!Array.isArray(achList)) continue;

            for (const ach of achList) {
                if (!ach?.name || !ach.name.includes(":")) continue;

                const [rawPrefix] = ach.name.split(":");
                const prefix = rawPrefix?.trim();
                if (!prefix) continue;

                if (!grouped.has(prefix)) {
                    grouped.set(prefix, {
                        label: prefix,
                        count: 1,
                        media: ach.media,
                        description: cleanTooltipDescription(ach.description),
                        expansions: [],
                    });
                    grouped.get(prefix).expansions.push({
                        name: expansionName,
                        seasons: [String(ach?.expansion?.season ?? "").trim()].filter(Boolean),
                    });
                } else {
                    const currentGroup = grouped.get(prefix);
                    currentGroup.count += 1;

                    const seasonValue = String(ach?.expansion?.season ?? "").trim();
                    const existingExpansion = currentGroup.expansions.find(
                        (expansion) => expansion.name === expansionName,
                    );

                    if (!existingExpansion) {
                        currentGroup.expansions.push({
                            name: expansionName,
                            seasons: seasonValue ? [seasonValue] : [],
                        });
                    } else if (seasonValue && !existingExpansion.seasons.includes(seasonValue)) {
                        existingExpansion.seasons.push(seasonValue);
                    }
                }
            }
        }
    }

    return Array.from(grouped.values());
}

export default function SeasonalPagination({ seasonalAchievesMap }) {
    const renderedSections = useMemo(
        () =>
            seasonalAchievesMap
                ? Array.from(seasonalAchievesMap).filter(([key]) => key !== "noSeason")
                : [],
        [seasonalAchievesMap],
    );
    const [showAllAchievements, setShowAllAchievements] = useState(false);
    const [expandedSections, setExpandedSections] = useState(() => {
        const defaultOpen = new Set(renderedSections.slice(0, 2).map(([key]) => key));
        return defaultOpen;
    });

    if (!seasonalAchievesMap || seasonalAchievesMap.size === 0) return null;

    const prefixSummary = buildPrefixSummary(seasonalAchievesMap);

    const toggleSection = (sectionName) => {
        setExpandedSections((current) => {
            const next = new Set(current);
            if (next.has(sectionName)) {
                next.delete(sectionName);
            } else {
                next.add(sectionName);
            }
            return next;
        });
    };

    return (
        <section className={Style.seasonalAchContainer}>
            {seasonalAchievesMap.size !== 0 && (
                <div className={Style.seasonalCompactAches}>
                    <div className={Style.headerRow}>
                        <div className={Style.titleBlock}>
                            <h1>Achievements</h1>
                            <p>Compact seasonal PvP history</p>
                        </div>
                    </div>

                    {prefixSummary.length > 0 && (
                        <div className={Style.summaryBadges}>
                            {prefixSummary.map((item) => (
                                <article
                                    key={item.label}
                                    className={Style.summaryBadge}
                                    tabIndex={0}>
                                    <div className={Style.summaryDivider} aria-hidden="true" />
                                    <div className={Style.summaryRow}>
                                        <div className={Style.summaryIconColumn}>
                                            <img
                                                src={item.media}
                                                alt={`${item.label} achievement icon`}
                                            />
                                            <span>{`x${item.count}`}</span>
                                        </div>
                                        <div className={Style.summaryTextColumn}>
                                            <strong>{item.label}</strong>
                                            {item.description && (
                                                <p className={Style.summaryDescription}>
                                                    {item.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className={Style.summaryTooltip}>
                                        <div className={Style.tooltipRows}>
                                            {item.expansions.map((expansion) => (
                                                <div
                                                    key={`${item.label}-${expansion.name}`}
                                                    className={Style.tooltipRow}>
                                                    <strong>{expansion.name}</strong>
                                                    <span>
                                                        {expansion.seasons.length > 0
                                                            ? `Season${
                                                                  expansion.seasons.length > 1
                                                                      ? "s"
                                                                      : ""
                                                              } ${expansion.seasons.join(", ")}`
                                                            : "PvP season"}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}

                    {showAllAchievements && (
                        <div className={Style.pageContent}>
                            {renderedSections.map(([key, value]) => {
                                const isExpanded = expandedSections.has(key);
                                return (
                                    <section key={uuidv4()} className={Style.seasonalMain}>
                                        <button
                                            type="button"
                                            className={Style.seasonHeader}
                                            onClick={() => toggleSection(key)}
                                            aria-expanded={isExpanded}>
                                            <h2>{key}</h2>
                                            {isExpanded ? (
                                                <FaChevronUp size={12} />
                                            ) : (
                                                <FaChevronDown size={12} />
                                            )}
                                        </button>
                                        <div
                                            className={`${Style.seasonalAchieves} ${
                                                isExpanded ? Style.expanded : Style.collapsed
                                            }`}>
                                            {value &&
                                                Object.entries(value).map(([, achList]) =>
                                                    achList.map((ach) => {
                                                        if (!ach.criteria) {
                                                            <AchievementDiv
                                                                key={uuidv4()}
                                                                seasonal={true}
                                                                achData={ach}
                                                            />;
                                                        }

                                                        try {
                                                            return (
                                                                <AchievementDiv
                                                                    key={(
                                                                        ach._id ||
                                                                        ach.criteria ||
                                                                        ach.name
                                                                    ).replace(/\s+/g, "-")}
                                                                    seasonal={true}
                                                                    achData={ach}
                                                                />
                                                            );
                                                        } catch {
                                                            return (
                                                                <AchievementDiv
                                                                    key={ach._id || ach.criteria}
                                                                    seasonal={true}
                                                                    achData={ach}
                                                                />
                                                            );
                                                        }
                                                    }),
                                                )}
                                        </div>
                                    </section>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
            <button
                type="button"
                className={Style.moduleToggle}
                onClick={() => setShowAllAchievements((current) => !current)}
                aria-expanded={showAllAchievements}>
                <span>
                    {showAllAchievements ? "Hide PvP Achievements" : "Show all PvP Achievements"}
                </span>
                {showAllAchievements ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
            </button>
        </section>
    );
}
