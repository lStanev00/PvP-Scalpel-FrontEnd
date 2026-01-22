import { useContext, useState } from "react";
import { FiDownload, FiRefreshCw, FiTarget, FiCpu, FiHardDrive, FiMonitor, FiGlobe } from "react-icons/fi";
import { UserContext } from "../hooks/ContextVariables.jsx";
import SEODownload from "../SEO/SEODownload.jsx";
import Style from "../Styles/modular/Download.module.css";

export default function Download() {
    const { httpFetch } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleDownload = async () => {
        if (isLoading) return;
        setError("");
        setIsLoading(true);

        let redirected = false;

        try {
            const response = await httpFetch("/CDN/download/refresh?key=launcher");

            if (!response?.ok) {
                throw new Error("Download request failed");
            }

            const data = response.data;
            const url = typeof data === "string" ? data : data?.url;

            if (!url) {
                throw new Error("Missing download URL");
            }

            redirected = true;
            window.location.assign(url);
        } catch (err) {
            setError("Unable to start the download. Please try again.");
        } finally {
            if (!redirected) {
                setIsLoading(false);
            }
        }
    };

    return (
        <section className={Style.page}>
            <SEODownload />
            <div className={Style.backgroundEffects} aria-hidden="true">
                <div className={Style.orbPrimary} />
                <div className={Style.orbSecondary} />
                <div className={Style.gridPattern} />
            </div>

            <div className={Style.main}>
                <section className={Style.hero}>
                    <div className={Style.heroBackground} aria-hidden="true" />
                    <div className={Style.heroContent}>
                        <div className={Style.statusPill}>
                            <span className={Style.statusDot} />
                            Windows x64 Available Now
                        </div>
                        <h1 className={Style.heroTitle}>
                            Desktop <span className={Style.heroAccent}>Launcher</span>
                        </h1>
                        <p className={Style.heroDescription}>
                            Download the PvP Scalpel launcher for Windows and access real-time
                            performance tracking and analytics.
                        </p>
                        <div className={Style.heroActions}>
                            <button
                                type="button"
                                className={`${Style.primaryButton} ${Style.heroPrimaryButton}`}
                                onClick={handleDownload}
                                disabled={isLoading}
                                aria-busy={isLoading}
                            >
                                {isLoading ? "Preparing download..." : "Download for Windows"}
                            </button>
                            <button type="button" className={Style.secondaryButton} disabled>
                                View Requirements
                            </button>
                        </div>
                        <p className={Style.trustText}>Secure official Windows installer</p>
                        {error ? (
                            <p className={Style.errorText} role="alert">
                                {error}
                            </p>
                        ) : null}
                    </div>
                </section>

                <section className={Style.section}>
                    <div className={Style.panel}>
                        <div className={Style.sectionHeader}>
                            <h2>Download</h2>
                            <p>Select a platform to continue to the installer download.</p>
                        </div>
                        <div className={Style.platformList}>
                            <div className={`${Style.platformCard} ${Style.platformFeatured}`}>
                                <div className={Style.platformInfo}>
                                    <div className={Style.platformIcon} aria-hidden="true">
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3>Windows</h3>
                                        <span>Windows x64</span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className={Style.primaryButton}
                                    onClick={handleDownload}
                                    disabled={isLoading}
                                    aria-busy={isLoading}
                                >
                                    {isLoading ? "Preparing download..." : "Download"}
                                </button>
                            </div>
                            <div className={Style.platformCard}>
                                <div className={Style.platformInfo}>
                                    <div className={`${Style.platformIcon} ${Style.platformIconMuted}`} aria-hidden="true">
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3>macOS</h3>
                                        <span>Apple Silicon / Intel</span>
                                    </div>
                                </div>
                                <button type="button" className={Style.ghostButton} disabled>
                                    Coming Soon
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <section className={Style.details}>
                    <div className={`${Style.panel} ${Style.panelSteps}`}>
                        <h2>How it works</h2>
                        <ol className={Style.steps}>
                            <li className={Style.stepItem}>
                                <span className={Style.stepIcon} aria-hidden="true">
                                    <FiDownload />
                                </span>
                                <div className={Style.stepText}>
                                    <div className={Style.stepHeading}>
                                        <span className={Style.stepNumber}>1.</span>
                                        <span className={Style.stepTitle}>Download Launcher</span>
                                    </div>
                                    <span className={Style.stepSubtitle}>
                                        Get the secure official Windows installer
                                    </span>
                                </div>
                            </li>
                            <li className={Style.stepItem}>
                                <span className={Style.stepIcon} aria-hidden="true">
                                    <FiRefreshCw />
                                </span>
                                <div className={Style.stepText}>
                                    <div className={Style.stepHeading}>
                                        <span className={Style.stepNumber}>2.</span>
                                        <span className={Style.stepTitle}>Run &amp; Sync</span>
                                    </div>
                                    <span className={Style.stepSubtitle}>
                                        Connect to your PvP S account seamlessly
                                    </span>
                                </div>
                            </li>
                            <li className={Style.stepItem}>
                                <span className={Style.stepIcon} aria-hidden="true">
                                    <FiTarget />
                                </span>
                                <div className={Style.stepText}>
                                    <div className={Style.stepHeading}>
                                        <span className={Style.stepNumber}>3.</span>
                                        <span className={Style.stepTitle}>Play &amp; Track</span>
                                    </div>
                                    <span className={Style.stepSubtitle}>
                                        Dominate PvP with real-time analytics
                                    </span>
                                </div>
                            </li>
                        </ol>
                    </div>
                    <div className={`${Style.panel} ${Style.panelRequirements}`}>
                        <h2>System Requirements</h2>
                        <ul className={Style.requirements}>
                            <li className={Style.requirementItem}>
                                <span className={Style.requirementIcon} aria-hidden="true">
                                    <FiCpu />
                                </span>
                                <div>
                                    <span className={Style.requirementLabel}>CPU:</span>
                                    <span className={Style.requirementValue}>64-bit x86_64, 2 cores</span>
                                </div>
                            </li>
                            <li className={Style.requirementItem}>
                                <span className={Style.requirementIcon} aria-hidden="true">
                                    <FiHardDrive />
                                </span>
                                <div>
                                    <span className={Style.requirementLabel}>RAM:</span>
                                    <span className={Style.requirementValue}>4 GB</span>
                                </div>
                            </li>
                            <li className={Style.requirementItem}>
                                <span className={Style.requirementIcon} aria-hidden="true">
                                    <FiHardDrive />
                                </span>
                                <div>
                                    <span className={Style.requirementLabel}>Storage:</span>
                                    <span className={Style.requirementValue}>
                                        200 MB free disk space for the app and local data
                                    </span>
                                </div>
                            </li>
                            <li className={Style.requirementItem}>
                                <span className={Style.requirementIcon} aria-hidden="true">
                                    <FiMonitor />
                                </span>
                                <div>
                                    <span className={Style.requirementLabel}>Graphics:</span>
                                    <span className={Style.requirementValue}>
                                        Integrated GPU is sufficient (no dedicated GPU required)
                                    </span>
                                </div>
                            </li>
                        </ul>
                        <div className={Style.notes}>
                            <h3>Notes</h3>
                            <ul className={Style.notesList}>
                                <li>
                                    <span className={Style.notesIcon} aria-hidden="true">
                                        <FiMonitor />
                                    </span>
                                    <span>
                                        Windows 10/11 64-bit (the app reads Windows registry keys for WoW
                                        detection)
                                    </span>
                                </li>
                                <li>
                                    <span className={Style.notesIcon} aria-hidden="true">
                                        <FiGlobe />
                                    </span>
                                    <span>Internet connection required for online manifest checks</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>
            </div>
        </section>
    );
}
