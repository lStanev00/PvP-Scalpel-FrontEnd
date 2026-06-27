import { FiUploadCloud } from "react-icons/fi";
import { useMediaUploadContext } from "./MediaUploadContext.js";
import VideoInput from "./VideoInput/VideoInput.jsx";
import Style from "./MediaUploadMain.module.css";
import { useEffect, useRef, useState } from "react";
import VideoUpload from "./VideoUpload/VideoUpload.jsx";
import { createWebSocketWithCredentials } from "../../helpers/wsConnect.js";

export default function MediaUploadMain() {
    const { videoInputRef } = useMediaUploadContext();
    const [activeStage, setStage] = useState(0);
    const uploadSocketRef = useRef(null);
    const [uploadSocket, setUploadSocket] = useState(null);
    const [uploadSocketStatus, setUploadSocketStatus] = useState("connecting");
    const [uploadSocketError, setUploadSocketError] = useState("");

    useEffect(() => {
        const socket = createWebSocketWithCredentials();

        uploadSocketRef.current = socket;
        setUploadSocket(socket);
        setUploadSocketStatus("connecting");
        setUploadSocketError("");

        const handleOpen = () => {
            if (uploadSocketRef.current !== socket) return;
            setUploadSocketStatus("open");
            setUploadSocketError("");
        };

        const handleError = () => {
            if (uploadSocketRef.current !== socket) return;
            setUploadSocketStatus("error");
            setUploadSocketError("The upload websocket connection reported an unexpected error.");
        };

        const handleClose = () => {
            if (uploadSocketRef.current !== socket) return;
            uploadSocketRef.current = null;
            setUploadSocketStatus("closed");
        };

        socket.addEventListener("open", handleOpen);
        socket.addEventListener("error", handleError);
        socket.addEventListener("close", handleClose);

        return () => {
            socket.removeEventListener("open", handleOpen);
            socket.removeEventListener("error", handleError);
            socket.removeEventListener("close", handleClose);

            if (uploadSocketRef.current === socket) {
                uploadSocketRef.current = null;
            }

            if (
                socket.readyState === WebSocket.OPEN ||
                socket.readyState === WebSocket.CONNECTING
            ) {
                socket.close();
            }
        };
    }, []);

    const stages = [
        [
            () => <VideoInput videoInputRef={videoInputRef} setStage={setStage} />,
            "Select a file first. Details and publishing settings come after the file is ready.",
        ],
        [
            () => (
                <VideoUpload
                    uploadSocket={uploadSocket}
                    uploadSocketStatus={uploadSocketStatus}
                    uploadSocketError={uploadSocketError}
                />
            ),
            "Video selected. Upload the prepared media parts next.",
        ],
    ];

    return (
        <main className={Style.page}>
            <div className={Style.backdrop} aria-hidden="true">
                <span className={`${Style.glow} ${Style.glowTop}`} />
                <span className={`${Style.glow} ${Style.glowSide}`} />
                <span className={Style.pattern} />
            </div>

            <section className={Style.shell} aria-labelledby="media-upload-title">
                <header className={Style.hero}>
                    <div className={Style.heroInner}>
                        <div className={Style.badge}>
                            <FiUploadCloud className={Style.badgeIcon} />
                            <span>Media upload</span>
                        </div>

                        <h1 className={Style.title} id="media-upload-title">
                            Upload WoW video
                            <span className={Style.titleUnderline} />
                        </h1>

                        <p className={Style.heroText}>
                            {stages[activeStage] && stages[activeStage][1]}
                        </p>
                    </div>
                </header>

                {stages[activeStage] && stages[activeStage][0]()}
            </section>
        </main>
    );
}
