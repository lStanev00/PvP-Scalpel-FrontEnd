import { useContext, useState } from "react";
import { UserContext } from "../hooks/ContextVariables.jsx";
import Style from "../Styles/modular/DownloadWindows.module.css";

export default function DownloadWindows() {
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
            <header className={Style.header}>
                <h1>Desktop Launcher</h1>
                <p>Windows x64</p>
            </header>

            <div className={Style.content}>
                <div className={Style.leftColumn}>
                    <div className={Style.primaryAction}>
                        <button
                            className={Style.primaryButton}
                            type="button"
                            onClick={handleDownload}
                            disabled={isLoading}
                            aria-busy={isLoading}
                        >
                            <span className={Style.buttonLabel}>
                                {isLoading ? "Preparing download..." : "Download Desktop Launcher"}
                            </span>
                            <span className={Style.buttonSubLabel}>Windows x64</span>
                        </button>
                        <p className={Style.trustText}>Secure official Windows installer</p>
                        {error ? (
                            <p className={Style.errorText} role="alert">
                                {error}
                            </p>
                        ) : null}
                    </div>

                    <div className={Style.flow}>
                        <h2 className={Style.sectionTitle}>How it works</h2>
                        <ol className={Style.flowList}>
                            <li>Download Launcher</li>
                            <li>Run &amp; Sync</li>
                            <li>Play &amp; Track</li>
                        </ol>
                    </div>
                </div>

                <aside className={Style.rightColumn}>
                    <div className={Style.rightContent}>
                        <h2 className={Style.sectionTitle}>System Requirements</h2>
                        <ul className={Style.requirementsList}>
                            <li>CPU: 64-bit x86_64, 2 cores</li>
                            <li>RAM: 4 GB</li>
                            <li>Storage: 200 MB free disk space for the app and local data</li>
                            <li>Graphics: Integrated GPU is sufficient (no dedicated GPU required)</li>
                        </ul>

                        <h2 className={Style.sectionTitle}>Notes</h2>
                        <ul className={Style.notesList}>
                            <li>
                                Platform: Windows 10/11 64-bit (the app reads Windows registry keys
                                for WoW detection)
                            </li>
                            <li>Network: Internet connection required for online manifest checks</li>
                        </ul>
                    </div>
                </aside>
            </div>
        </section>
    );
}
