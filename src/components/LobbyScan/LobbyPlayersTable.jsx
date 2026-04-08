/* eslint-disable react/prop-types */

import { useMemo, useState } from "react";
import { FiArrowDown, FiArrowUp, FiShield } from "react-icons/fi";
import { LuHeart, LuSword } from "react-icons/lu";
import Style from "../../Styles/modular/LobbyScan.module.css";

const ROLE_SORT_ORDER = {
    tank: 0,
    healer: 1,
    damage: 2,
    "": 99,
};

function PlayerIcon({ src, alt }) {
    if (src) {
        return <img src={src} alt={alt} loading="lazy" />;
    }

    return (
        <span className={Style.lobbyTableIconFallback} aria-hidden="true">
            <FiShield />
        </span>
    );
}

function LoadingIcon() {
    return (
        <span className={`${Style.lobbyTableIconFallback} ${Style.lobbyTableIconLoading}`} aria-hidden="true">
            <span className={`${Style.lobbySkeletonBlock} ${Style.lobbyTableIconLoadingCore}`} />
        </span>
    );
}

function SkeletonBlock({ className = "" }) {
    return <span className={`${Style.lobbySkeletonBlock} ${className}`.trim()} aria-hidden="true" />;
}

function getRoleRank(value) {
    return ROLE_SORT_ORDER[String(value || "").toLowerCase()] ?? 99;
}

function compareNullableNumbers(left, right, direction) {
    const leftHasValue = typeof left === "number" && Number.isFinite(left);
    const rightHasValue = typeof right === "number" && Number.isFinite(right);

    if (!leftHasValue && !rightHasValue) return 0;
    if (!leftHasValue) return 1;
    if (!rightHasValue) return -1;
    return (left - right) * direction;
}

function sortRows(rows, sortKey, sortDirection) {
    const direction = sortDirection === "desc" ? -1 : 1;
    const copy = [...rows];

    copy.sort((left, right) => {
        let result = 0;

        if (sortKey === "role") {
            const leftRank = getRoleRank(left.roleValue);
            const rightRank = getRoleRank(right.roleValue);
            const leftUnknown = leftRank >= 99;
            const rightUnknown = rightRank >= 99;

            if (leftUnknown || rightUnknown) {
                if (leftUnknown && rightUnknown) {
                    result = 0;
                } else {
                    result = leftUnknown ? 1 : -1;
                }
            } else {
                result = (leftRank - rightRank) * direction;
            }

            if (result === 0) {
                result = String(left.playerName || "").localeCompare(String(right.playerName || ""));
            }
        } else if (sortKey === "rating") {
            result = compareNullableNumbers(left.ratingSortValue, right.ratingSortValue, direction);
        } else if (sortKey === "record") {
            result = compareNullableNumbers(left.recordSortValue, right.recordSortValue, direction);
            if (result === 0) {
                result = String(left.recordTitle || "").localeCompare(String(right.recordTitle || ""));
            }
        } else if (sortKey === "ilvl") {
            result = compareNullableNumbers(
                left.avgItemLevelSortValue,
                right.avgItemLevelSortValue,
                direction
            );
        }

        if (result === 0) {
            result = String(left.playerName || "").localeCompare(String(right.playerName || ""));
        }

        return result;
    });

    return copy;
}

function SortButton({ label, columnKey, sortKey, sortDirection, onSort, className = "" }) {
    const isActive = sortKey === columnKey;
    const icon = sortDirection === "desc" ? <FiArrowDown /> : <FiArrowUp />;

    return (
        <button
            type="button"
            className={`${Style.lobbySortButton} ${className} ${
                isActive ? Style.lobbySortButtonActive : ""
            }`}
            onClick={() => onSort(columnKey)}
            aria-pressed={isActive}
        >
            <span>{label}</span>
            {isActive ? <span className={Style.lobbySortIcon}>{icon}</span> : null}
        </button>
    );
}

function RoleBadge({ role, active, loading }) {
    const normalizedRole = String(role || "").toLowerCase();

    if (loading && !normalizedRole) {
        return (
            <span
                className={`${Style.lobbyRoleBadge} ${Style.lobbyRoleBadgeLoading} ${
                    active ? Style.lobbyTableCellActive : ""
                }`}
                aria-hidden="true"
            >
                <SkeletonBlock className={Style.lobbySkeletonRoleBadge} />
            </span>
        );
    }

    if (normalizedRole === "tank") {
        return (
            <span
                className={`${Style.lobbyRoleBadge} ${Style.lobbyRoleBadgeTank} ${
                    active ? Style.lobbyTableCellActive : ""
                }`}
                aria-label="Tank"
                title="Tank"
            >
                <FiShield />
            </span>
        );
    }

    if (normalizedRole === "healer") {
        return (
            <span
                className={`${Style.lobbyRoleBadge} ${Style.lobbyRoleBadgeHealer} ${
                    active ? Style.lobbyTableCellActive : ""
                }`}
                aria-label="Healer"
                title="Healer"
            >
                <LuHeart />
            </span>
        );
    }

    if (normalizedRole === "damage") {
        return (
            <span
                className={`${Style.lobbyRoleBadge} ${Style.lobbyRoleBadgeDamage} ${
                    active ? Style.lobbyTableCellActive : ""
                }`}
                aria-label="Damage"
                title="Damage"
            >
                <LuSword />
            </span>
        );
    }

    return (
        <span
            className={`${Style.lobbyRoleBadge} ${Style.lobbyRoleBadgeEmpty} ${
                active ? Style.lobbyTableCellActive : ""
            }`}
            aria-label="Unknown role"
            title="Unknown role"
        >
            <FiShield />
        </span>
    );
}

function RecordCell({ row, active }) {
    if (row.status === "loading") {
        return (
            <div className={`${Style.lobbyTableRecord} ${active ? Style.lobbyTableCellActive : ""}`}>
                <div className={Style.lobbyTableRecordIcon}>
                    <LoadingIcon />
                </div>
                <div className={Style.lobbyTableRecordCopy}>
                    <div className={Style.lobbyTableRecordLoadingCopy}>
                        <SkeletonBlock className={Style.lobbySkeletonRecordTitle} />
                        <SkeletonBlock className={Style.lobbySkeletonRecordSubtitle} />
                    </div>
                </div>
                <SkeletonBlock className={Style.lobbySkeletonRecordValue} />
            </div>
        );
    }

    return (
        <div className={`${Style.lobbyTableRecord} ${active ? Style.lobbyTableCellActive : ""}`}>
            <div className={Style.lobbyTableRecordIcon}>
                <PlayerIcon src={row.recordIcon} alt={`${row.playerName} record`} />
            </div>
            <div className={Style.lobbyTableRecordCopy}>
                <span className={Style.lobbyTableRecordTitle}>{row.recordTitle}</span>
            </div>
            {row.recordValue ? (
                <span className={Style.lobbyTableRecordValue}>{row.recordValue}</span>
            ) : null}
        </div>
    );
}

function TableRow({ row, onOpen, sortKey }) {
    if (row.teamDivider) {
        return (
            <div className={Style.lobbyTeamDivider}>
                <span>{row.teamDivider}</span>
            </div>
        );
    }

    const isLoading = row.status === "loading";
    const isClickable = Boolean(row.href && typeof onOpen === "function");

    const openRow = () => {
        if (!isClickable) return;
        onOpen(row.href);
    };

    return (
        <div key={row.rowId} style={{ display: "contents" }}>
            <div
                className={`${Style.lobbyTableRow} ${
                    isClickable ? Style.lobbyTableRowReady : ""
                } ${isLoading ? Style.lobbyTableRowLoading : ""} ${
                    row.status === "missing" ? Style.lobbyTableRowMissing : ""
                } ${
                    row.team === "team1"
                        ? Style.lobbyTableRowTeam1
                        : row.team === "team2"
                          ? Style.lobbyTableRowTeam2
                          : Style.lobbyTableRowUnassigned
                }`}
                role={isClickable ? "link" : undefined}
                tabIndex={isClickable ? 0 : undefined}
                onClick={openRow}
                onKeyDown={(event) => {
                    if (!isClickable) return;
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openRow();
                    }
                }}
            >
                <div className={Style.lobbyTablePlayer}>
                    <div className={Style.lobbyTablePlayerIcon}>
                        {isLoading && !row.playerIcon ? (
                            <LoadingIcon />
                        ) : (
                            <PlayerIcon src={row.playerIcon} alt={`${row.playerName} specialization`} />
                        )}
                    </div>
                    <div className={Style.lobbyTablePlayerInfo}>
                        <span className={Style.lobbyTablePlayerName}>{row.playerName}</span>
                        {row.playerSubline ? (
                            <span className={Style.lobbyTablePlayerSubline}>{row.playerSubline}</span>
                        ) : isLoading ? (
                            <SkeletonBlock className={Style.lobbySkeletonSubline} />
                        ) : (
                            <span className={Style.lobbyTablePlayerSubline}>Unknown specialization</span>
                        )}
                    </div>
                </div>

                <span
                    className={`${Style.lobbyTableStat} ${
                        sortKey === "role" ? Style.lobbyTableCellActive : ""
                    }`}
                >
                    <RoleBadge
                        role={row.roleValue}
                        active={sortKey === "role"}
                        loading={isLoading}
                    />
                </span>

                <span
                    className={`${Style.lobbyTableStat} ${
                        sortKey === "rating" ? Style.lobbyTableCellActive : ""
                    }`}
                >
                    {isLoading ? (
                        <SkeletonBlock className={Style.lobbySkeletonStat} />
                    ) : (
                        row.ratingValue
                    )}
                </span>

                <RecordCell row={row} active={sortKey === "record"} />

                <span
                    className={`${Style.lobbyTableStat} ${
                        sortKey === "ilvl" ? Style.lobbyTableCellActive : ""
                    }`}
                >
                    {isLoading ? (
                        <SkeletonBlock className={Style.lobbySkeletonStatShort} />
                    ) : (
                        row.avgItemLevel
                    )}
                </span>
            </div>
        </div>
    );
}

export default function LobbyPlayersTable({ sections, onOpen }) {
    const [sortKey, setSortKey] = useState("rating");
    const [sortDirection, setSortDirection] = useState("desc");

    const handleSort = (nextKey) => {
        if (sortKey === nextKey) {
            setSortDirection((currentDirection) => (currentDirection === "asc" ? "desc" : "asc"));
            return;
        }

        setSortKey(nextKey);
        setSortDirection(nextKey === "role" ? "asc" : "desc");
    };

    const sortedSections = useMemo(
        () =>
            sections.map((section) => ({
                ...section,
                rows: sortRows(section.rows, sortKey, sortDirection),
            })),
        [sections, sortDirection, sortKey]
    );

    const rows = [];

    sortedSections.forEach((section) => {
        rows.push({
            rowId: `${section.key}-divider`,
            teamDivider: section.title,
        });

        section.rows.forEach((row) => {
            rows.push(row);
        });
    });

    return (
        <div className={Style.lobbyTableShell}>
            <div className={Style.lobbyTableScroll}>
                <div className={Style.lobbyTableBody}>
                    <div className={Style.lobbyTableLabels}>
                        <span className={Style.lobbyTableColPlayer}>Player</span>
                        <SortButton
                            label="Role"
                            columnKey="role"
                            sortKey={sortKey}
                            sortDirection={sortDirection}
                            onSort={handleSort}
                            className={Style.lobbyTableColStat}
                        />
                        <SortButton
                            label="Rating"
                            columnKey="rating"
                            sortKey={sortKey}
                            sortDirection={sortDirection}
                            onSort={handleSort}
                            className={Style.lobbyTableColStat}
                        />
                        <SortButton
                            label="Record"
                            columnKey="record"
                            sortKey={sortKey}
                            sortDirection={sortDirection}
                            onSort={handleSort}
                            className={Style.lobbyTableColRecord}
                        />
                        <SortButton
                            label="Avg ilvl"
                            columnKey="ilvl"
                            sortKey={sortKey}
                            sortDirection={sortDirection}
                            onSort={handleSort}
                            className={Style.lobbyTableColStat}
                        />
                    </div>

                    {rows.map((row) => (
                        <TableRow key={row.rowId} row={row} onOpen={onOpen} sortKey={sortKey} />
                    ))}
                </div>
            </div>
        </div>
    );
}
