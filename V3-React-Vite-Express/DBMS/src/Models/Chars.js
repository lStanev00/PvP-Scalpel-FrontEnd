import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
    solo: { type: mongoose.Schema.Types.Mixed },
    solo_bg: { type: mongoose.Schema.Types.Mixed },
    '2v2': {
        currentSeason: {
            rating: {default: 0},
            title: { type: mongoose.Schema.Types.Mixed, default: undefined },
            seasonMatchStatistics: { type: mongoose.Schema.Types.Mixed, default: undefined },
            weeklyMatchStatistics: { type: mongoose.Schema.Types.Mixed, default: undefined }
        },
        lastSeasonLadder: { type: mongoose.Schema.Types.Mixed, default: undefined },
        record: {default: 0}
    },
    '3v3': {
        currentSeason: {
            rating: {default: 0},
            title: { type: mongoose.Schema.Types.Mixed, default: undefined },
            seasonMatchStatistics: { type: mongoose.Schema.Types.Mixed, default: undefined },
            weeklyMatchStatistics: { type: mongoose.Schema.Types.Mixed, default: undefined }
        },
        lastSeasonLadder: { type: mongoose.Schema.Types.Mixed, default: undefined },
        record: {default: 0}
    },
    rbg: {
        rating: {default: 0},
        lastSeasonLadder: {default: undefined},
    }
}, { _id: false });

const achievementsSchema = new mongoose.Schema({
    points: Number, // Collected
    "2s": { type: mongoose.Schema.Types.Mixed },
    "3s": { type: mongoose.Schema.Types.Mixed },
    BG: { type: mongoose.Schema.Types.Mixed },
  }, { _id: false });

const mediaSchema = new mongoose.Schema({
    avatar: String,
    banner: String,
    charImg: String,
}, { _id: false })

const CharSchema = new mongoose.Schema({
    blizID: Number, // Collected
    name: { // Collected
        type: String,
        required: [true, `Name is required`],
    },
    playerRealmSlug: { // Collected
        name : {type: String, required: true},
        slug : {type: String, required: true}
    },
    level : Number, // Collected
    faction: String, // Collected
    race: String, // Collected
    class: {name: String, media: String}, // Collected
    activeSpec: {name: String, media: String}, // Collected
    allSpecs,
    rating: ratingSchema, // Collected
    achieves: achievementsSchema,
    media: mediaSchema,
    checkedCount: Number,
    server: String, // Collected
    gear: {
        head,
        neck,
        shoulder,
        clock,
        chest,
        shirt,
        tabard,
        wrist,
        hands,
        waist,
        legs,
        feet,
        ring1,
        ring2,
        trinket1,
        trinket2,
        wep,
        offHand,
        stats,
        avgIlvl
    },
    alts,
    lastLogin : Number,

}, { timestamps : true });

const Char = mongoose.model(`Characters-Data`, CharSchema);
export default Char