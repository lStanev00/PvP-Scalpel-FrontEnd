/* eslint-disable react/prop-types -- SEO ownership is optional for embedded error states. */
import { useLocation, useNavigate } from "react-router-dom";
import { useSEO } from "../hooks/useSEO";
import FailureState from "../components/failure/FailureState.jsx";
import { publicAssetUrl } from "../helpers/assets.js";

export default function NotFound({ manageSEO = true }) {
    const location = useLocation();
    const navigate = useNavigate();

    const fromPath = location.state?.from;
    const pathToShow =
        typeof fromPath === "string" && fromPath ? fromPath : location.pathname || "/";
    const canonical = `https://www.pvpscalpel.com${pathToShow}`;

    return (
        <>
            {manageSEO && <NotFoundSEO canonical={canonical} />}
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
                    onClick: () => navigate("/leaderboard/blitz"),
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
        </>
    );
}

function NotFoundSEO({ canonical }) {
    const title = "404 — Signal Lost | PvP Scalpel";
    const description =
        "This page doesn't exist. Return to the Command Center or go back.";
    const image = publicAssetUrl("logo/logo_resized.png");

    useSEO({
        title,
        description,
        canonical,
        robots: "noindex, nofollow, noarchive",
        ogSiteName: "PvP Scalpel",
        ogTitle: title,
        ogDescription: description,
        ogType: "website",
        ogUrl: canonical,
        ogImage: image,
        twitterCard: "summary_large_image",
        twitterTitle: title,
        twitterDescription: description,
        twitterImage: image,
    });

    return null;
}
