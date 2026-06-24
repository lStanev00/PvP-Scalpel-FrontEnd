/* eslint-disable react/prop-types */

import { useEffect, useRef, useState } from "react";
import {
    FaCompress,
    FaExpand,
    FaPause,
    FaPlay,
    FaRotateLeft,
    FaVolumeHigh,
    FaVolumeXmark,
} from "react-icons/fa6";
import { formatMediaTime } from "../../helpers/mediaFormatting.js";
import Style from "./VideoPlayer.module.css";

const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 2];

function setForwardedRef(ref, value) {
    if (typeof ref === "function") {
        ref(value);
    } else if (ref && typeof ref === "object") {
        ref.current = value;
    }
}

function isInteractiveTarget(target) {
    if (!(target instanceof HTMLElement)) return false;

    return Boolean(
        target.closest(
            "button, input, select, textarea, a[href], [contenteditable='true']",
        ),
    );
}

function formatSeekFeedbackSeconds(seconds) {
    return Number(seconds.toFixed(1)).toString();
}

export default function VideoPlayer({
    src,
    poster,
    title = "PvP Scalpel video",
    playRange,
    editableRange,
    bufferGate,
    mediaRef,
    onLoadedMetadata,
    onTimeUpdate,
    onPlay,
    onPause,
    onError,
    className = "",
}) {
    const playerRef = useRef(null);
    const videoRef = useRef(null);
    const controlsTimerRef = useRef(null);
    const seekFeedbackTimerRef = useRef(null);
    const speedFeedbackTimerRef = useRef(null);
    const seekFeedbackRef = useRef({ direction: null, seconds: 0 });
    const heldSeekBoundaryRef = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [muted, setMuted] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [fullscreen, setFullscreen] = useState(false);
    const [controlsVisible, setControlsVisible] = useState(false);
    const [seekFeedback, setSeekFeedback] = useState(null);
    const [speedFeedback, setSpeedFeedback] = useState(null);
    const [bufferedRanges, setBufferedRanges] = useState([]);
    const [bufferedPercent, setBufferedPercent] = useState(0);

    const bufferGateEnabled = bufferGate?.enabled === true;

    useEffect(() => {
        setForwardedRef(mediaRef, videoRef.current);
        return () => setForwardedRef(mediaRef, null);
    }, [mediaRef]);

    useEffect(() => {
        const handleFullscreenChange = () => {
            const isFullscreen = document.fullscreenElement === playerRef.current;
            setFullscreen(isFullscreen);
            setControlsVisible(isFullscreen);
            window.clearTimeout(controlsTimerRef.current);
            if (isFullscreen) {
                controlsTimerRef.current = window.setTimeout(() => {
                    setControlsVisible(false);
                }, 2000);
            }
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    useEffect(() => {
        return () => {
            window.clearTimeout(controlsTimerRef.current);
            window.clearTimeout(seekFeedbackTimerRef.current);
            window.clearTimeout(speedFeedbackTimerRef.current);
        };
    }, []);

    useEffect(() => {
        window.clearTimeout(seekFeedbackTimerRef.current);
        window.clearTimeout(speedFeedbackTimerRef.current);
        seekFeedbackRef.current = { direction: null, seconds: 0 };
        heldSeekBoundaryRef.current = null;
        setPlaying(false);
        setCurrentTime(0);
        setDuration(0);
        if (videoRef.current) videoRef.current.playbackRate = 1;
        setPlaybackRate(1);
        setControlsVisible(false);
        setSeekFeedback(null);
        setSpeedFeedback(null);
        setBufferedRanges([]);
        setBufferedPercent(0);
        if (bufferGateEnabled) videoRef.current?.load();
    }, [bufferGateEnabled, src]);

    const scheduleControlsHide = () => {
        window.clearTimeout(controlsTimerRef.current);
        controlsTimerRef.current = window.setTimeout(() => {
            setControlsVisible(false);
        }, 2000);
    };

    const revealControls = () => {
        setControlsVisible(true);
        if (fullscreen) scheduleControlsHide();
    };

    const handlePlayerPointerMove = (event) => {
        if (!fullscreen || event.pointerType === "touch") return;
        revealControls();
    };

    const handleVideoPointerUp = (event) => {
        playerRef.current?.focus({ preventScroll: true });

        if (event.pointerType !== "touch") {
            togglePlayback();
            return;
        }

        if (!controlsVisible) {
            setControlsVisible(true);
            return;
        }

        togglePlayback();
        if (playing) setControlsVisible(false);
    };

    const togglePlayback = async () => {
        const video = videoRef.current;
        if (!video || !bufferReady) return;

        if (video.paused) {
            if (
                Number.isFinite(rangeStart)
                && Number.isFinite(rangeEnd)
                && (video.currentTime < rangeStart || video.currentTime >= rangeEnd)
            ) {
                video.currentTime = rangeStart;
            }

            try {
                await video.play();
            } catch {
                setPlaying(false);
            }
        } else {
            video.pause();
        }
    };

    const handleMetadata = (event) => {
        const nextDuration = Number.isFinite(event.currentTarget.duration)
            ? event.currentTarget.duration
            : 0;
        setDuration(nextDuration);
        updateBufferedState(event.currentTarget, nextDuration);
        onLoadedMetadata?.(event);
    };

    const updateBufferedState = (video, knownDuration = duration) => {
        if (!bufferGateEnabled || !video) return;

        const mediaDuration = Number.isFinite(knownDuration) && knownDuration > 0
            ? knownDuration
            : video.duration;
        if (!Number.isFinite(mediaDuration) || mediaDuration <= 0) return;

        const nextRanges = [];
        let bufferedDuration = 0;

        for (let index = 0; index < video.buffered.length; index += 1) {
            const start = Math.min(mediaDuration, Math.max(0, video.buffered.start(index)));
            const end = Math.min(mediaDuration, Math.max(start, video.buffered.end(index)));
            nextRanges.push({ start, end });
            bufferedDuration += end - start;
        }

        setBufferedRanges(nextRanges);
        setBufferedPercent(Math.min(1, Math.max(0, bufferedDuration / mediaDuration)));
    };

    const handleTimeUpdate = (event) => {
        const video = event.currentTarget;

        if (
            Number.isFinite(rangeStart)
            && Number.isFinite(rangeEnd)
            && rangeEnd > rangeStart
            && video.currentTime >= rangeEnd
        ) {
            video.currentTime = rangeStart;
            if (video.paused) setCurrentTime(rangeStart);
        } else {
            setCurrentTime(video.currentTime);
        }

        onTimeUpdate?.(event);
    };

    const handleSeek = (event) => {
        const nextTime = Number(event.target.value);
        if (!videoRef.current || !Number.isFinite(nextTime)) return;
        videoRef.current.currentTime = nextTime;
        setCurrentTime(nextTime);
    };

    const seekTo = (nextTime) => {
        if (!videoRef.current || !Number.isFinite(nextTime)) return;
        videoRef.current.currentTime = nextTime;
        setCurrentTime(nextTime);
    };

    const showSeekFeedback = (direction, movedSeconds) => {
        if (!Number.isFinite(movedSeconds) || movedSeconds < 0.05) return;

        const previous = seekFeedbackRef.current;
        const seconds = previous.direction === direction
            ? previous.seconds + movedSeconds
            : movedSeconds;
        const nextFeedback = { direction, seconds };

        seekFeedbackRef.current = nextFeedback;
        setSeekFeedback(nextFeedback);
        window.clearTimeout(seekFeedbackTimerRef.current);
        seekFeedbackTimerRef.current = window.setTimeout(() => {
            seekFeedbackRef.current = { direction: null, seconds: 0 };
            setSeekFeedback(null);
        }, 1000);
    };

    const handleVolume = (event) => {
        const nextVolume = Number(event.target.value);
        if (!videoRef.current || !Number.isFinite(nextVolume)) return;
        setPlayerVolume(nextVolume);
    };

    const setPlayerVolume = (rawVolume) => {
        const video = videoRef.current;
        if (!video || !Number.isFinite(rawVolume)) return;

        const nextVolume = Math.min(1, Math.max(0, rawVolume));
        video.volume = nextVolume;
        video.muted = nextVolume === 0;
        setVolume(nextVolume);
        setMuted(nextVolume === 0);
    };

    const toggleMute = () => {
        const video = videoRef.current;
        if (!video) return;
        video.muted = !video.muted;
        setMuted(video.muted);
    };

    const setPlayerPlaybackRate = (rawRate) => {
        const video = videoRef.current;
        const nextRate = Number(rawRate);
        if (!video || !Number.isFinite(nextRate)) return null;

        video.playbackRate = nextRate;
        setPlaybackRate(nextRate);
        return nextRate;
    };

    const handlePlaybackRate = (event) => {
        setPlayerPlaybackRate(event.target.value);
    };

    const stepPlaybackRate = (direction) => {
        const video = videoRef.current;
        if (!video) return null;

        const currentRate = video.playbackRate;
        const nextRate = direction === "up"
            ? PLAYBACK_RATES.find((rate) => rate > currentRate)
            : PLAYBACK_RATES.findLast((rate) => rate < currentRate);

        return setPlayerPlaybackRate(
            nextRate ?? (direction === "up"
                ? PLAYBACK_RATES.at(-1)
                : PLAYBACK_RATES[0]),
        );
    };

    const showSpeedFeedback = (rate) => {
        if (!Number.isFinite(rate)) return;

        setSpeedFeedback(rate);
        window.clearTimeout(speedFeedbackTimerRef.current);
        speedFeedbackTimerRef.current = window.setTimeout(() => {
            setSpeedFeedback(null);
        }, 1000);
    };

    const replayFromStart = async () => {
        const video = videoRef.current;
        if (!video || !bufferReady) return;

        video.currentTime = rangeStart;
        setCurrentTime(rangeStart);

        try {
            await video.play();
        } catch {
            setPlaying(false);
        }
    };

    const toggleFullscreen = async () => {
        if (!playerRef.current) return;

        if (document.fullscreenElement) {
            await document.exitFullscreen?.();
        } else {
            await playerRef.current.requestFullscreen?.();
        }
    };

    const requestedRangeStart = editableRange?.start ?? playRange?.start;
    const requestedRangeEnd = editableRange?.end ?? playRange?.end;
    const rangeStart = Number.isFinite(Number(requestedRangeStart))
        ? Number(requestedRangeStart)
        : 0;
    const rangeEnd = Number.isFinite(Number(requestedRangeEnd))
        && Number(requestedRangeEnd) > rangeStart
        ? Number(requestedRangeEnd)
        : duration;
    const longVideoSeconds = Number.isFinite(Number(bufferGate?.longVideoSeconds))
        ? Number(bufferGate.longVideoSeconds)
        : 600;
    const shortBufferThreshold = Number.isFinite(Number(bufferGate?.shortThreshold))
        ? Math.min(1, Math.max(0, Number(bufferGate.shortThreshold)))
        : 0.5;
    const longBufferThreshold = Number.isFinite(Number(bufferGate?.longThreshold))
        ? Math.min(1, Math.max(0, Number(bufferGate.longThreshold)))
        : 0.2;
    const requiredBufferThreshold = duration > longVideoSeconds
        ? longBufferThreshold
        : shortBufferThreshold;
    const bufferReady = !bufferGateEnabled
        || (duration > 0 && bufferedPercent >= requiredBufferThreshold);
    const bufferComplete = bufferGateEnabled && bufferedPercent >= 0.999;
    const bufferedDisplayPercent = Math.round(bufferedPercent * 100);
    const requiredBufferDisplayPercent = Math.round(requiredBufferThreshold * 100);
    const bufferStatus = bufferComplete
        ? "Preview fully loaded."
        : bufferReady
            ? `Preview ready: ${bufferedDisplayPercent}% loaded. Loading continues.`
            : `Preparing preview: ${bufferedDisplayPercent}% loaded. Playback available at ${requiredBufferDisplayPercent}%.`;
    const seekMin = Math.max(0, rangeStart);
    const seekMax = Math.max(seekMin, Math.min(duration || rangeEnd, rangeEnd));
    const seekValue = Math.min(Math.max(currentTime, seekMin), seekMax || 0);
    const hasEditableRange = Boolean(editableRange && duration > 0);
    const editableStart = hasEditableRange
        ? Math.min(Math.max(0, Number(editableRange.start) || 0), duration)
        : seekMin;
    const editableEnd = hasEditableRange
        ? Math.min(
            duration,
            Math.max(editableStart, Number(editableRange.end) || duration),
        )
        : seekMax;
    const minimumRange = Math.max(0.01, Number(editableRange?.minDuration) || 0.1);
    const startPercent = duration ? (editableStart / duration) * 100 : 0;
    const endPercent = duration ? (editableEnd / duration) * 100 : 100;
    const playedPercent = duration
        ? (Math.min(Math.max(currentTime, editableStart), editableEnd) / duration) * 100
        : 0;

    const updateEditableRange = (activeHandle, rawValue) => {
        if (!hasEditableRange) return;

        let nextStart = editableStart;
        let nextEnd = editableEnd;

        if (activeHandle === "start") {
            nextStart = Math.min(
                Math.max(0, rawValue),
                editableEnd - minimumRange,
            );
        } else {
            nextEnd = Math.max(
                editableStart + minimumRange,
                Math.min(duration, rawValue),
            );
        }

        editableRange.onChange?.({
            start: nextStart,
            end: nextEnd,
            activeHandle,
        });
        seekTo(
            activeHandle === "start"
                ? nextStart
                : Math.max(nextStart, nextEnd - 0.01),
        );
    };

    const handleEditableTrackPointer = (event) => {
        if (!hasEditableRange) return;
        if (event.target instanceof HTMLInputElement) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (!bounds.width) return;

        const ratio = Math.min(
            1,
            Math.max(0, (event.clientX - bounds.left) / bounds.width),
        );
        const requestedTime = ratio * duration;
        seekTo(Math.min(editableEnd, Math.max(editableStart, requestedTime)));
    };

    const handlePlayerKeyDown = (event) => {
        if (isInteractiveTarget(event.target)) return;

        let handled = true;

        switch (event.key) {
            case " ":
            case "Spacebar":
                togglePlayback();
                break;
            case "ArrowLeft": {
                if (
                    event.repeat
                    && heldSeekBoundaryRef.current === "backward"
                ) {
                    break;
                }

                const playbackTime = videoRef.current?.currentTime ?? seekValue;
                const targetTime = Math.max(seekMin, playbackTime - 5);
                const movedSeconds = playbackTime - targetTime;

                if (movedSeconds >= 0.05) {
                    seekTo(targetTime);
                    showSeekFeedback("backward", movedSeconds);
                }
                if (targetTime <= seekMin + 0.001) {
                    heldSeekBoundaryRef.current = "backward";
                }
                break;
            }
            case "ArrowRight": {
                if (
                    event.repeat
                    && heldSeekBoundaryRef.current === "forward"
                ) {
                    break;
                }

                const playbackTime = videoRef.current?.currentTime ?? seekValue;
                const targetTime = Math.min(seekMax, playbackTime + 5);
                const movedSeconds = targetTime - playbackTime;

                if (movedSeconds >= 0.05) {
                    seekTo(targetTime);
                    showSeekFeedback("forward", movedSeconds);
                }
                if (targetTime >= seekMax - 0.001) {
                    heldSeekBoundaryRef.current = "forward";
                }
                break;
            }
            case "ArrowUp": {
                const nextRate = stepPlaybackRate("up");
                showSpeedFeedback(nextRate);
                break;
            }
            case "ArrowDown": {
                const nextRate = stepPlaybackRate("down");
                showSpeedFeedback(nextRate);
                break;
            }
            case "m":
            case "M":
                toggleMute();
                break;
            case "f":
            case "F":
                if (!event.repeat) toggleFullscreen();
                break;
            default:
                handled = false;
        }

        if (!handled) return;
        event.preventDefault();
        event.stopPropagation();
        revealControls();
    };

    const handlePlayerKeyUp = (event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            heldSeekBoundaryRef.current = null;
        }
    };

    return (
        <div
            ref={playerRef}
            className={`${Style.player} ${className}`}
            tabIndex={0}
            role="application"
            aria-label={`${title} video player`}
            data-playing={playing}
            data-editing={hasEditableRange}
            data-fullscreen={fullscreen}
            data-controls-visible={controlsVisible}
            onPointerMove={handlePlayerPointerMove}
            onKeyDown={handlePlayerKeyDown}
            onKeyUp={handlePlayerKeyUp}
            onPointerLeave={() => {
                if (!fullscreen) setControlsVisible(false);
            }}
        >
            <video
                ref={videoRef}
                className={Style.video}
                src={src}
                poster={poster}
                preload={bufferGateEnabled ? "auto" : "metadata"}
                playsInline
                aria-label={title}
                onPointerUp={handleVideoPointerUp}
                onDoubleClick={toggleFullscreen}
                onLoadedMetadata={handleMetadata}
                onLoadedData={(event) => updateBufferedState(event.currentTarget)}
                onCanPlay={(event) => updateBufferedState(event.currentTarget)}
                onProgress={(event) => updateBufferedState(event.currentTarget)}
                onTimeUpdate={handleTimeUpdate}
                onPlay={(event) => {
                    setPlaying(true);
                    setControlsVisible(false);
                    onPlay?.(event);
                }}
                onPause={(event) => {
                    setPlaying(false);
                    onPause?.(event);
                }}
                onError={onError}
                onEnded={() => setPlaying(false)}
            />

            <div className={Style.brand} aria-hidden="true">
                <span className={Style.brandMark}>PVP</span>
                <span>SCALPEL VIEWER</span>
            </div>

            {!playing && (
                <button
                    type="button"
                    className={Style.centerPlay}
                    onClick={togglePlayback}
                    disabled={!bufferReady}
                    aria-label={bufferReady ? "Play video" : bufferStatus}
                    title={bufferReady ? "Play video" : bufferStatus}
                >
                    <FaPlay />
                </button>
            )}

            {seekFeedback && (
                <div
                    className={`${Style.seekFeedback} ${
                        seekFeedback.direction === "backward"
                            ? Style.seekFeedbackBackward
                            : Style.seekFeedbackForward
                    }`}
                    role="status"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    {seekFeedback.direction === "backward" ? "-" : "+"}
                    {formatSeekFeedbackSeconds(seekFeedback.seconds)}s
                </div>
            )}

            {speedFeedback !== null && (
                <div
                    className={Style.speedFeedback}
                    role="status"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    {speedFeedback}×
                </div>
            )}

            <div
                className={Style.controls}
                onPointerDown={(event) => event.stopPropagation()}
                onPointerMove={(event) => {
                    event.stopPropagation();
                    if (fullscreen) revealControls();
                }}
            >
                {bufferGateEnabled && (
                    <div
                        className={Style.bufferStatus}
                        role="status"
                        aria-live="polite"
                    >
                        {bufferStatus}
                    </div>
                )}

                {hasEditableRange ? (
                    <div className={Style.editableTimeline}>
                        <div className={Style.trimLabels}>
                            <span>Start {formatMediaTime(editableStart)}</span>
                            <strong>
                                {formatMediaTime(editableEnd - editableStart)} selected
                            </strong>
                            <span>End {formatMediaTime(editableEnd)}</span>
                        </div>

                        <div
                            className={Style.timelineTrack}
                            onPointerDown={handleEditableTrackPointer}
                            role="presentation"
                        >
                            <span className={Style.excludedTrack} />
                            {bufferedRanges.map((range, index) => (
                                <span
                                    key={`${range.start}-${range.end}-${index}`}
                                    className={Style.bufferedTrack}
                                    style={{
                                        left: `${(range.start / duration) * 100}%`,
                                        width: `${((range.end - range.start) / duration) * 100}%`,
                                    }}
                                />
                            ))}
                            <span
                                className={Style.selectedTrack}
                                style={{
                                    left: `${startPercent}%`,
                                    right: `${100 - endPercent}%`,
                                }}
                            />
                            <span
                                className={Style.playedTrack}
                                style={{
                                    left: `${startPercent}%`,
                                    width: `${Math.max(0, playedPercent - startPercent)}%`,
                                }}
                            />
                            <span
                                className={Style.playhead}
                                style={{
                                    left: `${Math.min(
                                        endPercent,
                                        Math.max(startPercent, playedPercent),
                                    )}%`,
                                }}
                            />
                            <input
                                className={`${Style.trimHandle} ${Style.trimHandleStart}`}
                                type="range"
                                min="0"
                                max={duration}
                                step="0.01"
                                value={editableStart}
                                onChange={(event) => updateEditableRange(
                                    "start",
                                    Number(event.target.value),
                                )}
                                aria-label="Clip start time"
                            />
                            <input
                                className={`${Style.trimHandle} ${Style.trimHandleEnd}`}
                                type="range"
                                min="0"
                                max={duration}
                                step="0.01"
                                value={editableEnd}
                                onChange={(event) => updateEditableRange(
                                    "end",
                                    Number(event.target.value),
                                )}
                                aria-label="Clip end time"
                            />
                        </div>
                    </div>
                ) : (
                    <input
                        className={Style.seek}
                        type="range"
                        min={seekMin}
                        max={seekMax || 0}
                        step="0.01"
                        value={seekValue}
                        onChange={handleSeek}
                        aria-label="Video position"
                    />
                )}

                <div className={Style.controlRow}>
                    <button
                        type="button"
                        onClick={togglePlayback}
                        disabled={!bufferReady}
                        aria-label={
                            bufferReady
                                ? playing ? "Pause" : "Play"
                                : bufferStatus
                        }
                        title={!bufferReady ? bufferStatus : undefined}
                    >
                        {playing ? <FaPause /> : <FaPlay />}
                    </button>
                    <button
                        type="button"
                        onClick={replayFromStart}
                        disabled={!bufferReady}
                        aria-label="Replay from start"
                        title={bufferReady ? "Replay from start" : bufferStatus}
                    >
                        <FaRotateLeft />
                    </button>

                    <span className={Style.time}>
                        {formatMediaTime(seekValue)} /{" "}
                        {formatMediaTime(hasEditableRange ? editableEnd : seekMax)}
                    </span>

                    <div className={Style.spacer} />

                    <button type="button" onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"}>
                        {muted || volume === 0 ? <FaVolumeXmark /> : <FaVolumeHigh />}
                    </button>
                    <input
                        className={Style.volume}
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={muted ? 0 : volume}
                        onChange={handleVolume}
                        aria-label="Volume"
                    />
                    <select
                        className={Style.playbackRate}
                        value={playbackRate}
                        onChange={handlePlaybackRate}
                        aria-label="Playback speed"
                        title="Playback speed"
                    >
                        {PLAYBACK_RATES.map((rate) => (
                            <option key={rate} value={rate}>
                                {rate}×
                            </option>
                        ))}
                    </select>
                    <button
                        type="button"
                        onClick={toggleFullscreen}
                        aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                    >
                        {fullscreen ? <FaCompress /> : <FaExpand />}
                    </button>
                </div>
            </div>
        </div>
    );
}
