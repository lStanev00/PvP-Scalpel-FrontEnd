import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { UserContext } from "../hooks/ContextVariables.jsx";
import VideoPlayer from "../components/VideoPlayer/VideoPlayer.jsx";
import UserDataContainer from "../components/checkDetails/UserDataContainer.jsx";
import Loading from "../components/loading.jsx";
import Comments from "../components/checkDetails/Comments.jsx";
import { CommentsProvider } from "../components/checkDetails/CommentsContext.js";

export default function Watch() {
    const { videoID } = useParams();
    const { httpFetch } = useContext(UserContext);
    const [videoDoc, setVideoDoc] = useState(undefined);
    const CONTENT_ROOT = "https://bucket.pvpscalpel.com/pvp-scalpel-frontend/";
    function buildPath(path) {
        if (typeof path !== "string" || !path.trim()) return null;

        try {
            return new URL(path, CONTENT_ROOT).href;
        } catch {
            return null;
        }
    }

    useEffect(() => {
        let cancelled = false;

        const retriveVideo = async () => {
            setVideoDoc(undefined);
            const response = await httpFetch(`/video/${videoID}`);
            if (cancelled) return;

            if (response.status === 200) {
                setVideoDoc(response.data);
            } else if (response.status === 403) {
                setVideoDoc(403);
            } else if (response.status === 451) {
                setVideoDoc(451);
            }
        };

        retriveVideo();

        return () => {
            cancelled = true;
        };
    }, [httpFetch, videoID]);

    if (videoDoc && typeof videoDoc !== "number") {
        const contextWindow = {
            data: {
                ...videoDoc,
                checkedCount: videoDoc.views ?? videoDoc.checkedCount ?? 0,
            },
            location: `/watch/${videoDoc._id}`,
        };

        return (
            <CommentsProvider initialPosts={videoDoc.comments} entryID={videoDoc._id}>
                <div>
                    <VideoPlayer
                        src={buildPath(videoDoc.manifest.video)}
                        poster={buildPath(videoDoc.manifest.thumbnail)}
                        title={videoDoc.title}
                        brackedId={videoDoc.bracket?._id ?? videoDoc.bracket ?? 0}
                    />
                    <UserDataContainer contextWindow={contextWindow} />
                    <Comments />
                </div>
            </CommentsProvider>
        );
    }

    return <Loading />;
}
