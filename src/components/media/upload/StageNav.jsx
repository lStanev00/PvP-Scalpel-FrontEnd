import { FaCheck } from "react-icons/fa6";
import Style from "../../../Styles/modular/MediaUpload.module.css";
import { MEDIA_UPLOAD_STAGES } from "./mediaUploadConstants.js";
import { useMediaUpload } from "./MediaUploadContext.jsx";

export default function StageNav() {
    const {
        canOpenStage,
        currentStage,
        openStage,
        preparingVideo,
        stageComplete,
    } = useMediaUpload();

    return (
        <nav className={Style.stageNav} aria-label="Media editor stages">
            {MEDIA_UPLOAD_STAGES.map((stage) => {
                const active = currentStage === stage.id;
                const complete = stageComplete(stage.id);
                const unlocked = canOpenStage(stage.id);

                return (
                    <button
                        type="button"
                        key={stage.id}
                        className={`${Style.stageButton} ${
                            active ? Style.stageActive : ""
                        } ${complete ? Style.stageComplete : ""}`}
                        disabled={preparingVideo || !unlocked}
                        onClick={() => openStage(stage.id)}
                        aria-current={active ? "step" : undefined}
                    >
                        <span>{complete ? <FaCheck /> : stage.id}</span>
                        <strong>{stage.label}</strong>
                        <small>{stage.detail}</small>
                    </button>
                );
            })}
        </nav>
    );
}
