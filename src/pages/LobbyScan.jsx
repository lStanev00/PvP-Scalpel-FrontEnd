import { useCallback, useEffect, useRef, useState } from "react";
import {
    FiActivity,
    FiAlertTriangle,
    FiCheckCircle,
    FiHeart,
    FiRefreshCw,
    FiSearch,
    FiShield,
    FiTarget,
    FiTrendingUp,
    FiZap,
} from "react-icons/fi";
import SEOLobbyScan from "../SEO/SEOLobbyScan.jsx";
import Style from "../Styles/modular/LobbyScan.module.css";

const SOCKET_URL = "wss://ws.pvpscalpel.com";

const LOADING_STEPS = [
    "Opening websocket connection",
    "Sending scan payload",
    "Receiving bracket context",
    "Receiving player IDs and streamed players",
];

function getCharacterKey(character) {
    if (!character || typeof character !== "object") return null;

    if (character._id) return String(character._id);

    const server = String(character.server || "").trim().toLowerCase();
    const realm = String(
        character.playerRealm?.slug || character.playerRealm?.name || ""
    )
        .trim()
        .toLowerCase();
    const name = String(character.name || "").trim().toLowerCase();

    if (!server && !realm && !name) return null;

    return `${server}:${realm}:${name}`;
}

function mergeCharacter(list, nextCharacter) {
    const key = getCharacterKey(nextCharacter);

    if (!key) return list;

    const index = list.findIndex((entry) => getCharacterKey(entry) === key);

    if (index === -1) {
        return [...list, nextCharacter];
    }

    const next = [...list];
    next[index] = nextCharacter;
    return next;
}

function normalizeBracketLabel(value) {
    if (!value) return "PvP";

    return value
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (match) => match.toUpperCase());
}

function getBestRating(character) {
    if (!character?.rating || typeof character.rating !== "object") {
        return {
            value: "No rating",
            bracket: "No bracket",
        };
    }

    let bestRating = 0;
    let bestBracket = "";

    Object.entries(character.rating).forEach(([bracketKey, bracketValue]) => {
        const currentRating = Number(bracketValue?.currentSeason?.rating ?? 0);

        if (currentRating > bestRating) {
            bestRating = currentRating;
            bestBracket = bracketKey;
        }
    });

    if (!bestRating) {
        return {
            value: "No rating",
            bracket: "No bracket",
        };
    }

    return {
        value: String(bestRating),
        bracket: normalizeBracketLabel(bestBracket),
    };
}

function getDisplaySpec(character) {
    return (
        character?.searchSpecRequested?.name ||
        character?.activeSpec?.name ||
        "Unknown spec"
    );
}

function getAverageItemLevel(character) {
    const gearEntries = Object.values(character?.gear || {}).filter((item) => {
        const level = Number(item?.level);
        return Number.isFinite(level) && level > 1;
    });

    if (!gearEntries.length) {
        return "Unknown";
    }

    const totalItemLevel = gearEntries.reduce((sum, item) => {
        return sum + Number(item.level);
    }, 0);

    return String(Math.round(totalItemLevel / gearEntries.length));
}

function getRealmLabel(character) {
    const realm = character?.playerRealm?.name || "Unknown realm";
    const region = character?.server ? String(character.server).toUpperCase() : "";

    return region ? `${realm} (${region})` : realm;
}

function getAvatar(character) {
    return (
        character?.media?.avatar ||
        character?.media?.charImg ||
        character?.media?.banner ||
        ""
    );
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

function IdlePanel({ status }) {
    return (
        <section className={Style.livePanel}>
            <div className={Style.livePanelHeader}>
                <div>
                    <span className={Style.sectionEyebrow}>Ready surface</span>
                    <h2>Waiting for a lobby string</h2>
                    <p>Scan in-game, copy the addon string, then paste it here before the gates open.</p>
                </div>
            </div>

            <div className={Style.idleGrid}>
                <article className={Style.idleCard}>
                    <span className={Style.idleLabel}>Connection</span>
                    <strong>{getSocketLabel(status)}</strong>
                </article>
                <article className={Style.idleCard}>
                    <span className={Style.idleLabel}>Input</span>
                    <strong>Addon lobby payload</strong>
                </article>
                <article className={Style.idleCard}>
                    <span className={Style.idleLabel}>Output</span>
                    <strong>Bracket, player IDs, and streamed character data</strong>
                </article>
            </div>
        </section>
    );
}

function ResultsPanel({
    status,
    players,
    bracketName,
    expectedPlayerCount,
    onRetry,
    onReset,
}) {
    const firstPlayer = players[0];

    return (
        <section className={Style.resultsSection}>
            <div className={Style.resultsHeader}>
                <div>
                    <span className={Style.sectionEyebrow}>Live snapshot</span>
                    <h2>Lobby scan results</h2>
                </div>

                <div className={Style.actionRow}>
                    <button type="button" className={Style.secondaryButton} onClick={onRetry}>
                        <FiRefreshCw />
                        <span>Refresh</span>
                    </button>
                    <button type="button" className={Style.ghostButton} onClick={onReset}>
                        Reset
                    </button>
                </div>
            </div>

            <div className={Style.summaryStrip}>
                <article className={Style.summaryCard}>
                    <span>Connection</span>
                    <strong>{getSocketLabel(status)}</strong>
                </article>
                <article className={Style.summaryCard}>
                    <span>Bracket</span>
                    <strong>{bracketName || "Waiting"}</strong>
                </article>
                <article className={Style.summaryCard}>
                    <span>Expected</span>
                    <strong>{expectedPlayerCount || "Unknown"}</strong>
                </article>
                <article className={Style.summaryCard}>
                    <span>Received</span>
                    <strong>{players.length}</strong>
                </article>
            </div>

            <div className={Style.playersPanel}>
                <div className={Style.playersPanelHeader}>
                    <h3>Streamed Team</h3>
                    <span>
                        {players.length}
                        {expectedPlayerCount ? ` / ${expectedPlayerCount}` : ""} players received
                    </span>
                </div>

                <div className={Style.playersList}>
                    {players.map((player) => {
                        const avatar = getAvatar(player);
                        const rating = getBestRating(player);
                        const averageItemLevel = getAverageItemLevel(player);

                        return (
                            <article key={getCharacterKey(player)} className={Style.playerCard}>
                                <div className={Style.playerMain}>
                                    <div className={Style.playerAvatar}>
                                        {avatar ? (
                                            <img
                                                src={avatar}
                                                alt=""
                                                className={Style.playerAvatarImage}
                                            />
                                        ) : (
                                            <FiShield />
                                        )}
                                    </div>

                                    <div className={Style.playerIdentity}>
                                        <strong>{player?.name || "Unknown character"}</strong>
                                        <span>
                                            {getDisplaySpec(player)} |{" "}
                                            {player?.class?.name || "Unknown class"}
                                        </span>
                                    </div>
                                </div>

                                <div className={Style.playerMeta}>
                                    <div className={Style.playerStat}>
                                        <span>Realm</span>
                                        <strong>{getRealmLabel(player)}</strong>
                                    </div>

                                    <div className={Style.playerStat}>
                                        <span>Best Rating</span>
                                        <strong>{rating.value}</strong>
                                        <em>{rating.bracket}</em>
                                    </div>

                                    <div className={Style.playerStat}>
                                        <span>Guild</span>
                                        <strong>{player?.guildName || "Independent"}</strong>
                                    </div>

                                    <div className={Style.playerStat}>
                                        <span>Avg ilvl</span>
                                        <strong>{averageItemLevel}</strong>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default function LobbyScan() {
    const [status, setStatus] = useState("connecting");
    const [input, setInput] = useState("");
    const [players, setPlayers] = useState([]);
    const [bracketName, setBracketName] = useState("");
    const [expectedPlayerIds, setExpectedPlayerIds] = useState([]);
    const [error, setError] = useState("");
    const [stepIndex, setStepIndex] = useState(0);

    const socketRef = useRef(null);
    const pendingPayloadRef = useRef("");

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
                    setBracketName(parsed?.name || "Unknown bracket");
                    setError("");
                    return;
                }

                if (parsed.type === "playerIDs") {
                    if (!Array.isArray(parsed.data)) {
                        throw new Error("Received an invalid player IDs payload.");
                    }

                    setExpectedPlayerIds(parsed.data.map((entry) => String(entry)));
                    setError("");
                    return;
                }

                if (parsed.type === "charData") {
                    if (!parsed.data || typeof parsed.data !== "object" || Array.isArray(parsed.data)) {
                        throw new Error("Received an invalid character data payload.");
                    }

                    const nextCharacter = {
                        ...parsed.data,
                        initSearch: parsed.initSearch || "",
                        searchSpecRequested: parsed.searchSpecRequested || null,
                    };

                    setPlayers((current) => mergeCharacter(current, nextCharacter));
                    setStatus("success");
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

            setError("The websocket connection reported an unexpected error.");
            setStatus("error");
        };

        socket.onclose = () => {
            if (socketRef.current !== socket) return;

            socketRef.current = null;
            setStatus("closed");
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
        const payload = input.trim();

        if (!payload) {
            setError("Paste a PvP Scalpel lobby string before starting the scan.");
            setStatus("error");
            return;
        }

        pendingPayloadRef.current = payload;
        setPlayers([]);
        setBracketName("");
        setExpectedPlayerIds([]);
        setError("");

        const socket = socketRef.current;

        if (socket?.readyState === WebSocket.OPEN) {
            try {
                sendPayload(socket);
                return;
            } catch (err) {
                setError(err?.message || "Failed to send the scan payload.");
                setStatus("error");
                return;
            }
        }

        connect();
    }, [connect, input, sendPayload]);

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
        pendingPayloadRef.current = "";
        setInput("");
        setPlayers([]);
        setBracketName("");
        setExpectedPlayerIds([]);
        setError("");

        const socket = socketRef.current;

        if (socket?.readyState === WebSocket.OPEN) {
            setStatus("ready");
            return;
        }

        connect();
    };

    const showLoading = status === "connecting" || status === "loading";
    const showError = status === "error" || (status === "closed" && players.length === 0);
    const showResults = players.length > 0;

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
                        <div className={`${Style.statusPill} ${getStatusTone(status)}`}>
                            <span className={Style.statusDot} />
                            <span>{getSocketLabel(status)}</span>
                        </div>

                        <h1 className={Style.heroTitle}>Lobby Scanner</h1>
                        <p className={Style.heroLead}>Quickly analyze your lobbies.</p>

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

                        <div className={Style.featureCards}>
                            <article className={Style.featureCard}>
                                <div className={Style.featureIcon}>
                                    <FiTarget />
                                </div>
                                <div className={Style.featureBody}>
                                    <strong>Bracket</strong>
                                    <span>See the lobby context instantly.</span>
                                </div>
                            </article>

                            <article className={Style.featureCard}>
                                <div className={Style.featureIcon}>
                                    <FiTrendingUp />
                                </div>
                                <div className={Style.featureBody}>
                                    <strong>Rating</strong>
                                    <span>Pull the strongest visible rating signal.</span>
                                </div>
                            </article>

                            <article className={Style.featureCard}>
                                <div className={Style.featureIcon}>
                                    <FiHeart />
                                </div>
                                <div className={Style.featureBody}>
                                    <strong>Health</strong>
                                    <span>Prepare the layout for health-aware reads.</span>
                                </div>
                            </article>

                            <article className={Style.featureCard}>
                                <div className={Style.featureIcon}>
                                    <FiActivity />
                                </div>
                                <div className={Style.featureBody}>
                                    <strong>Player IDs</strong>
                                    <span>Track expected responses before character data arrives.</span>
                                </div>
                            </article>
                        </div>
                    </div>
                </section>

                {showLoading && <LoadingPanel stepIndex={stepIndex} />}
                {showError && (
                    <ErrorPanel
                        message={error || "The lobby connection is unavailable right now."}
                        onRetry={handleRetry}
                        onReset={handleReset}
                    />
                )}
                {!showLoading && !showError && !showResults && <IdlePanel status={status} />}
                {showResults && (
                    <ResultsPanel
                        status={status}
                        players={players}
                        bracketName={bracketName}
                        expectedPlayerCount={expectedPlayerIds.length}
                        onRetry={handleRetry}
                        onReset={handleReset}
                    />
                )}
            </div>
        </section>
    );
}
