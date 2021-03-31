const mongoose = require("mongoose");
const Tag = require("../models/tagModel");
const tagSeeds = require('./tagSeeds');

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
            title: tagSeeds[i].title
        });
        await tag.save();
    }
}

seedDB();