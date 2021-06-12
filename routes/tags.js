const express = require("express");
const Tag = require("../utils/models/tagModel");
const catchAsync = require("../utils/catchAsync");
const router = express.Router();
const { validateTag, isLoggedIn, isAdmin } = require("../utils/middleware");

router.get(
    "/",
    isAdmin,
    catchAsync(async (req, res) => {
        const tags = await Tag.find({});
        res.render("tags/tags", { tags });
    })
);

router.get("/new", isLoggedIn, isAdmin, (req, res) => {
    res.render("tags/new");
});

router.post(
    "/",
    validateTag,
    isLoggedIn,
    isAdmin,
    catchAsync(async (req, res) => {
        const tag = new Tag({ ...req.body.tag });
        await tag.save();
        res.redirect(`/tags/${tag._id}`);
    })
);

router.get(
    "/:id",
    isAdmin,
    catchAsync(async (req, res) => {
        const tag = await Tag.findById(req.params.id);
        res.render("tags/tag", { tag });
    })
);

router.get(
    "/:id/edit",
    isLoggedIn,
    isAdmin,
    catchAsync(async (req, res) => {
        const tag = await Tag.findById(req.params.id);
        res.render("tags/edit", { tag });
    })
);

router.put(
    "/:id",
    validateTag,
    isLoggedIn,
    isAdmin,
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const tag = await Tag.findByIdAndUpdate(id, { ...req.body.tag });
        res.redirect(`/tags/${tag._id}`);
    })
);

router.delete(
    "/:id",
    isLoggedIn,
    isAdmin,
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const tag = await Tag.findByIdAndDelete(id);
        res.redirect("/tags");
    })
);

module.exports = router;
