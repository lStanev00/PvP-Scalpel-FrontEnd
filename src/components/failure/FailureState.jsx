/* eslint-disable react/prop-types */

import Style from "../../Styles/modular/FailureState.module.css";

export default function FailureState({
    variant = "default",
    wallpaper = null,
    eyebrow,
    title,
    code,
    description,
    entity,
    path,
    primaryAction,
    ghostAction,
    linkAction,
}) {
    const resolvedWallpaper =
        wallpaper !== null
            ? wallpaper
            : variant === "404"
            ? 'url("/backgrounds/404-bg.png"), url("/backgrounds/main_background.png")'
            : 'url("/backgrounds/main_background.png")';

    return (
        <section
            className={Style.wrap}
            style={{ "--fs-wallpaper": resolvedWallpaper }}
            role="main"
            aria-labelledby="fs-title"
        >
            <div className={Style.atmosphere} aria-hidden="true" />

            <div className={Style.card}>
                <div className={Style.header}>
                    <img
                        className={Style.crest}
                        src="/logo/logo_resized.png"
                        alt=""
                        aria-hidden="true"
                    />

                    {eyebrow && <p className={Style.eyebrow}>{eyebrow}</p>}

                    <h1 id="fs-title" className={Style.title}>
                        {title}
                    </h1>

                    {code && <div className={Style.code}>{code}</div>}

                    {description && <div className={Style.description}>{description}</div>}
                </div>

                {entity && (
                    <section className={Style.entity} aria-label="Requested target">
                        {entity.label && <div className={Style.entityLabel}>{entity.label}</div>}
                        {entity.name && <div className={Style.entityName}>{entity.name}</div>}
                        {entity.meta && <div className={Style.entityMeta}>{entity.meta}</div>}
                    </section>
                )}

                <div className={Style.actions}>
                    {primaryAction && (
                        <button
                            type="button"
                            className={Style.primaryBtn}
                            onClick={primaryAction.onClick}
                        >
                            {primaryAction.label}
                        </button>
                    )}

                    {ghostAction && (
                        <button
                            type="button"
                            className={Style.ghostBtn}
                            onClick={ghostAction.onClick}
                        >
                            {ghostAction.label}
                        </button>
                    )}

                    {linkAction && (
                        <button
                            type="button"
                            className={Style.linkBtn}
                            onClick={linkAction.onClick}
                        >
                            {linkAction.label}
                        </button>
                    )}
                </div>

                {path && (
                    <div className={Style.pathRow}>
                        <span className={Style.pathLabel}>Route</span>
                        <span className={Style.pathPill}>{path}</span>
                    </div>
                )}
            </div>
        </section>
    );
}
