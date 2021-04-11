const express = require("express");
const Tag = require("../models/tagModel");
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { tagSchema } = require('../utils/validationSchemas');
const router = express.Router();

const validateTag = (req, res, next) => {
    const { error } = tagSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(', ');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

router.get("/", catchAsync( async (req, res) => {
    const tags = await Tag.find({});
    res.render("tags/tags", { tags });
}));

router.get("/new", (req, res) => {
    res.render("tags/new");
});

router.post("/", validateTag, catchAsync( async (req, res) => {
    const tag = new Tag({ ...req.body.tag });
    await tag.save();
    res.redirect(`/tags/${tag._id}`);
}));

router.get("/:id", catchAsync( async (req, res) => {
    const tag = await Tag.findById(req.params.id);
    res.render("tags/tag", { tag });
}));

router.get("/:id/edit", catchAsync( async (req, res) => {
    const tag = await Tag.findById(req.params.id);
    res.render("tags/edit", { tag });
}));

router.put("/:id", validateTag, catchAsync( async (req, res) => {
    const { id } = req.params;
    const tag = await Tag.findByIdAndUpdate(id, { ...req.body.tag });
    res.redirect(`/tags/${tag._id}`);
}));

router.delete("/:id", catchAsync( async (req, res) => {
    const { id } = req.params;
    const tag = await Tag.findByIdAndDelete(id);
    res.redirect("/tags");
}));

module.exports = router;