/* eslint-disable react/prop-types -- Props use the documented catalogue display model. */
import { FiVideo } from "react-icons/fi";
import { Link } from "react-router-dom";
import { publicAssetUrl } from "../../helpers/assets.js";
import Style from "./VideoCard.module.css";

const VIEW_ICON_URL = publicAssetUrl("user_action_icons/View_Count.png");

/**
 * Display-ready catalogue values, not a raw /videos response.
 * The caller owns URL resolution, bracket lookup and metadata formatting.
 * @typedef {object} VideoCardData
 * @property {string} id
 * @property {string} title
 * @property {string | null} [thumbnail] Resolved image URL.
 * @property {{ name: string, key?: string }} [bracket]
 * @property {string | null} [views] Formatted label, e.g. "1.2K views".
 * @property {{ value: string, exact: string, label: string } | null} [date]
 */

/** @param {{ video: VideoCardData, variant?: "grid" | "compact" }} props */
export default function VideoCard({ video, variant = "grid" }) {
    const isCompact = variant === "compact";
    const Heading = isCompact ? "h3" : "h2";

    return (
        <Link
            className={`${Style.cardLink} ${isCompact ? Style.compact : ""}`}
            to={`/watch/${encodeURIComponent(video.id)}`}
        >
            <div className={Style.thumbnail}>
                {video.thumbnail ? (
                    <img src={video.thumbnail} alt="" loading="lazy" decoding="async" />
                ) : (
                    <span className={Style.thumbnailFallback}>
                        <FiVideo aria-hidden="true" />
                    </span>
                )}
            </div>

            <div className={Style.body}>
                <Heading className={Style.title}>{video.title}</Heading>
                {video.bracket?.name && (
                    <p className={Style.bracket}>{video.bracket.name}</p>
                )}
                {(video.views || video.date) && (
                    <p className={Style.metadata}>
                        {video.views && (
                            <span className={Style.views}>
                                <img src={VIEW_ICON_URL} alt="" aria-hidden="true" />
                                {video.views}
                            </span>
                        )}
                        {video.date && (
                            <time
                                dateTime={video.date.value}
                                title={video.date.exact}
                                aria-label={`${video.date.label}, ${video.date.exact}`}
                            >
                                {video.date.label}
                            </time>
                        )}
                    </p>
                )}
            </div>
        </Link>
    );
}
