import { FaCheck } from "react-icons/fa6";
import PvPScalpelVideoPlayer from "../PvPScalpelVideoPlayer.jsx";
import { formatMediaTime } from "../../../helpers/mediaFormatting.js";
import Style from "../../../Styles/modular/MediaUpload.module.css";
import {
    formatBytes,
    formatMiB,
    formatVideoType,
} from "./mediaUploadFormatting.js";
import { useMediaUpload } from "./context/useMediaUpload.js";

export default function ReadyMediaPreview() {
    const { readyMedia } = useMediaUpload();

    if (!readyMedia) return null;

    return (
        <section className={Style.ready}>
            <div className={Style.readyBadge}>
                <FaCheck />
                Media package ready
            </div>
            <div className={Style.readyGrid}>
                <div>
                    <PvPScalpelVideoPlayer
                        src={readyMedia.videoUrl}
                        poster={readyMedia.thumbnailUrl}
                        title={readyMedia.title}
                    />
                </div>
                <article className={Style.readyDetails}>
                    <img src={readyMedia.thumbnailUrl} alt="Selected video cover" />
                    <h2>{readyMedia.title}</h2>
                    <p>{readyMedia.description}</p>
                    <dl>
                        <div>
                            <dt>Source</dt>
                            <dd>{formatVideoType(readyMedia.chunkManifest)}</dd>
                        </div>
                        <div>
                            <dt>Duration</dt>
                            <dd>{formatMediaTime(readyMedia.duration)}</dd>
                        </div>
                        <div>
                            <dt>Size</dt>
                            <dd>{formatBytes(readyMedia.chunkManifest.totalBytes)}</dd>
                        </div>
                        <div>
                            <dt>Parts</dt>
                            <dd>{readyMedia.chunkManifest.chunkCount}</dd>
                        </div>
                        <div>
                            <dt>Part size</dt>
                            <dd>
                                {formatMiB(
                                    readyMedia.chunkManifest.totalBytes
                                        / readyMedia.chunkManifest.chunkCount,
                                )}{" "}
                                approx.
                            </dd>
                        </div>
                        <div>
                            <dt>Characters</dt>
                            <dd>{readyMedia.characterIds.length}</dd>
                        </div>
                    </dl>
                    <div className={Style.readyCharacters}>
                        {readyMedia.characters.map((character) => (
                            <span key={character.id}>
                                <img src={character.image} alt="" />
                                {character.name}
                            </span>
                        ))}
                    </div>
                </article>
            </div>
        </section>
    );
}
