import dotenv from 'dotenv';
import helpFetch from './blizFetch-helpers/endpointFetchesBliz.js'
dotenv.config({ path: '../../.env' });

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

async function fetchData(server, realm, name) {
    name = name.toLowerCase();
    const result = {};
    let accessToken = await helpFetch.getAccessToken(clientId, clientSecret);

    const headers = {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Use header for authentication
          'Cache-Control': 'no-cache',  // prevents cached responses
          'Pragma': 'no-cache',
        },
    }

    try {
        // let data = await getCharProfile(server, realm, name);
        let data = await helpFetch.getCharProfile(server, realm, name, headers);
        result.name = data.name;
        result.blizID = data.id;
        result.level = Number(data.level);
        result.lastLogin = data.last_login_timestamp;
        result.achieves = {};
        result.achieves[`points`] = Number(data.achievement_points);
        result.class = {}
        result.class.name = data.character_class.name;
        result.class.media = await helpFetch.getClassMedia(data, headers);

    } catch (error) {
        console.log(error)
    }

    console.log(result);
    debugger
}



fetchData(`eu`, `chamber-of-aspects`, `Lychezar`)