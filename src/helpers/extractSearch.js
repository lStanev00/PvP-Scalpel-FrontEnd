export default function exctractSearch (inputString) {
    if(inputString === "") return undefined
    if(typeof inputString !== "string" && inputString?.length < 3) return undefined
    if(inputString === undefined) return undefined
    let searchParts = inputString.trim();

    if (inputString.includes("-")) searchParts = inputString.trim().split("-");

    let name = undefined;
    let realm = undefined;
    let server = undefined;

    if (!searchParts) {
        return undefined
    } else if (Array.isArray(searchParts)) {
        if(searchParts.length > 0 ) {
            name = searchParts[0].trim();
            realm = "!undefined";
            server = "!undefined"
        }
        if (searchParts.length > 1) realm = searchParts[1].trim();
        if (searchParts.length > 2) server = searchParts[2].trim();
    } else if (typeof searchParts === "string"){
        name = searchParts.trim();
    }

    if(name === undefined) return undefined
    if (realm === undefined) realm = "!undefined";
    if (server === undefined) server = "!undefined";
            
    const result = [name, realm, server].join(":");
    return result;
}