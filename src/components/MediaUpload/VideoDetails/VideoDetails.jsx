import { FiChevronRight } from "react-icons/fi";

import FormBracketSelect from "./FormBracketSelect/FormBracketSelect.jsx";
import FormCharSelect from "./FormCharSelect/FormCharSelect.jsx";
import Style from "./VideoDetails.module.css";
import { useVideoDetailsContext } from "./VideoDetailsProvider.js";
import { useCallback } from "react";

export default function VideoDetails() {

    const {setIsPrivate, setTitle, setDescription} = useVideoDetailsContext();

    const onContinue = useCallback( async () => {
        
    }, [])

    return (
        <form className={Style.detailsForm} aria-labelledby="media-details-title">

            <div className={Style.fieldGrid}>
                <div className={Style.field}>
                    <label htmlFor="media-video-title">Title</label>
                    <input
                        id="media-video-title"
                        name="title"
                        type="text"
                        maxLength={120}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Example: Solo Shuffle comeback on Blade's Edge"
                    />
                </div>

                <FormBracketSelect />
            </div>

            <div className={Style.field}>
                <label htmlFor="media-video-description">Description</label>
                <textarea
                    id="media-video-description"
                    name="description"
                    rows={5}
                    maxLength={1200}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add match context, comp notes, timestamps, or anything useful for review."
                />
            </div>

            <FormCharSelect />

            <div className={Style.footerRow}>
                <label className={Style.privacyToggle} htmlFor="media-video-private">
                    <input id="media-video-private" name="isPrivate" type="checkbox" onChange={(e) => setIsPrivate(e.target.checked)}/>
                    <span className={Style.toggleVisual} aria-hidden="true">
                        <span />
                    </span>
                    <span>
                        <strong>Private video</strong>
                        <small>Only approved viewers can access it after publishing.</small>
                    </span>
                </label>

                <button type="button" className={Style.continueButton}>
                    <span>Continue</span>
                    <FiChevronRight aria-hidden="true" />
                </button>
            </div>
        </form>
    );
}
