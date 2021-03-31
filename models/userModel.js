const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name: String,
    middle_name: String,
    last_name: String,
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
        enum: ["male", "female"],
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
        enum: ["bottom", "top", "versalite", "vers bttm", "vers top"],
    },
    height: Number,
    weight: Number,
    bodyType: {
        type: String,
        enum: [],
    },
    relationshipStatus: {
        type: String,
        enum: [],
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
});

module.exports = mongoose.model("User", UserSchema);
