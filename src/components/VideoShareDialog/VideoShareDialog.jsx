/* eslint-disable react/prop-types -- Props are documented below. */
import { useEffect, useId, useRef, useState } from "react";
import { FiCheck, FiCopy, FiX } from "react-icons/fi";
import Style from "./VideoShareDialog.module.css";

/**
 * Mounted by Watch when Share is pressed. currentTime is a snapshot, not a timer.
 * @param {{ videoID: string, currentTime: number, onClose: () => void }} props
 */
export default function VideoShareDialog({ videoID, currentTime, onClose }) {
    const dialogRef = useRef(null);
    const urlRef = useRef(null);
    const headingID = useId();
    const urlID = useId();
    const [includeTime, setIncludeTime] = useState(false);
    const [copyState, setCopyState] = useState("");
    const seconds = Number.isSafeInteger(currentTime) && currentTime > 0 ? currentTime : 0;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor(seconds / 60) % 60;
    const timePrefix = hours ? `${hours}:${String(minutes).padStart(2, "0")}` : minutes;
    const timestamp = `${timePrefix}:${String(seconds % 60).padStart(2, "0")}`;
    const url = new URL(`/watch/${encodeURIComponent(videoID)}`, window.location.origin);
    if (includeTime && seconds > 0) url.searchParams.set("t", String(seconds));

    useEffect(() => {
        const dialog = dialogRef.current;
        const trigger = document.activeElement;
        dialog.showModal();

        return () => {
            dialog.close();
            if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus();
        };
    }, []);

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(url.href);
            setCopyState("copied");
        } catch {
            setCopyState("failed");
            urlRef.current?.focus();
            urlRef.current?.select();
        }
    };

    const keepFocusInDialog = (event) => {
        if (event.key !== "Tab") return;
        const controls = event.currentTarget.querySelectorAll("button, input");
        const first = controls[0];
        const last = controls[controls.length - 1];

        if (event.shiftKey ? document.activeElement === first : document.activeElement === last) {
            event.preventDefault();
            (event.shiftKey ? last : first).focus();
        }
    };

    return (
        <dialog
            ref={dialogRef}
            className={Style.dialog}
            aria-labelledby={headingID}
            onKeyDown={keepFocusInDialog}
            onClose={() => {
                // Ignore a queued cleanup event if Strict Mode has reopened the dialog.
                if (!dialogRef.current.open) onClose();
            }}
        >
            <header className={Style.header}>
                <h2 id={headingID}>Share clip</h2>
                <button type="button" className={Style.close} aria-label="Close share dialog" onClick={() => dialogRef.current.close()}>
                    <FiX aria-hidden="true" />
                </button>
            </header>
            <label className={Style.urlLabel} htmlFor={urlID}>Clip link</label>
            <input
                ref={urlRef}
                id={urlID}
                className={Style.url}
                value={url.href}
                readOnly
                onFocus={(event) => event.currentTarget.select()}
            />
            <div className={Style.actions}>
                <label className={Style.timestamp}>
                    <input
                        type="checkbox"
                        checked={includeTime}
                        onChange={(event) => {
                            setIncludeTime(event.target.checked);
                            setCopyState("");
                        }}
                    />
                    Start at {timestamp}
                </label>
                <button type="button" className={Style.copy} onClick={copyLink}>
                    {copyState === "copied" ? <FiCheck aria-hidden="true" /> : <FiCopy aria-hidden="true" />}
                    Copy link
                </button>
            </div>
            <p className={Style.status} role="status">
                {copyState === "copied" && "Link copied."}
                {copyState === "failed" && "Couldn’t copy automatically. Select the link and copy it manually."}
            </p>
        </dialog>
    );
}
