class guessChar {
    constructor(initialNameSearch, realm) {
        this.charName = initialNameSearch;
        this.realmSlug = realm?.slug;
        this.realmName = realm?.name;
        this.server = realm?.server;
    }
}

export default function fromResultFromSearch(req) {
    if (req.status !== 200) return undefined;
    const {data} = req;
    const { initialSearch, chars, realms } = data;
    const [name, realm, server] = initialSearch.split(":");
    const result = {
        exactMatch: data?.exactMatch || []
    };
    const shadowChars = [...chars] || chars;
    //Buliding the guess for exact match
    if(Array.isArray(chars) && Array.isArray(realms) && realms.length !== 0 && !(data?.exactMatch) && name && realm && realm !== "!undefined") {
        const initialCharRealmSlugSearch = realm;
        for (const char of chars) { 
            const charRealmSlug = char?.char?.playerRealm?.slug || undefined;
            const charName = char?.char?.name.toLowerCase() || undefined;

            if(charRealmSlug && charName) {
                for (const { slug } of realms) {
                    if(slug.includes(initialCharRealmSlugSearch) && slug === charRealmSlug && charName === (name.toLowerCase())) {
                        const index = shadowChars.findIndex(entry => char?.char?._id === entry?.char?._id)
                        if (index) {
                            if (!(Array.isArray(result.exactMatch))) result.exactMatch = [];
                            result.exactMatch.push(shadowChars.splice(index, 1))
                        }
                    }
                }
            }
        }

    }
    result.chars = shadowChars;


    // Build the add guessed character
    if(result.exactMatch) {
        if(
            realm !== "!undefined" 
            && realm 
            && typeof realm === "string" && typeof name === "string" 
            && Array.isArray(result.exactMatch) 
            // && result.exactMatch.length === 0 
            && Array.isArray(result.chars)
        ) {
            result.addChars = [];
            const realmSearchSlugified = realm.toLowerCase().trim().replaceAll((" "), "-")
            const exist = chars.find(entry => {

                    const entrySearch = entry?.char?.search || undefined;
                    if (!entrySearch) return false

                    const search = `${name.toLowerCase().trim()}:${realmSearchSlugified}`
                    return entrySearch.includes(search)
                }
            );

            if(!exist && Array.isArray(realms)) {
                const realmsMatchArr = realms.filter(entry => {
                    const realmSlugEntry = entry?.slug || undefined;
                    if(!realmSlugEntry && typeof realmSlugEntry !== "string") return false;
                    
                    return realmSlugEntry.includes(realmSearchSlugified)
                    
                });
                if (realmsMatchArr.length !== 0) {
                    for (const realmFound of realmsMatchArr) {
                        
                        result.addChars.push(new guessChar(name, realmFound))
                    }
                }
            }

        }
    }

    if(Array.isArray(realm.addChars) && realm.addChars.length === 0) delete realm.addChars;

    return result;
    
}