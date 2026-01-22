import { Link } from "react-router-dom";
import Style from "../Styles/modular/DownloadHub.module.css";

export default function DownloadHub() {
    const platforms = [
        {
            id: "windows-x64",
            title: "Windows",
            detail: "Windows x64",
            status: "active",
            path: "/download/windows-x64",
            actionLabel: "Open download",
        },
        {
            id: "macos",
            title: "macOS",
            detail: "Apple Silicon / Intel",
            status: "coming",
            actionLabel: "Coming Soon",
        },
    ];

    return (
        <section className={Style.hub}>
            <header className={Style.header}>
                <h1>Download</h1>
                <p>Select a platform to continue to the installer download.</p>
            </header>

            <div className={Style.platformList}>
                {platforms.map((platform) => (
                    <div key={platform.id} className={Style.platformRow}>
                        <div className={Style.platformInfo}>
                            <span className={Style.platformTitle}>{platform.title}</span>
                            <span className={Style.platformMeta}>{platform.detail}</span>
                        </div>
                        <div className={Style.actionArea}>
                            {platform.status === "active" ? (
                                <Link className={Style.linkButton} to={platform.path}>
                                    {platform.actionLabel}
                                </Link>
                            ) : (
                                <button
                                    className={Style.disabledButton}
                                    type="button"
                                    disabled
                                >
                                    {platform.actionLabel}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
