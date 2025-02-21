import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
    solo: Number,
    solo_bg: Number,
    '2v2': Number,
    '3v3': Number,
    rbg: Number
});

const achievementsSchema = new mongoose.Schema({
    "2s": {name: String, description: String},
    "3s": {name: String, description: String},
    BG: [{name: String, description: String}]
});

const mediaSchema = new mongoose.Schema({
    avatar: String,
    banner: String,
    charImg: String,
})

const MemberSchema = new mongoose.Schema({
    _id: Number,
    name: {
        type: String,
        required: [true, `Name is required`],
    },
    playerRealmSlug: {type: String, required: true},
    rank: {
        type: Number
    },
    race: String,
    class: String,
    spec: String,
    rating: ratingSchema,
    achieves: achievementsSchema,
    media: mediaSchema


}, { _id: false});

const Member = mongoose.model(`Member`, MemberSchema);

export default Member