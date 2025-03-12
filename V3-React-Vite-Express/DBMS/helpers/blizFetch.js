import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

async function getAccessToken() {
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
}

async function fetchData(server, realm, name) {
    name = name.toLowerCase();
    const result = {};
    let accessToken
    try { // Fetch the access token
        accessToken = await getAccessToken();
    } catch (error) {
        console.log(`Can't fetch token`)
    }

    const headers = {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Use header for authentication
          'Cache-Control': 'no-cache',  // prevents cached responses
          'Pragma': 'no-cache',
        },
    }
    async function getCharProfile(server, realm , name ) {
        const URI = `https://${server}.api.blizzard.com/profile/wow/character/${realm}/${name}?namespace=profile-${server}&locale=en_US`;
        try {
            const data = await (await fetch(URI, headers)).json();
            return data
        } catch (error) {
            console.log(error)
        }

    }
    
    async function getClassMedia(data, headers) {
        const data1 = await(await fetch(data.character_class.key.href, headers)).json();
        const data2 = await ( await fetch(data1.media.key.href, headers)).json();
        console.log(data2)
        return data2.assets[0].value

    }

    try {
        let data = await getCharProfile(server, realm, name);
        result.name = data.name;
        result.blizID = data.id;
        result.level = Number(data.level);
        result.lastLogin = data.last_login_timestamp;
        result.achieves = {};
        result.achieves[`points`] = Number(data.achievement_points);
        result.class = {}
        result.class.name = data.character_class.name;
        // console.log(data);
        // debugger
        try {
            result.class.media = await getClassMedia(data, headers);
            
        } catch (error) {
            console.log(error)
        }


    } catch (error) {
        console.log(error)
    }

    console.log(result);
    debugger
}



fetchData(`eu`, `chamber-of-aspects`, `Lychezar`)