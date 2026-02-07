import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSEO } from "../hooks/useSEO";
import FailureState from "../components/failure/FailureState.jsx";

export default function NotFound() {
    const location = useLocation();
    const navigate = useNavigate();

    const fromPath = location.state?.from;
    const pathToShow =
        typeof fromPath === "string" && fromPath ? fromPath : location.pathname || "/";
    const canonical = `https://pvpscalpel.com${pathToShow}`;

    useSEO({
        title: "404 — Signal Lost | PvP Scalpel",
        description: "This page doesn't exist. Return to the Command Center or go back.",
        canonical,
        ogTitle: "404 — Signal Lost | PvP Scalpel",
        ogDescription: "This page doesn't exist. Return to the Command Center or go back.",
        ogType: "website",
        ogUrl: canonical,
        ogImage: "https://pvpscalpel.com/logo/logo_resized.png",
        twitterCard: "summary_large_image",
        twitterTitle: "404 — Signal Lost | PvP Scalpel",
        twitterDescription: "This page doesn't exist. Return to the Command Center or go back.",
        twitterImage: "https://pvpscalpel.com/logo/logo_resized.png",
    });

    useEffect(() => {
        let meta = document.querySelector('meta[name="robots"]');
        const prevContent = meta?.content;
        const created = !meta;

        if (!meta) {
            meta = document.createElement("meta");
            meta.setAttribute("name", "robots");
            document.head.appendChild(meta);
        }

        meta.setAttribute("content", "noindex, nofollow, noarchive");

        return () => {
            if (created) {
                meta.remove();
                return;
            }
            if (prevContent) {
                meta.setAttribute("content", prevContent);
            }
        };
    }, []);

    return (
        <FailureState
            variant="404"
            wallpaper="none"
            eyebrow="NAVIGATION"
            title="Signal Lost"
            code="404"
            description={
                <>
                    The route you&apos;re tracking doesn&apos;t exist.
                    <br />
                    Return to the Command Center or go back.
                </>
            }
            path={pathToShow}
            primaryAction={{
                label: "Return to Command Center",
                onClick: () => navigate("/leaderboard"),
            }}
            ghostAction={{ label: "Home", onClick: () => navigate("/") }}
            linkAction={{
                label: "Go back",
                onClick: () => {
                    if (window.history.length > 1) navigate(-1);
                    else navigate("/");
                },
            }}
        />
    );
}
