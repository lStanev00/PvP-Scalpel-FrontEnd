/* eslint-disable react/prop-types */

import { createContext, useCallback, useMemo, useRef, useState } from "react";
import {
    createFEContentCache,
    fetchFEContentResource,
    getCachedFEContent,
} from "../helpers/feContent.js";
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
    const inputRef = useRef();
    const feContentCacheRef = useRef(null);

    if (feContentCacheRef.current === null) {
        feContentCacheRef.current = createFEContentCache();
    }

    const httpFetch = useCallback(async (endpoint, options = {}) => {
        const req = await httpFetchWithCredentials(endpoint, options);

        if (req.status === 403) {
            setUser(undefined);

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
            if (req.status === 200) setUser(req.data);
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
            homeHeroVideo: () => getFEContent("landing.mp4"),
            appBG: () => getFEContent("backg.png"),
            get: getFEContent,
        };
    }, [getFEContent]);

    const value = useMemo(() => {
        return { user, setUser, httpFetch, inputRef, fetchFEContent, FEContent };
    }, [user, httpFetch, fetchFEContent, FEContent]);

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
