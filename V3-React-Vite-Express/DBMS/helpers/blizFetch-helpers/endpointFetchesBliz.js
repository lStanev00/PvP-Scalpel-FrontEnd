const helpFetch = {
    getAccessToken : async function (clientId, clientSecret) {
        const tokenUrl = 'https://eu.battle.net/oauth/token';
        
        try {
            const response = await fetch(tokenUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
                },
                body: 'grant_type=client_credentials',
            });
    
            if (!response.ok) {
                throw new Error(`!! Failed to fetch token: ${response.statusText}`);
            }
    
            const data = await response.json();
            let token = data.access_token;
            return token;
        } catch (error) {
            console.error('Error fetching access token:', error);
            throw error;
        }
    },
    getCharProfile: async function (server, realm , name, headers ) {
        const URI = `https://${server}.api.blizzard.com/profile/wow/character/${realm}/${name}?namespace=profile-${server}&locale=en_US`;
        try {
            const data = await (await fetch(URI, headers)).json();
            return data
        } catch (error) {
            console.log(error)
        }

    },
    getMedia : async function (data, path, headers) {
        try {
            const data1 = await(await fetch(data[path].key.href, headers)).json();
            try {
                const data2 = await ( await fetch(data1.media.key.href, headers)).json();
                return data2 ? data2.assets[0].value : undefined
                
            } catch (error) {
                return data1.assets[0].value
            }
            
        } catch (error) {
            console.log(error);
            return undefined
        }

    },
    getRating: async function(path, headers) {
        try {
            const bracketsCheatSheet = {
                "SHUFFLE": `solo`,
                "BLITZ": "solo_bg",
                "ARENA_2v2": "2v2",
                "ARENA_3v3": "3v3",
                "BATTLEGROUNDS": "rbg",
              }
            let SeasonID;
            let result = {
                solo: {},
                solo_bg: {},
                '2v2': {
                    rating: undefined,
                    lastSeason: undefined,
                    record: undefined
                },
                '3v3': {
                    rating: undefined,
                    lastSeason: undefined,
                    record: undefined
                },
                rbg: {
                    rating: undefined,
                    lastSeason: undefined,
                }
            }
            const brackets = (await (await fetch(path, headers)).json()).brackets;
            for (const bracketHref of brackets) {
                const data = await ( (await fetch(bracketHref.href, headers)).json());
                // let {bracket, rating, season_match_statistics, weekly_match_statistics, specialization} = data.entries();
                SeasonID = data.season.id;
                const currentBracket = data.bracket.type;
                if (currentBracket === `BLITZ` || currentBracket === `SHUFFLE`){
                    const curentBracketData = {
                        currentSeason : {
                            rating: data.rating,
                            title: await helpFetch.getPvPTitle(data.tier.key.href, headers)
                        },

                    }
                    console.log(curentBracketData)
                } else {

                }


            }
            // console.log('getRating: ', result)
        } catch (error) {
            console.log(error)
        }
    },
    getPvPTitle: async function (href, headers) {
        try {
            const data = await (await fetch(href, headers)).json();
            let result = {
                name: data.name.en_GB,
                media: await helpFetch.getMedia(data, `media`, headers)
            }
            return result
        } catch (error) {
            console.log(error);
            return undefined
        }
    }
}


export default helpFetch