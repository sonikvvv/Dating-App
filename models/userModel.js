const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: String,
    middleName: String,
    lastName: String,
    email: String,
    access: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
    password: String,
    badges: [Schema.Types.ObjectId],
    images: [
        {
            type: String,
        },
    ],
    years: Number,
    sex: {
        type: String,
        enum: [
            "Male",
            "Female",
            "Transgender",
            "Two-Spirit",
            "Cisgender",
            "Non-Binary",
            "Genderqueer",
            "Gender fluid",
            "Gender neutral",
        ],
    },
    work: String,

    orientation: {
        type: String,
        enum: [
            "Lesbian",
            "Bisexual",
            "Pansexual",
            "Gay",
            "Asexual",
            "Allosexual",
            "Heterosexual",
            "Homosexual",
            "Monosexual",
            "Polysexual",
            "Queer",
        ],
    },
    tags: [Schema.Types.ObjectId],
    description: String,
    position: {
        type: String,
        enum: ["Bottom", "Top", "Versalite", "Vers Bottom", "Vers Top"],
    },
    height: Number,
    weight: Number,
    bodyType: {
        type: String,
        enum: ["Average", "Large", "Muscular", "Slim", "Stocky", "Toned"],
    },
    relationshipStatus: {
        type: String,
        enum: [
            "Commited",
            "Dating",
            "Engaged",
            "Exclusive",
            "Married",
            "Open Relationship",
            "Partnered",
            "Single",
        ],
    },
    nsfw: {
        type: String,
        enum: ["Yes", "No"],
    },
    socialLincks: [
        {
            type: String,
        },
    ],
    level: {
        type: String,
        enum: ["Peasant", "Aristocrat", "King / Queen", "God Mode"],
        default: "Peasant",
    },
});

module.exports = mongoose.model("User", UserSchema);
