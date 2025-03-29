import { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({username:`dasd`});
    
    async function httpFetch(endpoint, options = {}) {
    
        const req = await httpFetchWithCredentials(endpoint, options);
    
        if (req.status === 403) {
            setUser(undefined);

            if (import.meta.env.DEV) {
            console.warn("Session expired please login again ( 403's expected )\nPlease if you have not been loging on other device you can submit issue in github's issues section!");
            } else console.log("Session expired please login again ( 403's expected )\nPlease if you have not been loging on other device you can report this issue to GM Lychezar or in Discord!");
        }
        
        return req
        
    }

    return (
        <UserContext.Provider value={{user, setUser, httpFetch}} >

            {children}

        </UserContext.Provider>
    )
}

async function httpFetchWithCredentials(endpoint, options = {}) {
    const apiDomain = import.meta.env.VITE_API_URL;

    const defaultOptions = {

        credentials: "include", // always include cookies
        headers: {
          "600": "BasicPass",
          "Content-Type": "application/json",
          ...options.headers,
        },
    };

    const finalOptions = { ...defaultOptions, ...options };

    return fetch(apiDomain + endpoint, finalOptions)
}