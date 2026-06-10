/* eslint-disable react/prop-types */

import { createContext, useCallback, useMemo, useRef, useState } from "react";
import {
    createFEContentCache,
    fetchFEContentResource,
    getCachedFEContent,
} from "../helpers/feContent.js";
import { assetUrl } from "../helpers/assets.js";
import { httpFetchWithCredentials } from "../helpers/httpFetch.js";

export const UserContext = createContext();

/**
 * Provides authenticated request helpers and user state to the React tree.
 *
 * @param {{ children: import("react").ReactNode }} props
 * @returns {import("react").JSX.Element}
 */
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(undefined);
    const [authStatus, setAuthStatus] = useState("checking");
    const inputRef = useRef();
    const feContentCacheRef = useRef(null);

    if (feContentCacheRef.current === null) {
        feContentCacheRef.current = createFEContentCache();
    }

    const httpFetch = useCallback(async (endpoint, options = {}) => {
        const req = await httpFetchWithCredentials(endpoint, options);

        const isDiscordCodeError =
            endpoint === "/link/discord" && Boolean(req.data?.message);

        if (req.status === 403 && !isDiscordCodeError) {
            setUser(null);
            setAuthStatus("guest");

            if (import.meta.env.DEV) {
                console.warn(
                    "Session expired please login again ( 403's expected )\nPlease if you have not been loging on other device you can submit issue in github's issues section!",
                );
            } else
                console.warn(
                    "Session expired please login again ( 403's expected )\nPlease if you have not been loging on other device you can report this issue to GM Lychezar or in Discord!",
                );
        }

        if (endpoint === `/verify/me`) {
            if (req.status === 200 && req.data?._id) {
                setUser(req.data);
                setAuthStatus("authenticated");
            } else {
                setUser(null);
                setAuthStatus("guest");
            }
        }

        return req;
    }, []);

    const fetchFEContent = useCallback(
        (path) => fetchFEContentResource(httpFetch, path),
        [httpFetch],
    );

    const getFEContent = useCallback(
        (path) => getCachedFEContent(feContentCacheRef.current, fetchFEContent, path),
        [fetchFEContent],
    );

    const FEContent = useMemo(() => {
        return {
            homeHeroVideo: () => assetUrl("landing.mp4"),
            appBG: () => assetUrl("backg.png"),
            get: getFEContent,
        };
    }, [getFEContent]);

    const value = useMemo(() => {
        return { user, setUser, authStatus, httpFetch, inputRef, fetchFEContent, FEContent };
    }, [user, authStatus, httpFetch, fetchFEContent, FEContent]);

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
