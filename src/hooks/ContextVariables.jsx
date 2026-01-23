import { createContext, useRef, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(undefined);    
    const inputRef = useRef();
    
    async function httpFetch(endpoint, options = {}) {
        const req = await httpFetchWithCredentials(endpoint, options);
    
        if (req.status === 403) {
            setUser(undefined);

            if (import.meta.env.DEV) {
            console.warn("Session expired please login again ( 403's expected )\nPlease if you have not been loging on other device you can submit issue in github's issues section!");
            } else console.warn("Session expired please login again ( 403's expected )\nPlease if you have not been loging on other device you can report this issue to GM Lychezar or in Discord!");
        }

        if(endpoint === `/verify/me`) {
            setUser(req.data)
        }
        
        return req
        
    }

    return (
        <UserContext.Provider value={{user, setUser, httpFetch, inputRef}} >

            {children}

        </UserContext.Provider>
    )
}

async function httpFetchWithCredentials(endpoint, options = {}) {
    const apiDomain = import.meta.env.VITE_API_URL || "https://api.pvpscalpel.com/";
    if (!apiDomain) {
        return {
            status: 0,
            ok: false,
            error: "VITE_API_URL is not configured",
        };
    }
    const defaultOptions = {

        credentials: "include", // always include cookies
        headers: {
          "600": "BasicPass",
          "Content-Type": "application/json",
          ...options.headers,
        },
    };

    if (import.meta.env.MODE == `development`) {
        defaultOptions.headers.ga6n1fa4fcvt = "EiDcafRc45$td4aedrgh4615tokenbtw"
    }

    const finalOptions = { ...defaultOptions, ...options };

    // return fetch(apiDomain + endpoint, finalOptions);

    // To keep the console clean keep make the errors catched...

    try {
        const res = await fetch(apiDomain + endpoint, finalOptions);

        let data = null;
        const contetType = res.headers.get("content-type");

        if (contetType && contetType.includes(`application/json`)){
            data = await res.json();
        }

        return {
            status : res.status,
            ok: res.ok,
            data,
        }
    } catch (error) {

        return {
            status: 0,
            ok: false,
            error: error.message || "Debug this case"
        }
        
    }

}
