import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../hooks/ContextVariables.jsx";
import mappedVideos from "../../helpers/normalizeVideoObj.js";
import Loading from "../loading.jsx";
import VideoCard from "../VideoCard/VideoCard.jsx";

export default function ViewUserVideos() {
    const [videosList, setVideosList] = useState(null);
    const { httpFetch } = useContext(UserContext);

    useEffect(() => {
        const retrieveVideos = async () => {
            const req = await httpFetch("/videos/user");

            if (req.status === 200) {
                const normalized = mappedVideos(req.data);

                if (normalized) {
                    setVideosList(normalized);
                } else {
                    setVideosList(undefined);
                }
            }
        };

        retrieveVideos();
    }, []);

    if (videosList === null) {
        return <Loading />;
    }

    if (videosList === undefined) {
        return (
            <div style={styles.message}>
                There was a problem retrieving your videos. Contact a GM or mod in Discord.
            </div>
        );
    }

    if (videosList.length === 0) {
        return (
            <div style={styles.emptyWrapper}>
                <div style={styles.emptyState}>
                    <div style={styles.emptyIcon}>▶</div>

                    <div style={styles.emptyTitle}>No videos yet</div>

                    <div style={styles.emptyText}>Your uploaded videos will appear here.</div>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>Your Videos</h2>
                <span style={styles.count}>{videosList.length}</span>
            </div>

            <div style={styles.grid}>
                {videosList.map((entry) => (
                    <VideoCard key={entry._id} video={entry} />
                ))}
            </div>
        </div>
    );
}

const styles = {
    emptyWrapper: {
        width: "100%",
        minHeight: "300px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    emptyState: {
        padding: "28px 40px",
        textAlign: "center",

        background: "rgba(15, 15, 25, 0.78)",
        backdropFilter: "blur(8px)",

        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "12px",

        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.25)",
    },

    emptyIcon: {
        fontSize: "22px",
        opacity: 0.45,
        marginBottom: "10px",
    },

    emptyTitle: {
        fontSize: "16px",
        fontWeight: "600",
        color: "#fff",
        marginBottom: "5px",
    },

    emptyText: {
        fontSize: "13px",
        color: "rgba(255, 255, 255, 0.55)",
    },
};
