const apiDomain = "https://api.pvpscalpel.com";

export default async function httpFetch(endpoint, options = {}) {

    const defaultOptions = {

        credentials: "include", // always include cookies
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
    };

    const finalOptions = { ...defaultOptions, ...options };

    return fetch(apiDomain + endpoint, finalOptions)


}