import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import CharacterMultiSelect from "../CharacterMultiSelect.jsx";
import Style from "../../../Styles/modular/MediaUpload.module.css";
import { useMediaUpload } from "./context/useMediaUpload.js";

export default function MetadataStage() {
    const {
        characters,
        continueToThumbnails,
        description,
        error,
        openStage,
        title,
        updateCharacters,
        updateDescription,
        updateTitle,
    } = useMediaUpload();

    return (
        <form className={Style.panel} onSubmit={continueToThumbnails}>
            <div className={Style.sectionTitle}>
                <span>02</span>
                <div>
                    <h2>Media metadata</h2>
                    <p>Give the source video context and attach featured characters.</p>
                </div>
            </div>

            <div className={Style.fields}>
                <label>
                    <span>Title</span>
                    <input
                        type="text"
                        value={title}
                        onChange={(event) => updateTitle(event.target.value)}
                        placeholder="Example: The perfect flag-room counter"
                        maxLength={120}
                        required
                    />
                    <small>{title.length}/120</small>
                </label>

                <label>
                    <span>Description</span>
                    <textarea
                        value={description}
                        onChange={(event) => updateDescription(event.target.value)}
                        placeholder="Describe the match, bracket, strategy, and key moment..."
                        maxLength={2000}
                        required
                    />
                    <small>{description.length}/2000</small>
                </label>

                <div className={Style.characterField}>
                    <div className={Style.fieldLabel}>
                        <span>Featured characters</span>
                        <small>{characters.length} selected</small>
                    </div>
                    <CharacterMultiSelect
                        selected={characters}
                        onChange={updateCharacters}
                        styles={Style}
                    />
                </div>
            </div>

            {error && <p className={Style.error} role="alert">{error}</p>}

            <div className={Style.stageActions}>
                <button
                    type="button"
                    className={Style.secondaryButton}
                    onClick={() => openStage(1)}
                >
                    <FaArrowLeft />
                    Back to video
                </button>
                <button type="submit" className={Style.primaryButton}>
                    Continue to thumbnails
                    <FaArrowRight />
                </button>
            </div>
        </form>
    );
}
