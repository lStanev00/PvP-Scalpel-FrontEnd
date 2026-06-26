import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../../hooks/ContextVariables.jsx";
import { useMediaUploadContext } from "../MediaUploadContext.js";
import uploadBlobToSignedUrl from "./uploadBlobToSignedUrl.ts";

const SOCKET_URL = "wss://ws.pvpscalpel.com/";

export default function VideoUpload() {
    const { httpFetch } = useContext(UserContext);
    const { videoChunks } = useMediaUploadContext();
    const [uploadStage, setUploadStage] = useState(0);
    const [uploadLinks, setUploadLinks] = useState([]);
    const [mediaMetaDoc, setMediaMetaDoc] = useState();
    const [error, setError] = useState("");
    const wsRef = useRef(null);

    const closeSocket = useCallback(() => {
        const socket = wsRef.current;

        wsRef.current = null;

        if (
            socket &&
            (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)
        ) {
            socket.close();
        }
    }, []);

    const getUploadSocket = useCallback(() => {
        const existing = wsRef.current;

        if (existing?.readyState === WebSocket.OPEN) {
            return Promise.resolve(existing);
        }

        if (existing?.readyState === WebSocket.CONNECTING) {
            return new Promise((resolve, reject) => {
                existing.addEventListener("open", () => resolve(existing), { once: true });
                existing.addEventListener("error", () => reject(new Error("Upload websocket failed to connect.")), {
                    once: true,
                });
            });
        }

        return new Promise((resolve, reject) => {
            const socket = new WebSocket(SOCKET_URL);
            wsRef.current = socket;

            socket.addEventListener("open", () => resolve(socket), { once: true });
            socket.addEventListener("error", () => reject(new Error("Upload websocket failed to connect.")), {
                once: true,
            });
            socket.addEventListener("message", (event) => {
                if (typeof event.data !== "string") return;

                try {
                    JSON.parse(event.data);
                } catch {
                    setError("Received an invalid websocket payload.");
                }
            });
            socket.addEventListener("close", () => {
                if (wsRef.current === socket) {
                    wsRef.current = null;
                }
            });
        });
    }, []);

    const initializeUpload = useCallback(async () => {
        setError("");

        const exportBody = {
            fileData: [],
        };

        if (videoChunks === null) {
            console.warn(`vChunks is null`);
            return null;
        }

        for (const chunk of videoChunks) {
            exportBody.fileData.push(`part-${chunk.index}`);
        }

        const req = await httpFetch("/media", {
            method: "POST",
            body: JSON.stringify(exportBody),
        });

        if (req.status === 201) {
            setUploadLinks(Array.isArray(req.data?.urls) ? req.data.urls : []);
            setMediaMetaDoc(req.data.mediaObj);
            setUploadStage(1);
        }
    }, [httpFetch, videoChunks]);

    const startUpload = useCallback(async () => {
        if (!videoChunks?.length || !uploadLinks.length || !mediaMetaDoc?._id) {
            setError("Upload is not initialized.");
            return;
        }

        setError("");
        setUploadStage(1);

        try {
            const socket = await getUploadSocket();

            for (let i = 0; i < uploadLinks.length; i += 1) {
                const signedUrl = uploadLinks[i];
                const chunk = videoChunks[i];

                if (!signedUrl || !chunk?.blob) {
                    throw new Error("Missing upload part data.");
                }

                await uploadBlobToSignedUrl(chunk.blob, signedUrl);

                socket.send(JSON.stringify({
                    type: "uploadMedia",
                    data: {
                    type: "uploadFeedback",
                    msgContext: {
                        mediaID: mediaMetaDoc._id,
                            index: chunk.index,
                            route: `videos/${mediaMetaDoc._id}/part_${chunk.index}`,
                        },
                    },
                }));
            }

            setUploadStage(2);
        } catch (err) {
            setError(err?.message || "Failed to upload video.");
            setUploadStage(1);
        }
    }, [getUploadSocket, mediaMetaDoc, uploadLinks, videoChunks]);

    useEffect(() => {
        return closeSocket;
    }, [closeSocket]);

    if (uploadStage === 0) {
        return (
            <>
                <p>initializing</p>
                <button type="button" onClick={initializeUpload}>Initialize upload</button>
                {error && <p>{error}</p>}
            </>
        );
    }

    if (uploadStage === 1) {
        return (
            <>
                <p>uploading please wait</p>
                <button type="button" onClick={startUpload}>Start upload</button>
                {error && <p>{error}</p>}
            </>
        );
    }

    if (uploadStage === 2) return <p>upload complete</p>;
}
