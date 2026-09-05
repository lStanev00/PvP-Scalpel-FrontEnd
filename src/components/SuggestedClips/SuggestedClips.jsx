/* eslint-disable react/prop-types -- Uses the shared VideoCard display model. */
import { useId } from "react";
import { Link } from "react-router-dom";
import VideoCard from "../VideoCard/VideoCard.jsx";
import Style from "./SuggestedClips.module.css";

/** @param {{ videos?: import("../VideoCard/VideoCard.jsx").VideoCardData[] }} props */
export default function SuggestedClips({ videos = [] }) {
    const headingID = useId();

    if (!Array.isArray(videos) || videos.length === 0) return null;

    return (
        <aside className={Style.sidebar} aria-labelledby={headingID}>
            <header className={Style.header}>
                <h2 id={headingID} className={Style.heading}>More clips</h2>
                <Link className={Style.viewAll} to="/watch">View all <span aria-hidden="true">→</span></Link>
            </header>
            <ul className={Style.list}>
                {videos.map((video) => (
                    <li className={Style.item} key={video.id}>
                        <VideoCard video={video} variant="compact" />
                    </li>
                ))}
            </ul>
        </aside>
    );
}
