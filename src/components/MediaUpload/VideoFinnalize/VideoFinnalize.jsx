import { useContext, useEffect, useMemo, useState } from "react";
import { FiCheck, FiCheckCircle, FiLock, FiUnlock } from "react-icons/fi";

import { getGameBrackets } from "../../../helpers/storageOperations/gameData.js";
import VideoPlayer from "../../VideoPlayer/VideoPlayer.jsx";
import { useMediaUploadContext } from "../MediaUploadContext.js";
import Style from "./VideoFinnalize.module.css";
import { UserContext } from "../../../hooks/ContextVariables.jsx";

const RIGHTS_CONFIRMATION =
    "I confirm that I own or have permission to use all included video, music, and other content, and that this upload contains no pornography, harassment, or content unrelated to World of Warcraft PvP.";

function getBracketName(bracket) {
    if (bracket && typeof bracket === "object" && bracket.name) {
        return bracket.name;
    }

    const bracketId = bracket?._id ?? bracket?.id ?? bracket;
    const brackets = getGameBrackets();
    const matchingBracket = Array.isArray(brackets)
        ? brackets.find((bracket) => String(bracket?._id) === String(bracketId))
        : null;

    return matchingBracket?.name || "Unspecified bracket";
}

function getCharacterNames(characters) {
    if (!Array.isArray(characters)) return [];

    return characters
        .map((entry) => {
            const normalizedEntry = Array.isArray(entry) ? entry[0] : entry;
            const character =
                normalizedEntry?.char ||
                normalizedEntry?.character ||
                normalizedEntry;

            return character?.name || normalizedEntry?.characterName || "";
        })
        .filter(Boolean);
}

function getFinalizeErrorMessage(response) {
    switch (response?.status) {
        case 403:
            return "Your session has expired. Please sign in again before submitting this video.";
        case 404:
            return "We couldn’t find this video. It may have been removed or is no longer available.";
        case 499:
            return "You don’t have permission to submit this video.";
        case 500:
            return "We couldn’t start processing your video right now. Please try again in a moment.";
        case 0:
            return "We couldn’t connect to the server. Check your connection and try again.";
        default:
            return "Something went wrong while submitting your video. Please try again.";
    }
}

export default function VideoFinnalize() {
    const { videoFile, mediaMetaDocRef, mergeMediaMetaDoc } = useMediaUploadContext();
    const { httpFetch } = useContext(UserContext);
    const [hasConfirmedRights, setHasConfirmedRights] = useState(false);
    const [finalizeStatus, setFinalizeStatus] = useState("idle");
    const [finalizeError, setFinalizeError] = useState("");
    const mediaDocument = mediaMetaDocRef.current || {};
    const title = mediaDocument.title || "Untitled video";
    const description = mediaDocument.description || "";
    const isPrivate = Boolean(mediaDocument.isPrivate);
    const characters = Array.isArray(mediaDocument.characters)
        ? mediaDocument.characters
        : [];

    const previewUrl = useMemo(() => {
        if (!videoFile) return "";
        return URL.createObjectURL(videoFile);
    }, [videoFile]);

    const bracketName = getBracketName(mediaDocument.bracket);
    const characterNames = getCharacterNames(characters);
    const characterSummary = characterNames.length > 0
        ? characterNames.join(", ")
        : characters.length > 0
            ? `${characters.length} ${characters.length === 1 ? "character" : "characters"} selected.`
            : "No characters selected.";

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const onFinalize = async () => {
        if (!hasConfirmedRights || finalizeStatus === "submitting") return;

        const mediaId = mediaMetaDocRef.current?._id;

        if (!mediaId) {
            setFinalizeError(
                "Something went wrong while preparing your video. Refresh the page and try again.",
            );
            return;
        }

        setFinalizeStatus("submitting");
        setFinalizeError("");

        try {
            const response = await httpFetch("/media/finnalize", {
                method: "PATCH",
                body: JSON.stringify({ _id: mediaId }),
            });

            const isAlreadyQueued =
                response.status === 409 &&
                ["need_process", "processing"].includes(response.data?.state);

            if (response.status === 201 || isAlreadyQueued) {
                if (response.data && typeof response.data === "object") {
                    mergeMediaMetaDoc(response.data);
                }

                if (previewUrl) URL.revokeObjectURL(previewUrl);
                setFinalizeStatus(isAlreadyQueued ? "already-queued" : "complete");
                return;
            }

            setFinalizeStatus("idle");
            setFinalizeError(getFinalizeErrorMessage(response));
        } catch {
            setFinalizeStatus("idle");
            setFinalizeError(
                "We couldn’t connect to the server. Check your connection and try again.",
            );
        }
    };

    if (finalizeStatus === "complete" || finalizeStatus === "already-queued") {
        const wasAlreadyQueued = finalizeStatus === "already-queued";

        return (
            <section
                className={Style.completionStage}
                aria-labelledby="media-finalized-title"
                role="status"
                aria-live="polite">
                <FiCheckCircle className={Style.successIcon} aria-hidden="true" />
                <span className={Style.completionEyebrow}>Upload complete</span>
                <h2 id="media-finalized-title">
                    {wasAlreadyQueued ? "Your video is already submitted" : "Your video is submitted"}
                </h2>
                <p>
                    {wasAlreadyQueued
                        ? "Your video is already waiting to be processed. You don’t need to submit it again."
                        : "Your video is now waiting to be processed. You can safely leave this page."}
                </p>
            </section>
        );
    }

    return (
        <section className={Style.finalStage} aria-labelledby="media-final-preview-title">
            <div className={Style.preview}>
                {previewUrl ? (
                    <VideoPlayer src={previewUrl} title={title || "Final video preview"} />
                ) : (
                    <div className={Style.missingPreview} role="status">
                        We can’t show the preview right now, but your uploaded video is still available.
                    </div>
                )}
            </div>

            <div className={Style.details}>
                <header className={Style.detailsHeader}>
                    <div>
                        <span className={Style.eyebrow}>Final preview</span>
                        <h2 id="media-final-preview-title">{title}</h2>
                    </div>

                    <span className={Style.privacyPill}>
                        {isPrivate ? <FiLock aria-hidden="true" /> : <FiUnlock aria-hidden="true" />}
                        {isPrivate ? "Private" : "Public"}
                    </span>
                </header>

                <p className={description ? Style.description : Style.emptyDescription}>
                    {description || "No description provided."}
                </p>

                <dl className={Style.summary}>
                    <div>
                        <dt>Bracket</dt>
                        <dd>{bracketName}</dd>
                    </div>
                    <div>
                        <dt>Characters</dt>
                        <dd>{characterSummary}</dd>
                    </div>
                </dl>
            </div>

            <div className={Style.finalAction}>
                <label className={Style.confirmation} htmlFor="media-rights-confirmation">
                    <input
                        id="media-rights-confirmation"
                        type="checkbox"
                        required
                        checked={hasConfirmedRights}
                        onChange={(event) => setHasConfirmedRights(event.target.checked)}
                    />
                    <span className={Style.checkboxVisual} aria-hidden="true">
                        <FiCheck />
                    </span>
                    <span>{RIGHTS_CONFIRMATION}</span>
                </label>

                {finalizeError && (
                    <p className={Style.finalizeError} role="alert">
                        {finalizeError}
                    </p>
                )}

                <button
                    type="button"
                    className={Style.finalizeButton}
                    disabled={!hasConfirmedRights || finalizeStatus === "submitting"}
                    onClick={onFinalize}
                    title={hasConfirmedRights ? undefined : "Confirm the statement above first"}>
                    {finalizeStatus === "submitting" ? "Submitting..." : "Finalize"}
                </button>
            </div>
        </section>
    );
}
