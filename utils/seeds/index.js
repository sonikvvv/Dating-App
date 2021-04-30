const mongoose = require("mongoose");
const Tag = require("../models/tagModel");
const Rule = require("../models/ruleModel");
const Badge = require("../models/badgeModel");
const badgeSeeds = require("./badgeSeeds");
const ruleSeeds = require("./ruleSeeds");
const tagSeeds = require("./tagSeeds");

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

    await Rule.deleteMany({});
    for (let i = 0; i < ruleSeeds.length; i++) {
        const rule = new Rule({
            title: ruleSeeds[i].title,
            description: ruleSeeds[i].description,
        });
        await rule.save();
    }

    await Badge.deleteMany({});
    for (let i = 0; i < badgeSeeds.length; i++) {
        const badge = new Badge({
            title: badgeSeeds[i].title,
            description: badgeSeeds[i].description,
            image: badgeSeeds[i].image,
        });
        await badge.save();
    }
    console.log("FINITO");
};

seedDB();
