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
            const data2 = await ( await fetch(data1.media.key.href, headers)).json();
            return data2 ? data2.assets[0].value : undefined
            
        } catch (error) {
            console.log(error);
            return undefined
        }

    }
}


export default helpFetch