const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const Chat = require("./chatModel");
const { cloudinary } = require("../../cloudinary/index");

const ImageSchema = new Schema({
    url: String,
    filename: String,
    _id: false,
});

ImageSchema.virtual("thumbnail").get(function () {
    return this.url.replace("/upload", "/upload/w_200");
});

ImageSchema.virtual("circle").get(function () {
    return this.url.replace("/upload", "/upload/c_lfill,h_150,r_max,w_150");
});

const UserSchema = new Schema({
    email: String,
    access: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
    images: [ImageSchema],
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
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
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
    filter: {
        sex: { type: String },
        user_orientation: { type: String },
        years: {
            years_from: { type: Number },
            years_to: { type: Number },
        },
        relationshipStatus: { type: String },
        bodyType: { type: String },
    },
    liked: [
        {
            _id: false,
            chatId: { type: Schema.Types.ObjectId, ref: "Chat" },
            userId: { type: Schema.Types.ObjectId, ref: "User" },
        },
    ],
    disliked: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

UserSchema.post("findByIdAndDelete", async function (doc) {
    if (doc){
        doc.licked.forEach(async (like) => {
            if (like.chatId) {
                await Chat.findByIdAndDelete(like.chatId);
            }
        });

        doc.images.forEach(async (img) => {
            await cloudinary.uploader.destroy(img.filename);
        });
    }
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);
