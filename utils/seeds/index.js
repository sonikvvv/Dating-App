const mongoose = require("mongoose");
const Tag = require("../models/tagModel");
const User = require('../models/userModel');

const tagSeeds = require("./tagSeeds");
const userSeeds = require("./userSeeds");
const { userSchema } = require("../validationSchemas");

mongoose.connect("mongodb://localhost:27017/dating-app", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
    console.log("Database connected.");
});

const seedDB = async () => {
    await Tag.deleteMany({});
    for (let i = 0; i < tagSeeds.length; i++) {
        const tag = new Tag({
            title: tagSeeds[i].title,
        });
        await tag.save();
    }

    await User.deleteMany({});
    for (let i = 0; i < userSeeds.length; i++) {
        const user = new User({
            username: userSeeds[i].username,
            sex: userSeeds[i].sex,
            work: userSeeds[i].work,
            email: userSeeds[i].email,
            description: userSeeds[i].description,
            orientation: userSeeds[i].orientation,
            years: userSeeds[i].years,
            position: userSeeds[i].position,
            height: userSeeds[i].height,
            weight: userSeeds[i].weight,
            bodyType: userSeeds[i].bodytype,
            relationshipStatus: userSeeds[i].relationshipStatus,
            nsfw: userSeeds[i].nsfw,
        });
        const registeredUser = await User.register(user, userSeeds[i].password);
    }
    console.log("FINITO");
};

seedDB();
