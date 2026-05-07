import { useCallback, useEffect, useRef, useState } from "react";
import {
    FiAlertTriangle,
    FiCheckCircle,
    FiRefreshCw,
    FiSearch,
    FiZap,
} from "react-icons/fi";
import SEOLobbyScan from "../SEO/SEOLobbyScan.jsx";
import Style from "../Styles/modular/LobbyScan.module.css";
import LobbyPlayersTable from "../components/LobbyScan/LobbyPlayersTable.jsx";

const SOCKET_URL = "wss://ws.pvpscalpel.com";

const LOADING_STEPS = [
    "Opening websocket connection",
    "Sending scan payload",
    "Receiving bracket context",
    "Receiving team IDs and streamed players",
];

const INITIAL_SCAN_TRACKING = {
    hasTeam1Payload: false,
    hasTeam2Payload: false,
    usesLegacyPlayerIds: false,
    scanAutoClosed: false,
};

function normalizeLobbyPayload(value) {
    return String(value || "")
        .trim()
        .replace(/\s+/g, "|")
        .replace(/\|+/g, "|");
}

function normalizeServerEntryId(value) {
    return String(value || "");
}

function formatServerEntryName(value) {
    const rawName = normalizeServerEntryId(value).split(":")[0] || "";

    if (!rawName) {
        return "Unknown player";
    }

    return rawName.charAt(0).toUpperCase() + rawName.slice(1);
}

function createLobbyRow(serverEntryId, team, index) {
    return {
        rowId: `${team}:${index}:${serverEntryId}`,
        serverEntryId,
        order: index + 1,
        team,
        rawEntry: serverEntryId,
        displaySearch: formatServerEntryName(serverEntryId),
        status: "loading",
        character: null,
        message: "Waiting for server response.",
        spec: null,
    };
}

function upsertTeamRows(list, ids, team) {
    const normalizedIds = (Array.isArray(ids) ? ids : [])
        .map((entry) => normalizeServerEntryId(entry))
        .filter(Boolean);

    const nextRows = [...list];

    normalizedIds.forEach((serverEntryId, index) => {
        const existingIndex = nextRows.findIndex((entry) => entry.serverEntryId === serverEntryId);

        if (existingIndex >= 0) {
            nextRows[existingIndex] = {
                ...nextRows[existingIndex],
                team,
                order: index + 1,
                displaySearch: nextRows[existingIndex].displaySearch || formatServerEntryName(serverEntryId),
            };
            return;
        }

        nextRows.push(createLobbyRow(serverEntryId, team, index));
    });

    return nextRows;
}

function mergeCharacter(list, serverEntryId, nextCharacter, nextMessage = "") {
    let didUpdate = false;

    const nextRows = list.map((entry) => {
        if (didUpdate || entry.serverEntryId !== serverEntryId) {
            return entry;
        }

        didUpdate = true;

        return {
            ...entry,
            status: "ready",
            character: nextCharacter,
            message: nextMessage,
            spec: entry.spec || nextCharacter?.searchSpecRequested || null,
            displaySearch: entry.displaySearch || formatServerEntryName(serverEntryId),
        };
    });

    if (didUpdate) {
        return nextRows;
    }

    return [
        ...nextRows,
        {
            ...createLobbyRow(serverEntryId, "unassigned", nextRows.length),
            status: "ready",
            character: nextCharacter,
            message: nextMessage,
            spec: nextCharacter?.searchSpecRequested || null,
        },
    ];
}

function markEntryMissing(list, serverEntryId, message, nextSpec = null) {
    let didUpdate = false;

    const nextRows = list.map((entry) => {
        if (didUpdate || entry.serverEntryId !== serverEntryId) {
            return entry;
        }

        didUpdate = true;

        return {
            ...entry,
            status: "missing",
            character: null,
            message,
            spec: entry.spec || nextSpec || null,
            displaySearch: entry.displaySearch || formatServerEntryName(serverEntryId),
        };
    });

    if (didUpdate) {
        return nextRows;
    }

    return [
        ...nextRows,
        {
            ...createLobbyRow(serverEntryId, "unassigned", nextRows.length),
            status: "missing",
            message,
            spec: nextSpec || null,
        },
    ];
}

function normalizeBracketLabel(value) {
    if (!value) return "PvP";

    return value
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (match) => match.toUpperCase());
}

function normalizeComparable(value) {
    return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
}

function getLobbyBracketAchievement(character, bracket) {
    const normalizedBracket = String(bracket?.name || "").trim().toLowerCase();
    const achieves = character?.achieves || {};
    const listAchievements = Array.isArray(character?.listAchievements)
        ? character.listAchievements
        : [];

    let achievement = null;

    if (bracket?.isSolo && normalizedBracket.includes("blitz")) {
        const blitzAchieves = achieves?.Blitz;
        const titleName = String(blitzAchieves?.XP?.name || "");
        const winsName = String(blitzAchieves?.WINS?.name || "");
        const strategistExist = listAchievements.find((entry) =>
            entry?.name?.includes("Strategist")
        );

        if (strategistExist) {
            achievement = {
                name: "Strategist",
                media: strategistExist?.media || blitzAchieves?.WINS?.media || blitzAchieves?.XP?.media || "",
                description:
                    strategistExist?.description ||
                    blitzAchieves?.WINS?.description ||
                    blitzAchieves?.XP?.description ||
                    "",
            };
        } else if (winsName.includes("Strategist")) {
            achievement = {
                name: "Strategist",
                media: blitzAchieves?.WINS?.media || blitzAchieves?.XP?.media || "",
                description:
                    blitzAchieves?.WINS?.description ||
                    blitzAchieves?.XP?.description ||
                    "",
            };
        } else if (titleName.includes("Hero of the Horde")) {
            achievement = {
                name: "Hero of the Horde",
                media: blitzAchieves?.XP?.media || "",
                description: blitzAchieves?.XP?.description || "",
            };
        } else if (titleName.includes("Hero of the Alliance")) {
            achievement = {
                name: "Hero of the Alliance",
                media: blitzAchieves?.XP?.media || "",
                description: blitzAchieves?.XP?.description || "",
            };
        } else {
            achievement = blitzAchieves?.XP || null;
        }
    } else if (bracket?.isSolo && normalizedBracket.includes("solo")) {
        achievement = achieves?.solo || null;
    } else if (
        normalizedBracket.includes("rated battleground") ||
        normalizedBracket === "rbg"
    ) {
        achievement = achieves?.RBG?.XP || null;
    } else if (normalizedBracket.includes("2v2")) {
        achievement = achieves?.["2s"] || null;
    } else if (normalizedBracket.includes("3v3")) {
        achievement = achieves?.["3s"] || null;
    }

    if (!achievement?.name) {
        return null;
    }

    return {
        name: String(achievement.name || "").trim(),
        media: achievement.media || "",
        description: achievement.description || "",
    };
}

function getLobbyAchievementRecordValue(achievement) {
    if (!achievement?.name) {
        return "";
    }

    const description = String(achievement.description || "");
    const numericMatch = description.match(/\b\d{4}\b/);

    if (numericMatch?.[0]) {
        return numericMatch[0];
    }

    const achievementName = String(achievement.name || "");

    if (
        achievementName.includes("Strategist") ||
        achievementName.includes("Hero of the Horde") ||
        achievementName.includes("Hero of the Alliance") ||
        achievementName.includes("Legend")
    ) {
        return "2400+";
    }

    return "";
}

function getXpSortValue(achievement) {
    const xpRecordValue = getLobbyAchievementRecordValue(achievement);

    if (xpRecordValue === "2400+") {
        return 2401;
    }

    return Number.isFinite(Number(xpRecordValue)) ? Number(xpRecordValue) : null;
}

function getBracketRecordValue(bracketData) {
    const rawRecord = bracketData?.record;

    if (typeof rawRecord === "number" && Number.isFinite(rawRecord)) {
        return String(rawRecord);
    }

    const recordMatch = String(rawRecord || "").match(/\d+/);

    return recordMatch?.[0] || "";
}

function getDisplaySpec(row) {
    return (
        row?.spec?.name ||
        row?.character?.searchSpecRequested?.name ||
        row?.character?.activeSpec?.name ||
        "Unknown spec"
    );
}

function getSpecIcon(row) {
    return (
        row?.spec?.media ||
        row?.character?.searchSpecRequested?.media ||
        row?.character?.activeSpec?.media ||
        ""
    );
}

function getRoleLabel(row) {
    return (
        row?.spec?.role ||
        row?.character?.searchSpecRequested?.role ||
        row?.character?.activeSpec?.role ||
        ""
    );
}


const AVERAGE_ITEM_LEVEL_IGNORED_SLOTS = new Set(["tabard", "shirt"]);
function isAverageItemLevelGearEntry([slot, item]) {
    if (AVERAGE_ITEM_LEVEL_IGNORED_SLOTS.has(slot)) return false;

    const level = Number(item?.level);
    return Number.isFinite(level) && level > 1;
}

function getAverageItemLevel(character) {
    const gearEntries = Object.entries(character?.gear || {}).filter(isAverageItemLevelGearEntry);

    if (!gearEntries.length) {
        return "Unknown";
    }

    const totalItemLevel = gearEntries.reduce((sum, [, item]) => {
        return sum + Number(item.pvpIlvl);
    }, 0);

    return String(Math.round(totalItemLevel / gearEntries.length));
}

function getPlayerSubline(row) {
    const spec =
        row?.spec?.name || row?.character?.searchSpecRequested?.name || row?.character?.activeSpec?.name || "";
    const charClass = row?.character?.class?.name || "";

    if (row?.status !== "ready") {
        return [spec, charClass].filter(Boolean).join(" ") || "";
    }

    return [spec, charClass].filter(Boolean).join(" ") || "Unknown specialization";
}

function getBracketContext(value) {
    const rawValue = typeof value === "string" ? value : value?.name || "";
    const normalized = normalizeComparable(rawValue);

    if (normalized.includes("shuffle")) {
        return { key: "shuffle", name: "Solo Shuffle", isSolo: true };
    }

    if (normalized.includes("blitz")) {
        return { key: "blitz", name: "BG Blitz", isSolo: true };
    }

    if (normalized.includes("2v2")) {
        return { key: "2v2", name: "2v2", isSolo: false };
    }

    if (normalized.includes("3v3")) {
        return { key: "3v3", name: "3v3", isSolo: false };
    }

    if (normalized === "rbg" || normalized.includes("ratedbattleground")) {
        return { key: "rbg", name: "Rated Battleground", isSolo: false };
    }

    return {
        key: normalized,
        name: normalizeBracketLabel(rawValue),
        isSolo: false,
    };
}

function bracketKeyMatches(entryKey, bracketKey) {
    const normalizedEntryKey = normalizeComparable(entryKey);

    if (!normalizedEntryKey || !bracketKey) return false;

    if (bracketKey === "shuffle") return normalizedEntryKey.includes("shuffle");
    if (bracketKey === "blitz") return normalizedEntryKey.includes("blitz");
    if (bracketKey === "rbg") {
        return normalizedEntryKey === "rbg" || normalizedEntryKey.includes("ratedbattleground");
    }

    return normalizedEntryKey.includes(bracketKey);
}

function getBestBracketEntry(character) {
    const entries = Object.entries(character?.rating || {});
    let bestEntry = null;
    let bestScore = -1;

    entries.forEach(([entryKey, entryValue]) => {
        const score = Number(entryValue?.currentSeason?.rating ?? 0);

        if (score > bestScore) {
            bestScore = score;
            bestEntry = [entryKey, entryValue];
        }
    });

    return bestEntry || entries[0] || null;
}

function resolveLobbyBracketData(character, row, bracket) {
    const entries = Object.entries(character?.rating || {});
    const requestedBracket = getBracketContext(bracket);

    if (!entries.length) {
        return {
            key: "",
            data: null,
            context: requestedBracket,
        };
    }

    const specToken = normalizeComparable(getDisplaySpec(row));
    let resolvedEntry = null;

    if (requestedBracket.key === "shuffle" || requestedBracket.key === "blitz") {
        resolvedEntry = entries.find(([entryKey]) => {
            const normalizedEntryKey = normalizeComparable(entryKey);
            return (
                bracketKeyMatches(entryKey, requestedBracket.key) &&
                (!specToken || normalizedEntryKey.includes(specToken))
            );
        });
    }

    if (!resolvedEntry && requestedBracket.key) {
        resolvedEntry = entries.find(([entryKey]) =>
            bracketKeyMatches(entryKey, requestedBracket.key)
        );
    }

    if (!resolvedEntry) {
        resolvedEntry = getBestBracketEntry(character);
    }

    return {
        key: resolvedEntry?.[0] || "",
        data: resolvedEntry?.[1] || null,
        context: getBracketContext(resolvedEntry?.[0] || bracket),
        usedRequestedBracket: Boolean(resolvedEntry && requestedBracket.key && bracketKeyMatches(resolvedEntry[0], requestedBracket.key)),
    };
}

function mapLobbyRowToTableRow(row, bracket) {
    const playerName = row?.character?.name || row?.displaySearch || "Unknown player";
    const playerSubline = getPlayerSubline(row);
    const playerIcon = getSpecIcon(row);
    const roleValue = String(getRoleLabel(row) || "").toLowerCase();
    const isReady = row.status === "ready" && row.character;
    const isMissing = row.status === "missing";

    if (!isReady) {
        return {
            rowId: row.rowId,
            team: row.team,
            status: row.status,
            href: "",
            playerName,
            playerSubline,
            playerIcon,
            roleValue,
            ratingValue: isMissing ? "No data" : "",
            ratingSortValue: null,
            xpTitle:
                isMissing
                    ? row.message || "The player could not be resolved."
                    : "",
            xpIcon: playerIcon,
            xpSortValue: null,
            recordValue: "",
            recordSortValue: null,
            avgItemLevel: isMissing ? "Unknown" : "",
            avgItemLevelSortValue: null,
        };
    }

    const resolvedBracket = resolveLobbyBracketData(row.character, row, bracket);
    const achievement = getLobbyBracketAchievement(row.character, resolvedBracket.context);
    const bracketData = resolvedBracket.data;
    const ratingValue = bracketData?.currentSeason?.rating;
    const resolvedRecordValue = getBracketRecordValue(bracketData);
    const avgItemLevel = getAverageItemLevel(row.character);

    return {
        rowId: row.rowId,
        team: row.team,
        status: row.status,
        href: getCharacterHref(row.character),
        playerName,
        playerSubline,
        playerIcon,
        roleValue,
        ratingValue:
            ratingValue === 0 || Number.isFinite(Number(ratingValue))
                ? String(ratingValue)
                : "No rating",
        ratingSortValue:
            ratingValue === 0 || Number.isFinite(Number(ratingValue)) ? Number(ratingValue) : null,
        xpTitle: achievement?.name || "No XP yet",
        xpIcon: achievement?.media || playerIcon,
        xpSortValue: getXpSortValue(achievement),
        recordValue: resolvedRecordValue,
        recordSortValue: Number.isFinite(Number(resolvedRecordValue))
            ? Number(resolvedRecordValue)
            : null,
        avgItemLevel,
        avgItemLevelSortValue: Number.isFinite(Number(avgItemLevel))
            ? Number(avgItemLevel)
            : null,
    };
}

function getCharacterHref(character) {
    const server = character?.server;
    const realm = character?.playerRealm?.slug;
    const name = character?.name;

    if (!server || !realm || !name) {
        return "";
    }

    return `/check/${encodeURIComponent(server)}/${encodeURIComponent(realm)}/${encodeURIComponent(
        name
    )}`;
}

function getSocketLabel(status) {
    if (status === "connecting") return "Socket connecting";
    if (status === "ready") return "Socket ready";
    if (status === "loading") return "Streaming live";
    if (status === "success") return "Lobby streamed";
    if (status === "error") return "Socket error";
    if (status === "closed") return "Socket closed";
    return "Lobby scan";
}

function getStatusTone(status) {
    if (status === "error" || status === "closed") return Style.statusPillError;
    if (status === "success") return Style.statusPillSuccess;
    if (status === "loading" || status === "connecting") return Style.statusPillLive;
    return "";
}

function getPayloadEntryId(payload) {
    return normalizeServerEntryId(
        payload?.initSearch || payload?.initialSearch || payload?.search || payload?.data?.initSearch
    );
}

function LoadingPanel({ stepIndex }) {
    return (
        <section className={Style.livePanel} aria-live="polite">
            <div className={Style.livePanelHeader}>
                <div>
                    <span className={Style.sectionEyebrow}>Live retrieval</span>
                    <h2>Scanning lobby</h2>
                    <p>Parsing the pasted string and streaming player data through the live feed.</p>
                </div>
                <div className={Style.liveBadge}>
                    <FiZap />
                    <span>Active</span>
                </div>
            </div>

            <div className={Style.loadingShell}>
                <div className={Style.loadingVisual} aria-hidden="true">
                    <div className={Style.loadingRingOuter} />
                    <div className={Style.loadingRingMid} />
                    <div className={Style.loadingRingInner} />
                    <div className={Style.loadingCore} />
                    <div className={Style.loadingSweep} />
                </div>

                <div className={Style.loadingSteps}>
                    {LOADING_STEPS.map((step, index) => {
                        const active = index === stepIndex;
                        const done = index < stepIndex;

                        return (
                            <div
                                key={step}
                                className={`${Style.loadingStep} ${
                                    active ? Style.loadingStepActive : ""
                                } ${done ? Style.loadingStepDone : ""}`}
                            >
                                <span className={Style.loadingStepDot}>
                                    {done ? <FiCheckCircle /> : <span />}
                                </span>
                                <span>{step}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function ErrorPanel({ message, onRetry, onReset }) {
    return (
        <section className={Style.livePanel}>
            <div className={Style.livePanelHeader}>
                <div>
                    <span className={Style.sectionEyebrow}>Scan blocked</span>
                    <h2>Lobby scan failed</h2>
                    <p>{message}</p>
                </div>
            </div>

            <div className={Style.errorShell} role="alert">
                <div className={Style.errorIcon}>
                    <FiAlertTriangle />
                </div>
                <div className={Style.errorContent}>
                    <strong>Reconnect the websocket and send the scan again.</strong>
                    <span>The page is ready to retry without leaving the flow.</span>
                </div>
            </div>

            <div className={Style.actionRow}>
                <button type="button" className={Style.primaryButton} onClick={onRetry}>
                    <FiRefreshCw />
                    <span>Retry Scan</span>
                </button>
                <button type="button" className={Style.ghostButton} onClick={onReset}>
                    Reset
                </button>
            </div>
        </section>
    );
}

function IdlePanel() {
    return (
        <section className={`${Style.livePanel} ${Style.idlePanel}`}>
            <div className={Style.idleSectionShell}>
                <div className={Style.idleSectionHeader}>
                    <div>
                        <h2>How it works</h2>
                        <p>Scan in-game, copy the addon string, then paste it here before the gates open.</p>
                    </div>
                </div>

                <ol className={Style.idleCardGrid}>
                    <li className={Style.idleWorkflowCard}>
                        <div className={Style.idleCardTop}>
                            <span className={Style.idleCardIcon} aria-hidden="true">
                                <FiCheckCircle />
                            </span>
                            <span className={Style.idleCardNumber}>01</span>
                        </div>
                        <div className={Style.idleCardContent}>
                            <h3>Connection Ready</h3>
                            <p>Socket ready</p>
                        </div>
                    </li>
                    <li className={Style.idleWorkflowCard}>
                        <div className={Style.idleCardTop}>
                            <span className={Style.idleCardIcon} aria-hidden="true">
                                <FiSearch />
                            </span>
                            <span className={Style.idleCardNumber}>02</span>
                        </div>
                        <div className={Style.idleCardContent}>
                            <h3>Paste Addon Payload</h3>
                            <p>Copy the lobby string from the addon and paste it here before the gates open.</p>
                        </div>
                    </li>
                    <li className={Style.idleWorkflowCard}>
                        <div className={Style.idleCardTop}>
                            <span className={Style.idleCardIcon} aria-hidden="true">
                                <FiZap />
                            </span>
                            <span className={Style.idleCardNumber}>03</span>
                        </div>
                        <div className={Style.idleCardContent}>
                            <h3>Review Live Results</h3>
                            <p>See each team fill in with player rating, record, and average item level.</p>
                        </div>
                    </li>
                </ol>
            </div>
        </section>
    );
}

function ResultsPanel({
    rows,
    bracket,
}) {
    const sortedRows = [...rows].sort((left, right) => {
        const leftOrder = Number(left?.order ?? 0);
        const rightOrder = Number(right?.order ?? 0);
        return leftOrder - rightOrder;
    });
    const sections = [
        {
            key: "team1",
            title: "Team 1",
            rows: sortedRows.filter((row) => row.team === "team1"),
        },
        {
            key: "team2",
            title: "Team 2",
            rows: sortedRows.filter((row) => row.team === "team2"),
        },
        {
            key: "unassigned",
            title: "Unassigned",
            rows: sortedRows.filter((row) => row.team !== "team1" && row.team !== "team2"),
        },
    ].filter((section) => section.rows.length > 0);

    const openProfile = (href) => {
        if (!href || typeof window === "undefined") return;
        window.open(href, "_blank", "noopener,noreferrer");
    };

    return (
        <section className={Style.resultsSection}>
            <LobbyPlayersTable
                sections={sections.map((section) => ({
                    ...section,
                    rows: section.rows.map((row) => mapLobbyRowToTableRow(row, bracket)),
                }))}
                onOpen={openProfile}
            />
        </section>
    );
}

export default function LobbyScan() {
    const [status, setStatus] = useState("connecting");
    const [input, setInput] = useState("");
    const [rows, setRows] = useState([]);
    const [bracket, setBracket] = useState(null);
    const [error, setError] = useState("");
    const [stepIndex, setStepIndex] = useState(0);

    const socketRef = useRef(null);
    const pendingPayloadRef = useRef("");
    const scanTrackingRef = useRef({ ...INITIAL_SCAN_TRACKING });

    const resetScanTracking = useCallback(() => {
        scanTrackingRef.current = { ...INITIAL_SCAN_TRACKING };
    }, []);

    const closeSocket = useCallback(({ autoClosed = false } = {}) => {
        const socket = socketRef.current;

        if (!socket) {
            if (autoClosed) {
                scanTrackingRef.current.scanAutoClosed = true;
                setStatus("success");
            }
            return;
        }

        scanTrackingRef.current.scanAutoClosed = autoClosed;
        socketRef.current = null;

        if (
            socket.readyState === WebSocket.OPEN ||
            socket.readyState === WebSocket.CONNECTING
        ) {
            socket.close();
        }

        if (autoClosed) {
            setStatus("success");
            setError("");
        }
    }, []);

    const sendPayload = useCallback((socket) => {
        const scanPayload = pendingPayloadRef.current.trim();

        if (!scanPayload) return;

        const payload = {
            type: "queueCheck",
            data: scanPayload,
        };

        if (!socket || socket.readyState !== WebSocket.OPEN) {
            throw new Error("The lobby websocket is not ready.");
        }

        socket.send(JSON.stringify(payload));
        pendingPayloadRef.current = "";
        setStatus("loading");
        setError("");
    }, []);

    const connect = useCallback(() => {
        const existing = socketRef.current;

        if (
            existing &&
            (existing.readyState === WebSocket.OPEN ||
                existing.readyState === WebSocket.CONNECTING)
        ) {
            return existing;
        }

        const socket = new WebSocket(SOCKET_URL);
        socketRef.current = socket;

        setStatus("connecting");
        setError("");

        socket.onopen = () => {
            if (socketRef.current !== socket) return;

            setStatus("ready");

            try {
                sendPayload(socket);
            } catch (err) {
                setError(err?.message || "Failed to send the scan payload.");
                setStatus("error");
            }
        };

        socket.onmessage = (event) => {
            if (socketRef.current !== socket) return;

            try {
                if (typeof event.data !== "string") {
                    throw new Error("Received a non-text websocket payload.");
                }

                const parsed = JSON.parse(event.data);

                if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
                    throw new Error("Received an invalid websocket payload.");
                }

                if (parsed.type === "bracketObj") {
                    setBracket(parsed);
                    setError("");
                    return;
                }

                if (parsed.type === "team1IDs" || parsed.type === "team2IDs") {
                    if (!Array.isArray(parsed.data)) {
                        throw new Error("Received an invalid team IDs payload.");
                    }

                    if (parsed.type === "team1IDs") {
                        scanTrackingRef.current.hasTeam1Payload = true;
                    } else {
                        scanTrackingRef.current.hasTeam2Payload = true;
                    }

                    scanTrackingRef.current.usesLegacyPlayerIds = false;

                    setRows((current) =>
                        upsertTeamRows(current, parsed.data, parsed.type === "team1IDs" ? "team1" : "team2")
                    );
                    setError("");
                    return;
                }

                if (parsed.type === "playerIDs") {
                    if (!Array.isArray(parsed.data)) {
                        throw new Error("Received an invalid player IDs payload.");
                    }

                    if (
                        !scanTrackingRef.current.hasTeam1Payload &&
                        !scanTrackingRef.current.hasTeam2Payload
                    ) {
                        scanTrackingRef.current.usesLegacyPlayerIds = true;
                    }

                    setRows((current) => upsertTeamRows(current, parsed.data, "unassigned"));
                    setError("");
                    return;
                }

                const serverEntryId = getPayloadEntryId(parsed);

                if (parsed.type === "charData") {
                    if (parsed.data && typeof parsed.data === "object" && !Array.isArray(parsed.data)) {
                        const nextCharacter = {
                            ...parsed.data,
                            initSearch: parsed.initSearch || "",
                            searchSpecRequested: parsed.searchSpecRequested || null,
                        };

                        setRows((current) => mergeCharacter(current, serverEntryId, nextCharacter));
                        setError("");
                        return;
                    }

                    if (serverEntryId) {
                        const message =
                            parsed?.data?.errorMSG ||
                            parsed?.errorMSG ||
                            "The server returned no data for this character.";

                        setRows((current) =>
                            markEntryMissing(
                                current,
                                serverEntryId,
                                message,
                                parsed.searchSpecRequested || null
                            )
                        );
                        setError("");
                        return;
                    }
                }

                if (serverEntryId && (parsed?.errorMSG || parsed?.data?.errorMSG)) {
                    const message =
                        parsed?.data?.errorMSG ||
                        parsed?.errorMSG ||
                        "The server returned no data for this character.";

                    setRows((current) =>
                        markEntryMissing(
                            current,
                            serverEntryId,
                            message,
                            parsed.searchSpecRequested || null
                        )
                    );
                    setError("");
                    return;
                }
            } catch (err) {
                setError(err?.message || "Failed to process the websocket payload.");
                setStatus("error");
            }
        };

        socket.onerror = () => {
            if (socketRef.current !== socket) return;

            setError("The lobby websocket connection reported an unexpected error.");
            setStatus("error");
        };

        socket.onclose = () => {
            if (socketRef.current !== socket) return;

            socketRef.current = null;
            setStatus(scanTrackingRef.current.scanAutoClosed ? "success" : "closed");
        };

        return socket;
    }, [sendPayload]);

    useEffect(() => {
        const socket = connect();

        return () => {
            pendingPayloadRef.current = "";

            if (socketRef.current === socket) {
                socketRef.current = null;
            }

            if (
                socket &&
                (socket.readyState === WebSocket.OPEN ||
                    socket.readyState === WebSocket.CONNECTING)
            ) {
                socket.close();
            }
        };
    }, [connect]);

    useEffect(() => {
        const socket = socketRef.current;
        const hasRows = rows.length > 0;
        const hasLoadingRows = rows.some((row) => row?.status === "loading");
        const allRowsResolved = hasRows && !hasLoadingRows;
        const team1Count = rows.filter((row) => row?.team === "team1").length;
        const team2Count = rows.filter((row) => row?.team === "team2").length;
        const {
            hasTeam1Payload,
            hasTeam2Payload,
            usesLegacyPlayerIds,
            scanAutoClosed,
        } = scanTrackingRef.current;

        if (!socket || scanAutoClosed || !allRowsResolved) {
            return;
        }

        const isSocketActive =
            socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING;

        if (!isSocketActive) {
            return;
        }

        const hasAnyTeamPayload = hasTeam1Payload || hasTeam2Payload;
        const isSingleTeamOnly =
            hasAnyTeamPayload && (team1Count === 0 || team2Count === 0);

        const shouldClose = usesLegacyPlayerIds
            ? hasRows
            : hasAnyTeamPayload && (hasTeam1Payload && hasTeam2Payload || isSingleTeamOnly);

        if (!shouldClose) {
            return;
        }

        closeSocket({ autoClosed: true });
    }, [closeSocket, rows]);

    useEffect(() => {
        if (status !== "connecting" && status !== "loading") {
            setStepIndex(0);
            return;
        }

        setStepIndex(status === "connecting" ? 0 : 1);

        const timer = setInterval(() => {
            setStepIndex((current) => {
                const min = status === "connecting" ? 0 : 1;
                const max = LOADING_STEPS.length - 1;

                return current >= max ? min : current + 1;
            });
        }, 900);

        return () => clearInterval(timer);
    }, [status]);

    const startScan = useCallback(() => {
        const payload = normalizeLobbyPayload(input);

        if (!payload) {
            setError("Paste a PvP Scalpel lobby string before starting the scan.");
            setStatus("error");
            return;
        }

        closeSocket();
        resetScanTracking();
        pendingPayloadRef.current = payload;
        setRows([]);
        setBracket(null);
        setError("");
        connect();
    }, [closeSocket, connect, input, resetScanTracking]);

    const handleSubmit = (event) => {
        event.preventDefault();
        startScan();
    };

    const handleRetry = () => {
        const socket = socketRef.current;

        if (
            !socket ||
            socket.readyState === WebSocket.CLOSED ||
            socket.readyState === WebSocket.CLOSING
        ) {
            connect();
            return;
        }

        startScan();
    };

    const handleReset = () => {
        closeSocket();
        resetScanTracking();
        pendingPayloadRef.current = "";
        setInput("");
        setRows([]);
        setBracket(null);
        setError("");

        connect();
    };

    const showLoadingPanel =
        (status === "connecting" || status === "loading") && rows.length === 0;
    const showError = status === "error" || (status === "closed" && rows.length === 0);
    const showResults = rows.length > 0;

    return (
        <section className={Style.page}>
            <SEOLobbyScan />

            <div className={Style.pageBackdrop} aria-hidden="true">
                <div className={Style.backdropGlowTop} />
                <div className={Style.backdropGlowLeft} />
                <div className={Style.backdropGlowRight} />
                <div className={Style.backdropPattern} />
                <div className={Style.backdropVignette} />
            </div>

            <div className={Style.container}>
                <section className={Style.heroSection}>
                    <div className={Style.heroFrame}>
                        <img
                            src="/logo/logo_resized.png"
                            alt="PvP Scalpel Logo"
                            className={Style.logo}
                        />
                        {/* <div className={`${Style.statusPill} ${getStatusTone(status)}`}>
                            <span className={Style.statusDot} />
                            <span>{getSocketLabel(status)}</span>
                        </div> */}

                        <h1 className={Style.heroTitle}>Lobby Scan</h1>

                        <form className={Style.scanForm} onSubmit={handleSubmit}>
                            <div className={Style.scanBar}>
                                <div className={Style.scanInputWrap}>
                                    <span className={Style.scanInputIcon} aria-hidden="true">
                                        <FiSearch />
                                    </span>

                                    <textarea
                                        id="lobbyScanInput"
                                        className={Style.scanInput}
                                        value={input}
                                        onChange={(event) => setInput(event.target.value)}
                                        placeholder="Paste your lobby code here..."
                                        rows={3}
                                    />
                                </div>

                                <button type="submit" className={Style.scanButton}>
                                    <span>Scan Lobby</span>
                                    <FiZap />
                                </button>
                            </div>

                            <div className={Style.helperLine}>
                                <span>Copy from addon</span>
                                <span className={Style.helperDivider} />
                                <span>Paste before gates open</span>
                                <span className={Style.helperDivider} />
                                <span>Stream live player reads</span>
                            </div>
                        </form>
                    </div>
                </section>

                {showLoadingPanel && <LoadingPanel stepIndex={stepIndex} />}
                {showError && (
                    <ErrorPanel
                        message={error || "The lobby connection is unavailable right now."}
                        onRetry={handleRetry}
                        onReset={handleReset}
                    />
                )}
                {!showLoadingPanel && !showError && !showResults && <IdlePanel />}
                {showResults && (
                    <ResultsPanel
                        rows={rows}
                        bracket={bracket}
                    />
                )}
            </div>
        </section>
    );
}
