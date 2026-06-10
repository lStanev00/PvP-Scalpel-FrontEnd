import { useContext, useEffect, useState } from "react";
import { FaDiscord } from "react-icons/fa";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { UserContext } from "../hooks/ContextVariables.jsx";
import Style from "../Styles/modular/LogReg.module.css";

/**
 * Handles the frontend portion of the Discord OAuth callback.
 *
 * Guests remain on this page and receive a PvP Scalpel login link. Authenticated
 * users continue into callback validation without exposing the OAuth code in the UI.
 *
 * @returns {import("react").JSX.Element}
 */
export default function LinkDiscord() {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const code = searchParams.get("code");
    const [state, setState] = useState("initializing");
    const { authStatus, httpFetch } = useContext(UserContext);

    // Preserve the complete OAuth callback, including `code`, across PvP Scalpel login.
    const returnTarget = `${location.pathname}${location.search}`;
    const loginTarget = `/login?target=${encodeURIComponent(returnTarget)}`;

    useEffect(() => {
        // Callback processing must not run until the local PvP Scalpel session is known.
        if (authStatus !== "authenticated") return;

        if (!code) {
            console.warn("incorrect code or missing");
            setState("missing-code");
            return;
        }

        let active = true;

        const validateDiscord = async () => {
            setState("initializing");

            const linkRequest = await httpFetch("/link/discord", {
                method: "POST",
                body: JSON.stringify({
                    code,
                }),
            });

            // Ignore a completed request after navigation or effect cleanup.
            if (!active) return;

            if (linkRequest.status === 201) {
                setState("success");
            } else if (linkRequest.status === 409) {
                setState("already-claimed");
            } else if (linkRequest.status === 403 && linkRequest.data?.message) {
                setState("invalid-code");
            } else if (linkRequest.status === 403) {
                setState("session-expired");
            } else {
                setState("error");
            }
        };

        validateDiscord();

        return () => {
            active = false;
        };
    }, [authStatus, code, httpFetch]);

    const content = {
        initializing: "Preparing your Discord account link...",
        success: "Your Discord account was linked successfully.",
        "missing-code": "The Discord authorization code is missing or invalid.",
        "invalid-code":
            "This Discord authorization link is invalid or has expired. Please start the linking process again.",
        "already-claimed":
            "This Discord account is already linked to another PvP Scalpel account.",
        error: "Discord could not be linked because of a server or network error. Please try again.",
    };

    const isSessionExpired = state === "session-expired";
    const requiresLogin = authStatus === "guest" || isSessionExpired;
    const isError = ["missing-code", "invalid-code", "already-claimed", "error"].includes(state);

    return (
        <section className={Style.container}>
            <section className={Style["inner-section"]}>
                <h4>Link Discord</h4>
                <div className={Style.iconBadge} aria-hidden="true">
                    <FaDiscord />
                </div>
            </section>

            <section className={Style["inner-section"]}>
                {requiresLogin ? (
                    <>
                        <p className={Style.infoText}>
                            {isSessionExpired
                                ? "Your PvP Scalpel session has expired."
                                : "You need a PvP Scalpel account before you can link your Discord account."}
                        </p>
                        <p className={Style.infoText}>
                            {isSessionExpired
                                ? "Log in to PvP Scalpel again. You will return here to finish linking Discord."
                                : "Log in to PvP Scalpel, or create an account first. After logging in, you will return here to finish linking Discord."}
                        </p>
                        <Link className={Style.actionButton} to={loginTarget}>
                            {isSessionExpired ? "Log in again" : "Log in to PvP Scalpel"}
                        </Link>
                    </>
                ) : (
                    <p
                        className={isError ? Style["error-msg"] : Style.infoText}
                        role={isError ? "alert" : undefined}
                    >
                        {authStatus === "checking"
                            ? "Checking your login status..."
                            : content[state]}
                    </p>
                )}
            </section>
        </section>
    );
}
