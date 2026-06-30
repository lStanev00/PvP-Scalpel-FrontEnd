import { FiChevronRight } from "react-icons/fi";

import FormBracketSelect from "./FormBracketSelect/FormBracketSelect.jsx";
import FormCharSelect from "./FormCharSelect/FormCharSelect.jsx";
import Style from "./VideoDetails.module.css";
import { useVideoDetailsContext } from "./VideoDetailsProvider.js";
import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../../../hooks/ContextVariables.jsx";
import { useMediaUploadContext } from "../MediaUploadContext.js";

function validateVideoDetails({ title, description, bracket }) {
    const nextErrors = {};
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
        nextErrors.title = "Add a title before continuing.";
    } else if (title.length > 120) {
        nextErrors.title = "Title must be 120 characters or fewer.";
    }

    if (description.length > 1200) {
        nextErrors.description = "Description must be 1200 characters or fewer.";
    }

    if (bracket === undefined || bracket === null || String(bracket) === "") {
        nextErrors.bracket = "Select a bracket before continuing.";
    }

    return nextErrors;
}

export default function VideoDetails() {
    const { title, description, bracket, isPrivate, setIsPrivate, setTitle, setDescription, characters } =
        useVideoDetailsContext();
    const {mediaMetaDocRef, mergeMediaMetaDoc } = useMediaUploadContext();
    const [errors, setErrors] = useState({});
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const { httpFetch } = useContext(UserContext);
    

    const titleErrorId = "media-video-title-error";
    const descriptionErrorId = "media-video-description-error";
    const bracketErrorId = "media-video-bracket-error";

    const runValidation = useCallback(() => {
        return validateVideoDetails({ title, description, bracket });
    }, [bracket, description, title]);

    const onContinue = useCallback( async () => {
        const nextErrors = runValidation();
        setHasSubmitted(true);
        setErrors(nextErrors);
        
        if (Object.keys(nextErrors).length > 0) return; // check if errors exist before making an request;

        try {

            const exportBody = JSON.stringify({
                _id: mediaMetaDocRef.current._id,
                title,
                description,
                bracket,
                characters,
                isPrivate,
            })


            const req = await httpFetch("/media" , {
                method: "PATCH",
                body: exportBody
            });

            if(req.status === 200) {
                const {data} = req;

                mergeMediaMetaDoc(data);

                console.info(data);
                console.info(mediaMetaDocRef.current);

            }

        } catch (error) {
            
        }

    }, [
        bracket,
        characters,
        description,
        httpFetch,
        isPrivate,
        mediaMetaDocRef,
        mergeMediaMetaDoc,
        runValidation,
        title,
    ]);

    useEffect(() => {
        if (!hasSubmitted) return;
        setErrors(runValidation());
    }, [hasSubmitted, runValidation]);

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
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        aria-invalid={Boolean(errors.title)}
                        aria-describedby={errors.title ? titleErrorId : undefined}
                        placeholder="Example: Solo Shuffle comeback on Blade's Edge"
                    />
                    {errors.title && (
                        <p id={titleErrorId} className={Style.fieldError}>
                            {errors.title}
                        </p>
                    )}
                </div>

                <FormBracketSelect
                    error={errors.bracket}
                    ariaDescribedBy={errors.bracket ? bracketErrorId : undefined}
                />
            </div>

            <div className={Style.field}>
                <label htmlFor="media-video-description">Description</label>
                <textarea
                    id="media-video-description"
                    name="description"
                    rows={5}
                    maxLength={1200}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    aria-invalid={Boolean(errors.description)}
                    aria-describedby={errors.description ? descriptionErrorId : undefined}
                    placeholder="Add match context, comp notes, timestamps, or anything useful for review."
                />
                {errors.description && (
                    <p id={descriptionErrorId} className={Style.fieldError}>
                        {errors.description}
                    </p>
                )}
            </div>

            <FormCharSelect />

            <div className={Style.footerRow}>
                <label className={Style.privacyToggle} htmlFor="media-video-private">
                    <input
                        id="media-video-private"
                        name="isPrivate"
                        type="checkbox"
                        checked={isPrivate}
                        onChange={(e) => setIsPrivate(e.target.checked)}
                    />
                    <span className={Style.toggleVisual} aria-hidden="true">
                        <span />
                    </span>
                    <span>
                        <strong>Private video</strong>
                        <small>Only approved viewers can access it after publishing.</small>
                    </span>
                </label>

                <button type="button" className={Style.continueButton} onClick={onContinue}>
                    <span>Continue</span>
                    <FiChevronRight aria-hidden="true" />
                </button>
            </div>
        </form>
    );
}
