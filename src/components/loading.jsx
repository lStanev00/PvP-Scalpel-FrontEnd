/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import MagnifierSearchStyle from "../Styles/modular/MaginifierSearch.module.css";

export default function Loading({ height = undefined }) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <div
            className={MagnifierSearchStyle.animationContainer}
            style={height ? { height: `${height}px` } : undefined}
            aria-hidden="true"
            data-nosnippet
        >
            {isClient ? (
                <video
                    src="/animations/output1.webm"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="none"
                    disablePictureInPicture
                    disableRemotePlayback
                    className={MagnifierSearchStyle.animation}
                    style={height ? { height: `${height}px` } : undefined}
                    tabIndex={-1}
                    aria-hidden="true"
                />
            ) : (
                <div className={MagnifierSearchStyle.fallbackSpinner} />
            )}
        </div>
    );
}
