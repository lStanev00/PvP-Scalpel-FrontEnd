import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
    solo: { type: mongoose.Schema.Types.Mixed },
    solo_bg: { type: mongoose.Schema.Types.Mixed },
    '2v2': { type: mongoose.Schema.Types.Mixed },
    '3v3': { type: mongoose.Schema.Types.Mixed },
    rbg: { type: mongoose.Schema.Types.Mixed }
}, { _id: false });

const achievementsSchema = new mongoose.Schema({
    points: Number,
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
    blizID: Number,
    name: {
        type: String,
        required: [true, `Name is required`],
    },
    playerRealmSlug: {type: String, required: true},
    level : Number,
    faction: String,
    race: String,
    class: {name: String, media: String},
    activeSpec: String,
    allSpecs,
    rating: ratingSchema,
    achieves: achievementsSchema,
    media: mediaSchema,
    checkedCount: Number,
    region: String,
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
        wast,
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