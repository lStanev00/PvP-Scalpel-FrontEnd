import { useContext, useEffect, useRef, useState } from "react";
import { FaDiscord, FaDownload } from "react-icons/fa";
import { GiBroadsword } from "react-icons/gi";
import { UserContext } from "../../../hooks/ContextVariables.jsx";
import Style from "./HomeHero.module.css";

const PLAYBACK_RATE = 0.5;
const MOBILE_MEDIA_QUERY = "(max-width: 768px)";

export default function HomeHero() {
    const { user, httpFetch } = useContext(UserContext);
    const [videoUrl, setVideoUrl] = useState("");
    const [videoReady, setVideoReady] = useState(false);
    const [videoFailed, setVideoFailed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const canSeeDownload = Boolean(user?._id) && user?.role !== "user";
    const isVideoActive = Boolean(videoUrl) && videoReady && !videoFailed && !isMobile;
    const videoRef = useRef(null);

    useEffect(() => {
        const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
        const syncIsMobile = () => {
            setIsMobile(mediaQuery.matches);
        };

        syncIsMobile();
        mediaQuery.addEventListener("change", syncIsMobile);

        return () => {
            mediaQuery.removeEventListener("change", syncIsMobile);
        };
    }, []);

    useEffect(() => {
        if (isMobile) {
            if (videoRef.current) {
                videoRef.current.pause();
            }

            setVideoUrl("");
            setVideoReady(false);
            setVideoFailed(false);
            return;
        }

        let isActive = true;

        const loadHeroVideo = async () => {
            setVideoReady(false);
            setVideoFailed(false);

            const response = await httpFetch("/CDN/FEContent?path=landing.mp4");
            const data = response?.data;
            const url =
                response?.ok && data && typeof data === "object"
                    ? data.url || data.downloadUrl || ""
                    : "";

            if (!isActive) return;

            if (!url) {
                setVideoFailed(true);
                return;
            }

            setVideoUrl(url);
        };

        loadHeroVideo();

        return () => {
            isActive = false;
        };
    }, [httpFetch, isMobile]);

    useEffect(() => {
        return () => {
            if (videoRef.current) {
                videoRef.current.pause();
            }
        };
    }, []);

    const handleCanPlay = async () => {
        const video = videoRef.current;
        if (!video) return;

        video.playbackRate = PLAYBACK_RATE;
        setVideoReady(true);

        try {
            await video.play();
        } catch {
            setVideoFailed(true);
            setVideoReady(false);
        }
    };

    const handleEnded = async () => {
        const video = videoRef.current;
        if (!video || isMobile) return;

        video.currentTime = 0;
        video.playbackRate = PLAYBACK_RATE;

        try {
            await video.play();
        } catch {
            setVideoFailed(true);
            setVideoReady(false);
        }
    };

    const handleVideoError = () => {
        if (videoRef.current) {
            videoRef.current.pause();
        }

        setVideoReady(false);
        setVideoFailed(true);
    };

    return (
        <section
            className={Style.hero}
            data-video-ready={isVideoActive}
            data-video-failed={videoFailed}
        >
            <div className={Style.media} aria-hidden="true">
                {videoUrl && !videoFailed && !isMobile ? (
                    <video
                        ref={videoRef}
                        className={`${Style.video} ${isVideoActive ? Style.videoActive : ""}`}
                        src={videoUrl}
                        muted
                        playsInline
                        preload="metadata"
                        disablePictureInPicture
                        disableRemotePlayback
                        tabIndex={-1}
                        aria-hidden="true"
                        onCanPlay={handleCanPlay}
                        onEnded={handleEnded}
                        onError={handleVideoError}
                    />
                ) : null}
            </div>

            {!isVideoActive ? <div className={Style.overlay} aria-hidden="true" /> : null}

            <div className={Style.content}>
                <img className={Style.logo} src="/logo/logo_resized.png" alt="PvP Scalpel Logo" />
                <h1>PvP Scalpel</h1>
                <p className={Style.p}>
                    Precision. Performance. Power.
                    <br />
                    Built by players - evolving into the ultimate PvP companion.
                </p>

                <div className={Style.actions}>
                    {canSeeDownload ? (
                        <a href="/download" className={`${Style.btn} ${Style.download}`}>
                            <span>Download</span>
                            <FaDownload className={Style.icon} />
                        </a>
                    ) : null}

                    <a
                        href="https://discord.gg/2h45zpyJdb"
                        target="_blank"
                        rel="noreferrer"
                        className={`${Style.btn} ${Style.discord}`}
                    >
                        <span>Join Discord</span>
                        <FaDiscord className={Style.icon} />
                    </a>

                    <a href="/joinGuild" className={`${Style.btn} ${Style.guild}`}>
                        <span>Join the Guild</span>
                        <GiBroadsword className={Style.icon} />
                    </a>
                </div>
            </div>
        </section>
    );
}
