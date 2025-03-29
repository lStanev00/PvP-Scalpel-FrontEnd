
export default async function httpFetchWithCredentials(endpoint, options = {}) {
    const apiDomain = "https://api.pvpscalpel.com";

    const defaultOptions = {

        credentials: "include", // always include cookies
        headers: {
          "600": "BasicPass",
          "Content-Type": "application/json",
          ...options.headers,
          cache: 'no-store',
        },
    };

    const finalOptions = { ...defaultOptions, ...options };

    return fetch(apiDomain + endpoint, finalOptions)


}