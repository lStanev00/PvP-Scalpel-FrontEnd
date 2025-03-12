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
        result.server = server;
        result.playerRealmSlug = {
            name: data.realm.name,
            slug: data.realm.slug
        }
        result.blizID = data.id;
        result.level = Number(data.level);
        result.faction = data.faction.name
        result.lastLogin = data.last_login_timestamp;
        result.achieves = {points: Number(data.achievement_points)};
        result.class = {name :data.character_class.name};
        result.class.media = await helpFetch.getMedia(data, 'character_class', headers);
        result.race = data.race.name
        result.activeSpec = {
            name: data.active_spec.name,
            media: await helpFetch.getMedia(data , 'active_spec', headers)
        }
        result.rating = await helpFetch.getRating(data.pvp_summary.href, headers, server, result.name);
        result.rating[`2v2`].record = await helpFetch.getAchievById(data.achievements_statistics.href,headers, 370)
        result.rating[`3v3`].record = await helpFetch.getAchievById(data.achievements_statistics.href,headers, 595)
        console.log('Data: ', data)
    } catch (error) {
        console.log(error)
    }

    console.log('Result: ', result);
    debugger
}



fetchData(`eu`, `chamber-of-aspects`, `Lychezar`)