import { useEffect, useMemo, useContext } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSEO } from "../hooks/useSEO";
import { UserContext } from "../hooks/ContextVariables";
import FailureState from "../components/failure/FailureState.jsx";

export default function CharacterNotFound() {
    const { server, realm, name } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { inputRef } = useContext(UserContext);

    const canonical = `https://pvpscalpel.com${location.pathname || "/"}`;

    const target = useMemo(() => {
        const displayName = name ? `@${name}` : "@unknown";
        const realmLabel = realm || "unknown-realm";
        const regionLabel = (server || "??").toUpperCase();
        const metaLine = [realmLabel, regionLabel].filter(Boolean).join(" • ");

        return { displayName, realmLabel, regionLabel, metaLine };
    }, [name, realm, server]);

    useSEO({
        title: `Target Not Found | PvP Scalpel`,
        description:
            "No verified PvP data exists for this character. Verify spelling, realm, and region, then scan again.",
        canonical,
        ogTitle: "Target Not Found | PvP Scalpel",
        ogDescription:
            "No verified PvP data exists for this character. Verify spelling, realm, and region, then scan again.",
        ogType: "website",
        ogUrl: canonical,
        ogImage: "https://pvpscalpel.com/logo/logo_resized.png",
        twitterCard: "summary_large_image",
        twitterTitle: "Target Not Found | PvP Scalpel",
        twitterDescription:
            "No verified PvP data exists for this character. Verify spelling, realm, and region, then scan again.",
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

    const focusSearch = () => {
        const el = inputRef?.current || document.querySelector("#characterSearch");
        if (!el) return;
        el.focus();
        try {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
        } catch {
            // ignore
        }
    };

    useEffect(() => {
        focusSearch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <FailureState
            wallpaper="none"
            eyebrow="COMBAT RECORD CHECK"
            title="Target Not Found"
            description={
                <>
                    No verified PvP data exists for this character.
                    <br />
                    Verify spelling, realm, and region — then scan again.
                </>
            }
            entity={{
                label: "Requested Target",
                name: target.displayName,
                meta: target.metaLine,
            }}
            path={location.pathname || "/"}
            primaryAction={{ label: "Scan Another Target", onClick: focusSearch }}
            ghostAction={{ label: "Return to Leaderboard", onClick: () => navigate("/leaderboard") }}
            linkAction={{
                label: "Go Back",
                onClick: () => {
                    if (window.history.length > 1) navigate(-1);
                    else navigate("/");
                },
            }}
        />
    );
}
